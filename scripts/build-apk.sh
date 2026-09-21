#!/bin/bash
set -e

WORKSPACE_DIR="$(pwd)"
echo "=== 1. Building React Web App in $WORKSPACE_DIR ==="
npm run build

echo "=== 2. Setting up Android Source & Build Assets ==="
mkdir -p /tmp/android-build/src/com/absher/individual
mkdir -p /tmp/android-build/res
mkdir -p /tmp/android-build/assets

cp android/app/src/main/java/com/absher/individual/MainActivity.java /tmp/android-build/src/com/absher/individual/MainActivity.java
cp android/app/src/main/AndroidManifest.xml /tmp/android-build/AndroidManifest.xml

rm -rf /tmp/android-build/assets/*
cp -r dist/* /tmp/android-build/assets/
rm -rf /tmp/android-build/assets/download

cp public/pwa-512x512.png /tmp/android-build/assets/icon-512.png 2>/dev/null || true
cp public/pwa-192x192.png /tmp/android-build/assets/icon-192.png 2>/dev/null || true

mkdir -p /tmp/android-build/assets/offline-data
cp public/assets/aistudio/*.png /tmp/android-build/assets/offline-data/ 2>/dev/null || true

echo "=== Verified Asset Inventory in /tmp/android-build/assets: ==="
find /tmp/android-build/assets -type f

echo "=== 3. Compiling Java and Dexing ==="
mkdir -p /tmp/android-build/bin /tmp/android-build/gen
rm -rf /tmp/android-build/bin/*
javac -cp /opt/android-sdk/platforms/android-34/android.jar -d /tmp/android-build/bin /tmp/android-build/src/com/absher/individual/MainActivity.java
/opt/android-sdk/build-tools/34.0.0/d8 --lib /opt/android-sdk/platforms/android-34/android.jar /tmp/android-build/bin/com/absher/individual/*.class --output /tmp/android-build/bin/

echo "=== 4. Packaging with AAPT2 ==="
rm -f /tmp/android-build/bin/compiled_res.zip /tmp/android-build/bin/unaligned.apk /tmp/android-build/bin/aligned.apk /tmp/android-build/bin/app-debug.apk

/opt/android-sdk/build-tools/34.0.0/aapt2 compile --dir /tmp/android-build/res -o /tmp/android-build/bin/compiled_res.zip
/opt/android-sdk/build-tools/34.0.0/aapt2 link -I /opt/android-sdk/platforms/android-34/android.jar \
  --manifest /tmp/android-build/AndroidManifest.xml \
  -A /tmp/android-build/assets \
  --java /tmp/android-build/gen \
  -o /tmp/android-build/bin/unaligned.apk \
  /tmp/android-build/bin/compiled_res.zip

echo "=== 5. Adding DEX, Aligning & Signing APK ==="
cd /tmp/android-build/bin
zip -u unaligned.apk classes.dex
zipalign -v -p 4 unaligned.apk aligned.apk
apksigner sign --ks /tmp/debug.keystore --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --out app-debug.apk aligned.apk
apksigner verify -v app-debug.apk

echo "=== 6. Deploying APK to Output Directories in Workspace ==="
cd "$WORKSPACE_DIR"
mkdir -p .build-outputs build-outputs APK_DOWNLOAD public/download dist/download

cp /tmp/android-build/bin/app-debug.apk "$WORKSPACE_DIR/.build-outputs/app-debug.apk"
cp /tmp/android-build/bin/app-debug.apk "$WORKSPACE_DIR/build-outputs/app-debug.apk"
cp /tmp/android-build/bin/app-debug.apk "$WORKSPACE_DIR/APK_DOWNLOAD/app-debug.apk"
cp /tmp/android-build/bin/app-debug.apk "$WORKSPACE_DIR/public/download/app-debug.apk"
cp /tmp/android-build/bin/app-debug.apk "$WORKSPACE_DIR/dist/download/app-debug.apk"

# Also sync to /app/applet-rw if it exists
if [ -d "/app/applet-rw" ]; then
  mkdir -p /app/applet-rw/.build-outputs /app/applet-rw/build-outputs /app/applet-rw/APK_DOWNLOAD /app/applet-rw/public/download /app/applet-rw/dist/download
  cp /tmp/android-build/bin/app-debug.apk /app/applet-rw/.build-outputs/app-debug.apk
  cp /tmp/android-build/bin/app-debug.apk /app/applet-rw/build-outputs/app-debug.apk
  cp /tmp/android-build/bin/app-debug.apk /app/applet-rw/APK_DOWNLOAD/app-debug.apk
fi

echo "=== 7. Verifying Deployed APK Content and Signatures ==="
unzip -l "$WORKSPACE_DIR/build-outputs/app-debug.apk" | grep -E "assets/|classes.dex|AndroidManifest"
/opt/android-sdk/build-tools/34.0.0/aapt dump badging "$WORKSPACE_DIR/build-outputs/app-debug.apk" | grep -E "package|launchable-activity|application-label"

echo "=== APK Build Succeeded! ==="
ls -lh "$WORKSPACE_DIR/build-outputs/app-debug.apk" "$WORKSPACE_DIR/APK_DOWNLOAD/app-debug.apk"
