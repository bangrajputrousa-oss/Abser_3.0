package com.absher.individual;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String TAG = "AbsherApp";
    private static final String APP_ORIGIN_HOST = "appassets.androidplatform.net";
    private static final String APP_INDEX_URL = "https://" + APP_ORIGIN_HOST + "/index.html";

    private WebView mWebView;
    private ValueCallback<Uri[]> mFilePathCallback;
    private static final int FILE_CHOOSER_REQUEST = 10001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.i(TAG, "=== Absher MainActivity Initializing ===");

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(0xFF131416); // Theme background

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        WebView.setWebContentsDebuggingEnabled(true);

        // JavaScript Interface for diagnostics and bridge logging
        mWebView.addJavascriptInterface(new AndroidDiagnosticsBridge(this, getAssets()), "AndroidDiagnostics");

        mWebView.setWebChromeClient(new WebChromeClient() {

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                }
                mFilePathCallback = filePathCallback;
                try {
                    Intent intent = fileChooserParams.createIntent();
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open file chooser: " + e.getMessage());
                    mFilePathCallback = null;
                    Toast.makeText(MainActivity.this, "Cannot open file picker", Toast.LENGTH_LONG).show();
                    return false;
                }
                return true;
            }
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                String msg = "[" + cm.messageLevel() + "] " + cm.message() +
                             " (" + cm.sourceId() + ":" + cm.lineNumber() + ")";
                switch (cm.messageLevel()) {
                    case ERROR:
                        Log.e(TAG, "[WebView Console] " + msg);
                        break;
                    case WARNING:
                        Log.w(TAG, "[WebView Console] " + msg);
                        break;
                    default:
                        Log.i(TAG, "[WebView Console] " + msg);
                        break;
                }
                return true;
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
                Log.d(TAG, "Page title updated: " + title);
            }
        });

        final LocalAssetHandler assetHandler = new LocalAssetHandler(getAssets());

        // Intercept ServiceWorker requests to prevent offline network failures
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try {
                ServiceWorkerController swController = ServiceWorkerController.getInstance();
                swController.setServiceWorkerClient(new ServiceWorkerClient() {
                    @Override
                    public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                        return assetHandler.intercept(request.getUrl());
                    }
                });
                Log.i(TAG, "ServiceWorkerClient registered successfully");
            } catch (Throwable t) {
                Log.w(TAG, "Failed to register ServiceWorkerClient: " + t.getMessage());
            }
        }

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetHandler.intercept(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return assetHandler.intercept(Uri.parse(url));
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.i(TAG, "Page load started: " + url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.i(TAG, "Page load finished: " + url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "WebResourceError: " + request.getUrl() + " -> code: " +
                      error.getErrorCode() + ", desc: " + error.getDescription());
                if (request.isForMainFrame()) {
                    showErrorFallback(request.getUrl().toString(), error.getDescription().toString());
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "Legacy WebResourceError: " + failingUrl + " -> " + errorCode + ": " + description);
                showErrorFallback(failingUrl, description);
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                Log.e(TAG, "HttpError: " + request.getUrl() + " -> Status " + errorResponse.getStatusCode());
            }

            private void showErrorFallback(String failingUrl, String errorMsg) {
                String safeUrl = failingUrl.replace("<", "&lt;").replace(">", "&gt;");
                String safeMsg = errorMsg.replace("<", "&lt;").replace(">", "&gt;");
                String fallbackHtml = "<!doctype html><html><head><meta charset='utf-8'>" +
                    "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
                    "<title>Startup Error</title></head>" +
                    "<body style='background:#131416;color:#e6edf3;font-family:sans-serif;padding:24px;'>" +
                    "<div style='background:#dc2626;color:#fff;padding:12px 16px;border-radius:8px;font-weight:bold;margin-bottom:16px;'>" +
                    "Startup Failed</div>" +
                    "<p style='color:#9ca3af;'>Could not load: <code>" + safeUrl + "</code></p>" +
                    "<pre style='background:#1f2937;padding:12px;border-radius:6px;color:#f87171;font-size:12px;white-space:pre-wrap;'>" +
                    safeMsg + "</pre>" +
                    "<button onclick='window.location.reload()' style='background:#006837;color:#fff;border:none;padding:12px 20px;border-radius:8px;font-weight:bold;margin-top:16px;'>Retry</button>" +
                    "</body></html>";
                mWebView.loadDataWithBaseURL("https://" + APP_ORIGIN_HOST + "/", fallbackHtml, "text/html", "UTF-8", null);
            }
        });

        Log.i(TAG, "Loading initial app URL: " + APP_INDEX_URL);
        mWebView.loadUrl(APP_INDEX_URL);

        setContentView(mWebView);
    }

    public static class AndroidDiagnosticsBridge {
        private final Activity activity;
        private final AssetManager assetManager;

        public AndroidDiagnosticsBridge(Activity activity, AssetManager assetManager) {
            this.activity = activity;
            this.assetManager = assetManager;
        }

        @JavascriptInterface
        public void log(String level, String tag, String message) {
            String fullTag = TAG + ":" + tag;
            if ("ERROR".equalsIgnoreCase(level)) {
                Log.e(fullTag, message);
            } else if ("WARN".equalsIgnoreCase(level)) {
                Log.w(fullTag, message);
            } else {
                Log.i(fullTag, message);
            }
        }

        @JavascriptInterface
        public void reportReady() {
            Log.i(TAG, ">>> React UI successfully mounted and confirmed READY <<<");
        }

        @JavascriptInterface
        public void reportError(String error, String stack) {
            Log.e(TAG, ">>> JS Runtime Startup Error: " + error + "\nStack: " + stack);
            activity.runOnUiThread(() -> {
                Toast.makeText(activity, "Startup error: " + error, Toast.LENGTH_LONG).show();
            });
        }

        @JavascriptInterface
        public String listAssets(String dir) {
            try {
                String[] files = assetManager.list(dir);
                return Arrays.toString(files);
            } catch (IOException e) {
                return "[]";
            }
        }
    }

    public static class LocalAssetHandler {
        private final AssetManager assetManager;

        public LocalAssetHandler(AssetManager assetManager) {
            this.assetManager = assetManager;
        }

        public WebResourceResponse intercept(Uri uri) {
            if (uri == null) return null;

            String scheme = uri.getScheme();
            String host = uri.getHost();
            String path = uri.getPath();

            boolean isAppOrigin = (scheme != null && scheme.equalsIgnoreCase("https") && host != null && host.equalsIgnoreCase(APP_ORIGIN_HOST));
            boolean isLocalhost = (host != null && (host.equalsIgnoreCase("localhost") || host.equalsIgnoreCase("127.0.0.1")));
            boolean isFileAsset = (scheme != null && scheme.equalsIgnoreCase("file"));

            if (!isAppOrigin && !isLocalhost && !isFileAsset) {
                return null; // Let external requests (e.g. Google fonts) pass to network
            }

            String cleanPath = (path == null) ? "" : path;
            while (cleanPath.startsWith("/")) {
                cleanPath = cleanPath.substring(1);
            }
            if (cleanPath.startsWith("android_asset/")) {
                cleanPath = cleanPath.substring("android_asset/".length());
            }
            int qIdx = cleanPath.indexOf('?');
            if (qIdx != -1) cleanPath = cleanPath.substring(0, qIdx);
            int hIdx = cleanPath.indexOf('#');
            if (hIdx != -1) cleanPath = cleanPath.substring(0, hIdx);

            if (cleanPath.isEmpty() || cleanPath.equalsIgnoreCase("index.html")) {
                cleanPath = "index.html";
            }

            // Multiple candidate paths for maximum resilience
            List<String> candidates = new ArrayList<>();
            candidates.add(cleanPath);
            if (cleanPath.startsWith("assets/assets/")) {
                candidates.add(cleanPath.substring("assets/".length()));
            }
            if (!cleanPath.startsWith("assets/")) {
                candidates.add("assets/" + cleanPath);
            }
            if (cleanPath.startsWith("assets/")) {
                candidates.add(cleanPath.substring("assets/".length()));
            }

            for (String candidate : candidates) {
                try {
                    InputStream is = assetManager.open(candidate);
                    String mime = getMimeType(candidate);
                    String encoding = getEncoding(mime);

                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
                    headers.put("Access-Control-Allow-Headers", "*");
                    headers.put("Cache-Control", "no-cache, no-store, must-revalidate");

                    Log.d(TAG, "Successfully intercepted [" + uri + "] -> found asset: " + candidate + " (" + mime + ")");
                    return new WebResourceResponse(mime, encoding, 200, "OK", headers, is);
                } catch (IOException ignored) {
                    // Try next candidate
                }
            }

            Log.w(TAG, "Asset not found in candidates: " + candidates + " for URI: " + uri);

            // Handle SPA routing fallback for text/html requests or extension-less paths
            String mime = getMimeType(cleanPath);
            if (mime.equals("text/html") || !cleanPath.contains(".")) {
                try {
                    InputStream is = assetManager.open("index.html");
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Cache-Control", "no-cache");
                    Log.i(TAG, "SPA fallback served index.html for: " + cleanPath);
                    return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                } catch (IOException e) {
                    Log.e(TAG, "index.html missing from APK assets!", e);
                }
            }

            // If service worker scripts are not present, return empty script instead of 404
            if (cleanPath.endsWith(".js")) {
                ByteArrayInputStream emptyJs = new ByteArrayInputStream("/* offline benign script */".getBytes(StandardCharsets.UTF_8));
                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                return new WebResourceResponse("application/javascript", "UTF-8", 200, "OK", headers, emptyJs);
            }

            return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null, null);
        }

        private String getMimeType(String path) {
            String lower = path.toLowerCase();
            if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
            if (lower.endsWith(".css")) return "text/css";
            if (lower.endsWith(".json") || lower.endsWith(".webmanifest")) return "application/json";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }

        private String getEncoding(String mimeType) {
            if (mimeType.startsWith("text/") ||
                mimeType.equals("application/javascript") ||
                mimeType.equals("application/json") ||
                mimeType.equals("image/svg+xml")) {
                return "UTF-8";
            }
            return null; // Crucial: must be null for binary files (PNG, fonts, etc.)
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (mFilePathCallback == null) {
                return;
            }
            Uri[] results = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getData() != null) {
                    results = new Uri[]{ data.getData() };
                } else if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                }
            }
            mFilePathCallback.onReceiveValue(results);
            mFilePathCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
