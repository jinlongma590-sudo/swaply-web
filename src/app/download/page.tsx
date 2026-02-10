// src/app/download/page.tsx
"use client";

import Link from "next/link";

const ANDROID_APK_URL = "/download/swaply-latest.apk"; // 或固定版本：/download/swaply-1.0.1.apk
// 未来你有 Google Play / App Store 链接后，直接在下面这两个常量里填入真实地址即可
const GOOGLE_PLAY_URL = "#"; // 暂未开放
const IOS_APP_STORE_URL = "#"; // 暂未开放

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-brand-50/60">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-center text-3xl font-extrabold text-brand-900">
          Download Swaply
        </h1>
        <p className="mt-2 text-center text-brand-800/80">
          Choose your platform and start swapping.
        </p>

        {/* 下载方式卡片区域 */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Android APK */}
          <a
            href={ANDROID_APK_URL}
            className="card p-6 hover:shadow"
            download
            rel="nofollow"
          >
            <div className="text-3xl text-brand-600">🤖</div>
            <h2 className="mt-2 text-xl font-semibold text-brand-900">
              Android (APK)
            </h2>
            <p className="mt-1 text-sm text-brand-800/80">
              Download the latest APK and install manually on your Android
              device.
            </p>
            <p className="mt-2 text-xs text-brand-800/70">
              You may need to allow{" "}
              <span className="font-medium">“Install unknown apps”</span> for
              your browser and confirm the installation permissions during setup.
            </p>
          </a>

          {/* Google Play - 即将开放 */}
          <a
            href={GOOGLE_PLAY_URL}
            className="card p-6 opacity-70 cursor-not-allowed"
            aria-disabled="true"
            title="Coming soon"
          >
            <div className="text-3xl text-brand-600">📲</div>
            <h2 className="mt-2 text-xl font-semibold text-brand-900">
              Google Play
            </h2>
            <p className="mt-1 text-sm text-brand-800/80">
              Official Google Play download. We&apos;re preparing the launch.
            </p>
            <span className="mt-3 inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              Coming soon
            </span>
          </a>

          {/* iOS - 即将开放（审核通过后再打开链接） */}
          <a
            href={IOS_APP_STORE_URL}
            className="card p-6 opacity-70 cursor-not-allowed"
            aria-disabled="true"
            title="Coming soon"
          >
            <div className="text-3xl text-brand-600">🍎</div>
            <h2 className="mt-2 text-xl font-semibold text-brand-900">iOS</h2>
            <p className="mt-1 text-sm text-brand-800/80">
              App Store / TestFlight link will be enabled after review is
              approved.
            </p>
            <span className="mt-3 inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              Coming soon
            </span>
          </a>
        </div>

        {/* APK 安装说明：让用户知道需要授权什么 */}
        <div className="mt-10 rounded-2xl bg-white/80 p-5 text-sm text-brand-900 shadow-sm">
          <h2 className="text-base font-semibold">
            How to safely install the Android APK
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-brand-800/80">
            <li>Tap the &quot;Android (APK)&quot; card above to start downloading.</li>
            <li>
              If your phone shows a warning about unknown apps, choose{" "}
              <span className="font-medium">Allow</span> for your browser
              (Chrome, Edge, etc.) to install this APK.
            </li>
            <li>
              After the download finishes, open the APK file and tap{" "}
              <span className="font-medium">Install</span>.
            </li>
            <li>
              On first launch, Android will show you the permissions Swaply
              requests (e.g. camera, photos/media, optional location). You can
              accept or deny them and change this anytime in Settings.
            </li>
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-brand-800/70">
          Need help?{" "}
          <a
            className="underline hover:no-underline"
            href="mailto:swaply@swaply.cc"
          >
            Contact support
          </a>
          .
        </p>

        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
