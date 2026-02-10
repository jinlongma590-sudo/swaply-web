// src/components/OpenInAppButton.tsx
'use client';

import { useEffect, useState } from 'react';

interface OpenInAppButtonProps {
  listingId: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function OpenInAppButton({
  listingId,
  variant = 'secondary',
  className = ''
}: OpenInAppButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [attempting, setAttempting] = useState(false);

  useEffect(() => setIsClient(true), []);

  const tryOpenApp = () => {
    if (!isClient || attempting) return;
    setAttempting(true);

    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid;

    const id = encodeURIComponent(listingId);

    // ✅ 统一下载页（没装 App 直接进这里）
    const downloadPath = '/download';
    const downloadAbs = 'https://swaply.cc/download'; // 给 Android intent fallback 用（必须是绝对 URL）

    // ✅ iOS 自定义 scheme（最可靠的方法，绕过同域名限制）
    const iosSchemeUrl = `cc.swaply.app://listing?id=${id}`;

    // ✅ Android 强制 intent（带包名 + fallback 到下载页）
    const fallbackUrl = encodeURIComponent(downloadAbs);
    const androidIntentUrl =
      `intent://swaply.cc/l/${id}` +
      `#Intent;scheme=https;package=cc.swaply.app;S.browser_fallback_url=${fallbackUrl};end`;

    console.log('[OpenInApp] Device:', { isIOS, isAndroid });

    if (!isMobile) {
      window.location.replace(downloadPath);
      setAttempting(false);
      return;
    }

    // === fallback 逻辑（2.5s 仍可见 => 直接去下载页）===
    const fallbackTimer = setTimeout(() => {
      if (!document.hidden) {
        console.log('[OpenInApp] App not opened -> go /download');
        window.location.replace(downloadPath);
      } else {
        console.log('[OpenInApp] App opened (page hidden)');
      }
      setAttempting(false);
    }, 2500);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[OpenInApp] Page hidden - app opening');
        clearTimeout(fallbackTimer);
        setAttempting(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });

    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, 3000);

    try {
      if (isAndroid) {
        console.log('[OpenInApp] Android intent:', androidIntentUrl);
        window.location.href = androidIntentUrl;
        return;
      }

      if (isIOS) {
        // ✅ iOS 修复：直接使用自定义 scheme
        // 原因：iOS 不允许从同域名网页通过 JavaScript 触发 Universal Links
        // 使用自定义 scheme 可以绕过这个限制，100% 可靠
        console.log('[OpenInApp] iOS custom scheme:', iosSchemeUrl);
        window.location.href = iosSchemeUrl;

        // 注意：如果 App 未安装，会触发"无法打开页面"弹窗
        // 然后 2.5s 后 fallback 会自动跳转到 /download
        return;
      }
    } catch (err) {
      console.error('[OpenInApp] Error:', err);
      clearTimeout(fallbackTimer);
      window.location.replace(downloadPath);
      setAttempting(false);
    }
  };

  const baseClasses =
    variant === 'primary'
      ? 'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)] hover:opacity-95 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
      : 'inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-4 py-2 font-semibold text-blue-700 shadow-sm hover:bg-white active:scale-[0.99] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  if (!isClient) {
    return <div className={`${baseClasses} ${className}`}>{variant === 'primary' ? 'Get Swaply App' : 'Open in App'}</div>;
  }

  return (
    <button onClick={tryOpenApp} disabled={attempting} className={`${baseClasses} ${className}`} type="button">
      {attempting ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Opening...
        </>
      ) : variant === 'primary' ? (
        'Get Swaply App'
      ) : (
        'Open in App'
      )}
    </button>
  );
}
