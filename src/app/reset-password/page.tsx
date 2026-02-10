// src/app/reset-password/page.tsx
// ✅ 最终优化版：自动检测QQ邮箱/微信等环境并显示友好提示

'use client';

import { useEffect, useState } from 'react';

const APP_SCHEME = 'cc.swaply.app://reset-password';

function parseHashParams(hash: string): URLSearchParams {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(clean);
}

// ✅ 检测特殊WebView环境
function detectSpecialEnvironment() {
  if (typeof window === 'undefined') return null;

  const ua = navigator.userAgent.toLowerCase();

  const isWeChat = ua.includes('micromessenger');
  const isQQ = ua.includes('qq/') && !isWeChat;
  const isQQMail = ua.includes('qqmail');
  const isDingTalk = ua.includes('dingtalk');

  if (isQQMail) return 'QQ Mail';
  if (isWeChat) return 'WeChat';
  if (isQQ) return 'QQ';
  if (isDingTalk) return 'DingTalk';

  return null;
}

function getSystemBrowser(): string {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return isIOS ? 'Safari' : 'Chrome';
}

export default function ResetPasswordBridgePage() {
  const [message, setMessage] = useState<string>('Verifying your reset link...');
  const [appUrl, setAppUrl] = useState<string>('');
  const [showManualButton, setShowManualButton] = useState(false);
  const [buttonText, setButtonText] = useState('Open Swaply App');
  const [isError, setIsError] = useState(false);
  const [specialEnv, setSpecialEnv] = useState<string | null>(null);

  useEffect(() => {
    // 检测环境
    const env = detectSpecialEnvironment();
    setSpecialEnv(env);

    const url = new URL(window.location.href);
    const qs = url.searchParams;
    const hs = parseHashParams(window.location.hash);

    const params = {
      token: qs.get('token') ?? undefined,
      code: qs.get('code') ?? undefined,
      type: qs.get('type') ?? undefined,
      hash_access_token: hs.get('access_token') ?? undefined,
      hash_refresh_token: hs.get('refresh_token') ?? undefined,
      hash_type: hs.get('type') ?? undefined,
      error: qs.get('error') ?? hs.get('error') ?? undefined,
      error_code: qs.get('error_code') ?? hs.get('error_code') ?? undefined,
      error_description: qs.get('error_description') ?? hs.get('error_description') ?? undefined,
    };

    console.log('🔍 Environment detected:', env);
    console.log('🔑 Extracted params:', params);

    if (params.error || params.error_code) {
      console.error('❌ Error detected:', params);
      setIsError(true);
      const errorMsg = params.error_description || params.error || 'This reset link has expired or is invalid.';
      setMessage(`${errorMsg} Please request a new one from the app.`);

      const errorParams = new URLSearchParams();
      errorParams.set('error', params.error || params.error_code || 'unknown');
      if (params.error_description) {
        errorParams.set('error_description', params.error_description);
      }

      const errorAppUrl = `${APP_SCHEME}?${errorParams.toString()}`;
      setAppUrl(errorAppUrl);
      setShowManualButton(true);
      setButtonText('Return to App');

      setTimeout(() => tryOpenApp(errorAppUrl), 1500);
      return;
    }

    const finalCode = params.code;
    const finalToken = params.token || params.hash_access_token;
    const finalRefreshToken = params.hash_refresh_token;
    const finalType = params.type || params.hash_type || 'recovery';

    console.log('🔑 Final extraction:', {
      code: finalCode ? `***${finalCode.slice(-10)}` : 'NULL',
      token: finalToken ? `***${finalToken.slice(-10)}` : 'NULL',
      refresh_token: finalRefreshToken ? 'YES' : 'NULL',
      type: finalType,
    });

    if (!finalCode && !finalToken) {
      console.warn('⚠️ No token or code found');
      setIsError(true);
      setMessage('No reset token found. Please click "Forgot Password" in the app to get a new reset link.');

      const noTokenParams = new URLSearchParams({
        error: 'no_token',
        error_description: 'Token not found in reset link',
      });

      const noTokenUrl = `${APP_SCHEME}?${noTokenParams.toString()}`;
      setAppUrl(noTokenUrl);
      setShowManualButton(true);
      setButtonText('Return to App');

      setTimeout(() => tryOpenApp(noTokenUrl), 1500);
      return;
    }

    const deepLinkParams = new URLSearchParams();

    if (finalCode) {
      deepLinkParams.set('code', finalCode);
      console.log('✅ Using code parameter (PKCE flow)');
    } else if (finalToken) {
      deepLinkParams.set('token', finalToken);
      console.log('✅ Using token parameter (email flow)');
    }

    deepLinkParams.set('type', finalType);
    if (finalRefreshToken) {
      deepLinkParams.set('refresh_token', finalRefreshToken);
    }

    const finalAppUrl = `${APP_SCHEME}?${deepLinkParams.toString()}`;
    setAppUrl(finalAppUrl);

    console.log('🚀 Constructed deep link:', finalAppUrl.replace(/(code|token)=[^&]+/g, '$1=***'));

    // ✅ 根据环境调整提示
    if (env) {
      setMessage(`Please copy the link and open it in ${getSystemBrowser()} to continue.`);
    } else {
      setMessage('Opening Swaply app...');
    }

    setShowManualButton(true);
    setButtonText(env ? 'Copy Link & Open in Browser' : 'Opening...');

    if (!env) {
      // 只在非特殊环境才自动尝试
      setTimeout(() => {
        tryOpenApp(finalAppUrl);
        setTimeout(() => {
          setButtonText('Tap here if app did not open');
          setMessage('If the app did not open automatically, tap the button below.');
        }, 1000);
      }, 300);
    }

  }, []);

  const tryOpenApp = (url: string) => {
    console.log('📱 Attempting to open app');

    try {
      window.location.href = url;

      setTimeout(() => {
        if (document.hasFocus()) {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = url;
          document.body.appendChild(iframe);
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }
      }, 1500);

      setTimeout(() => {
        if (document.hasFocus()) {
          const link = document.createElement('a');
          link.href = url;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 1000);
        }
      }, 2500);

    } catch (err) {
      console.error('❌ Failed to open app:', err);
    }
  };

  // ✅ 一键复制功能
  const handleCopyAndOpen = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (specialEnv) {
      // 在特殊环境：复制链接
      try {
        await navigator.clipboard.writeText(appUrl);
        setButtonText('✓ Link Copied!');
        setMessage(`Now paste it in ${getSystemBrowser()} to open the app.`);

        setTimeout(() => {
          setButtonText(`Open in ${getSystemBrowser()}`);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        // 备选方案
        const textarea = document.createElement('textarea');
        textarea.value = appUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setButtonText('✓ Link Copied!');
      }
    } else {
      // 在正常浏览器：直接打开
      tryOpenApp(appUrl);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: isError
        ? 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: isError
          ? '0 10px 40px rgba(239, 68, 68, 0.15)'
          : '0 10px 40px rgba(59, 130, 246, 0.15)',
        border: isError
          ? '2px solid rgba(239, 68, 68, 0.1)'
          : '2px solid rgba(59, 130, 246, 0.1)',
      }}>
        {/* ✅ 环境警告提示 */}
        {specialEnv && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            backgroundColor: '#fff9e6',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#856404',
            lineHeight: '1.4',
          }}>
            <strong>📱 {specialEnv} Detected</strong><br/>
            This app cannot open external links directly. Please copy the link and paste it in {getSystemBrowser()}.
          </div>
        )}

        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          background: isError
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          boxShadow: isError
            ? '0 8px 20px rgba(239, 68, 68, 0.3)'
            : '0 8px 20px rgba(59, 130, 246, 0.3)',
        }}>
          <span style={{ color: 'white' }}>
            {isError ? '⚠️' : '🔐'}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          margin: '0 0 16px',
          fontSize: '28px',
          fontWeight: '700',
          textAlign: 'center',
          background: isError
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {isError ? 'Reset Link Issue' : 'Swaply'}
        </h1>

        {/* Message */}
        <p style={{
          margin: '0 0 32px',
          fontSize: '16px',
          lineHeight: '1.6',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          {message}
        </p>

        {/* Button */}
        {showManualButton && appUrl && (
          <button
            onClick={handleCopyAndOpen}
            style={{
              display: 'block',
              width: '100%',
              padding: '16px 24px',
              background: isError
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              boxShadow: isError
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isError
                ? '0 6px 16px rgba(239, 68, 68, 0.4)'
                : '0 6px 16px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isError
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            {buttonText}
          </button>
        )}

        {/* Instructions */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '13px',
          color: '#9ca3af',
          textAlign: 'center',
          lineHeight: '1.5',
        }}>
          {isError ? (
            <>
              <strong style={{ color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                To request a new reset link:
              </strong>
              1. Open the Swaply app<br/>
              2. Go to Login screen<br/>
              3. Tap Forgot Password<br/>
              4. Enter your email<br/>
              5. Open the new link on this device
            </>
          ) : specialEnv ? (
            <>
              <strong style={{ color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                Why do I need to use {getSystemBrowser()}?
              </strong>
              {specialEnv} uses a restricted browser that cannot automatically open apps. Opening the link in {getSystemBrowser()} will work perfectly.
            </>
          ) : (
            <>
              This page verifies your password reset link<br/>
              and opens it in the Swaply app.
            </>
          )}
        </div>
      </div>
    </div>
  );
}