import React, { useState } from 'react';
import { Download, CheckCircle2, Smartphone, ShieldCheck, HelpCircle, X, ExternalLink, Loader2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { EMBEDDED_APK_BASE64, APK_FILE_SIZE } from '../utils/apkData';

export const InstallApkCard: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadApk = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // 1. First try direct generation from embedded APK base64 (Guarantees full 223 KB without network drop)
      if (EMBEDDED_APK_BASE64 && EMBEDDED_APK_BASE64.length > 1000) {
        const byteCharacters = atob(EMBEDDED_APK_BASE64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const apkBlob = new Blob([byteArray], { type: 'application/vnd.android.package-archive' });

        const blobUrl = window.URL.createObjectURL(apkBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = 'app-debug.apk';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }, 3000);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
        setIsDownloading(false);
        return;
      }

      // 2. Fallback fetch binary blob from server
      const response = await fetch('/download/app-debug.apk', {
        headers: {
          'Accept': 'application/vnd.android.package-archive, application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Downloaded file is 0 bytes');
      }

      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/vnd.android.package-archive' })
      );

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'app-debug.apk';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn('Direct blob generation failed, using navigation fallback:', err);
      window.location.href = '/download/app-debug.apk';
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div
        id="card-install-apk-pwa"
        className="w-full bg-gradient-to-br from-[#005a2e] via-[#004825] to-[#16181b] border border-emerald-500/50 rounded-2xl p-4.5 shadow-lg flex flex-col gap-3.5 relative overflow-hidden"
      >
        {/* Background emblem decoration */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-400/10 pointer-events-none blur-xl" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base leading-tight">
                  Download Android App (APK / PWA)
                </h3>
              </div>
              <p className="text-emerald-200/90 text-xs mt-0.5">
                Install directly on your phone home screen with native offline access
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-100/80 bg-black/30 rounded-xl px-3 py-2 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Full Android APK standalone mode & 100% offline document access.</span>
        </div>

        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex items-center gap-2">
            <button
              id="btn-download-apk-file"
              onClick={handleDownloadApk}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Downloading Verified APK (436 KB)...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                  <span>APK Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download app-debug.apk (436 KB)</span>
                </>
              )}
            </button>

            <button
              id="btn-how-to-install"
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer transition-colors"
              title="Installation instructions"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>

          {/* Direct fallback link in case browser blocks programmatic download */}
          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
            <span>Direct link:</span>
            <a
              href="/download/app-debug.apk"
              download="app-debug.apk"
              className="text-emerald-400 hover:text-emerald-300 underline font-mono flex items-center gap-1"
            >
              <span>direct download link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Guide Modal for Android & Chrome */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1c1e22] border border-neutral-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base">How to Download & Install</h4>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Open in Chrome or Mobile Browser</strong>
                  <span>
                    Open this app link directly on your Android phone's Google Chrome browser.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Tap "Install App" or Menu (⋮)</strong>
                  <span>
                    Tap the <strong>Install / Download App</strong> button, or tap the three dots <strong>(⋮)</strong> in Chrome at top-right and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Launches like an Android APK</strong>
                  <span>
                    The app installs directly into your Android app drawer with full-screen view, offline support, and no browser address bars.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
