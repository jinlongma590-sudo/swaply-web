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

    // ✅ 统一下载页
    const downloadPath = '/download';
    const downloadAbs = 'https://swaply.cc/download';

    // ✅ iOS Scheme
    const iosSchemeUrl = `cc.swaply.app://listing?id=${id}`;

    // ✅ Android Intent
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

    // === fallback ===
    const fallbackTimer = setTimeout(() => {
      if (!document.hidden) {
        window.location.replace(downloadPath);
      }
      setAttempting(false);
    }, 2500);

    const handleVisibilityChange = () => {
      if (document.hidden) {
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
        window.location.href = androidIntentUrl;
        return;
      }
      if (isIOS) {
        window.location.href = iosSchemeUrl;
        return;
      }
    } catch (err) {
      console.error('[OpenInApp] Error:', err);
      clearTimeout(fallbackTimer);
      window.location.replace(downloadPath);
      setAttempting(false);
    }
  };

  // 🔥🔥🔥 关键修复区域 🔥🔥🔥
  const baseClasses =
    variant === 'primary'
      ? // Primary 修复：
        // 1. 添加 bg-blue-600 作为底色（防止渐变失败变透明）
        // 2. 保留 bg-gradient-to-r 增加美观（如果支持的话）
        // 3. 将复杂的 rgba 阴影改为标准的 shadow-xl，兼容性更好
        'inline-flex items-center gap-2 rounded-full bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 font-bold text-white shadow-xl hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
      : // Secondary 修复：
        // 1. 去掉 /80 透明度，改为纯色 bg-white，防止背景浑浊
        // 2. 加粗文字 font-bold 提高可读性
        'inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 font-bold text-blue-700 shadow-sm hover:bg-blue-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // 这里的 button 内容逻辑不变
  const content = attempting ? (
    <>
      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Opening...</span>
    </>
  ) : variant === 'primary' ? (
    'Get Swaply App'
  ) : (
    'Open in App'
  );

  if (!isClient) {
    return <div className={`${baseClasses} ${className}`}>{variant === 'primary' ? 'Get Swaply App' : 'Open in App'}</div>;
  }

  return (
    <button onClick={tryOpenApp} disabled={attempting} className={`${baseClasses} ${className}`} type="button">
      {content}
    </button>
  );
}