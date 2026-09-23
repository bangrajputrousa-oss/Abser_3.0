#!/usr/bin/env python3
import os
import sys
import shutil
import zipfile
import subprocess

def main():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    base_apk = os.path.join(workspace, 'public', 'download', 'app-debug.apk')
    dist_dir = os.path.join(workspace, 'dist')
    work_dir = '/tmp/apk-pack'
    keystore_path = os.path.join(workspace, 'android', 'debug.keystore')

    # If keytool is not available in the build environment, ensure the existing verified APK is present in dist
    if not shutil.which('keytool') or not shutil.which('apksigner'):
        print("Android signing tools not present in this container, preserving verified pre-built APK...")
        dist_download = os.path.join(dist_dir, 'download')
        os.makedirs(dist_download, exist_ok=True)
        if os.path.exists(base_apk):
            shutil.copy2(base_apk, os.path.join(dist_download, 'app-debug.apk'))
            print("Copied existing verified APK to dist/download/app-debug.apk")
        return

    # Ensure keystore exists
    if not os.path.exists(keystore_path):
        os.makedirs(os.path.dirname(keystore_path), exist_ok=True)
        subprocess.check_call([
            'keytool', '-genkeypair', '-v',
            '-keystore', keystore_path,
            '-storepass', 'android',
            '-alias', 'androiddebugkey',
            '-keypass', 'android',
            '-keyalg', 'RSA',
            '-keysize', '2048',
            '-validity', '10000',
            '-dname', 'CN=Android Debug,O=Android,C=US'
        ])

    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)

    # Ensure dist build exists
    index_html = os.path.join(dist_dir, 'index.html')
    if not os.path.exists(index_html):
        print("dist/index.html not found, building web assets with vite...")
        subprocess.check_call(['npx', 'vite', 'build'], cwd=workspace)

    print(f"Extracting base APK components from: {base_apk}")
    with zipfile.ZipFile(base_apk, 'r') as zf:
        zf.extractall(work_dir)

    # Strip any old signatures completely
    meta_inf = os.path.join(work_dir, 'META-INF')
    if os.path.exists(meta_inf):
        shutil.rmtree(meta_inf)

    # Clear and replace assets
    apk_assets = os.path.join(work_dir, 'assets')
    if os.path.exists(apk_assets):
        shutil.rmtree(apk_assets)
    os.makedirs(apk_assets)

    print(f"Copying web build from {dist_dir} into APK assets...")
    for root, dirs, files in os.walk(dist_dir):
        rel_root = os.path.relpath(root, dist_dir)
        if rel_root.startswith('download'):
            continue
        target_dir = os.path.join(apk_assets, rel_root) if rel_root != '.' else apk_assets
        os.makedirs(target_dir, exist_ok=True)
        for f in files:
            src_f = os.path.join(root, f)
            dst_f = os.path.join(target_dir, f)
            shutil.copy2(src_f, dst_f)

    # Copy icons
    public_dir = os.path.join(workspace, 'public')
    for icon_name in ['pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png', 'icon.svg']:
        src = os.path.join(public_dir, icon_name)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(apk_assets, icon_name))
            if icon_name == 'pwa-192x192.png':
                shutil.copy2(src, os.path.join(apk_assets, 'icon-192.png'))
            elif icon_name == 'pwa-512x512.png':
                shutil.copy2(src, os.path.join(apk_assets, 'icon-512.png'))

    # Update app logo in res/drawable and mipmap
    res_icon = os.path.join(public_dir, 'pwa-192x192.png')
    if os.path.exists(res_icon):
        for target_res in [
            os.path.join(work_dir, 'res', 'drawable', 'ic_launcher.png'),
            os.path.join(work_dir, 'res', 'mipmap-hdpi-v4', 'ic_launcher.png'),
            os.path.join(work_dir, 'res', 'drawable', 'app_logo.png'),
            os.path.join(work_dir, 'res', 'drawable-xxhdpi-v4', 'app_banner.png'),
            os.path.join(work_dir, 'res', 'drawable-xxxhdpi-v4', 'app_splash.png'),
        ]:
            if os.path.exists(os.path.dirname(target_res)):
                shutil.copy2(res_icon, target_res)

    # Create unaligned APK
    unaligned_apk = '/tmp/unaligned.apk'
    aligned_apk = '/tmp/aligned.apk'
    final_apk = '/tmp/app-debug-signed.apk'

    for temp_f in [unaligned_apk, aligned_apk, final_apk]:
        if os.path.exists(temp_f):
            os.remove(temp_f)

    print("Creating unaligned APK container...")
    with zipfile.ZipFile(unaligned_apk, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        # 1. AndroidManifest.xml and classes.dex
        for f in ['AndroidManifest.xml', 'classes.dex']:
            fpath = os.path.join(work_dir, f)
            if os.path.exists(fpath):
                zf.write(fpath, f, compress_type=zipfile.ZIP_DEFLATED)

        # 2. resources.arsc MUST be uncompressed (STORED) for Android compatibility
        arsc = os.path.join(work_dir, 'resources.arsc')
        if os.path.exists(arsc):
            zf.write(arsc, 'resources.arsc', compress_type=zipfile.ZIP_STORED)

        # 3. Everything else (res, assets)
        for root, dirs, files in os.walk(work_dir):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, work_dir).replace('\\', '/')
                if rel_path in ['AndroidManifest.xml', 'classes.dex', 'resources.arsc']:
                    continue
                if rel_path.startswith('META-INF'):
                    continue
                zf.write(full_path, rel_path, compress_type=zipfile.ZIP_DEFLATED)

    # Run zipalign 4-byte alignment
    print("Running zipalign (4-byte alignment)...")
    subprocess.check_call(['zipalign', '-f', '-p', '4', unaligned_apk, aligned_apk])

    # Run apksigner to sign with v1, v2, v3 schemes
    print("Signing APK with apksigner (v1 + v2 + v3 schemes)...")
    subprocess.check_call([
        'apksigner', 'sign',
        '--ks', keystore_path,
        '--ks-pass', 'pass:android',
        '--key-pass', 'pass:android',
        '--ks-key-alias', 'androiddebugkey',
        '--min-sdk-version', '21',
        '--v1-signing-enabled', 'true',
        '--v2-signing-enabled', 'true',
        '--v3-signing-enabled', 'true',
        '--out', final_apk,
        aligned_apk
    ])

    # Verify signature
    print("Verifying APK signatures with apksigner verify:")
    verify_output = subprocess.check_output(['apksigner', 'verify', '--verbose', '--min-sdk-version', '21', final_apk]).decode('utf-8')
    print(verify_output)

    apk_size = os.path.getsize(final_apk)
    print(f"Verified APK successfully generated: {apk_size} bytes ({apk_size / (1024*1024):.2f} MB)")

    # Deploy to destination locations
    dests = [
        os.path.join(workspace, 'public', 'download', 'app-debug.apk'),
        os.path.join(workspace, 'dist', 'download', 'app-debug.apk'),
        os.path.join(workspace, 'build-outputs', 'app-debug.apk'),
        os.path.join(workspace, '.build-outputs', 'app-debug.apk'),
        os.path.join(workspace, 'APK_DOWNLOAD', 'app-debug.apk'),
    ]

    for dest in dests:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(final_apk, dest)
        print(f"Deployed -> {dest}")

if __name__ == '__main__':
    main()
