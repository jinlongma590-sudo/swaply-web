'use client';

import { useEffect, useState } from "react";

export default function DownloadBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('swaply-hide-banner-until');
      if (raw && Number(raw) > Date.now()) return; // 还在隐藏期
    } catch {}
    // 简单判断移动端：可根据需求再调整
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
    setShow(isMobile);
  }, []);

  const close7days = () => {
    try {
      const ts = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('swaply-hide-banner-until', String(ts));
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="sticky top-0 z-50 bg-emerald-600 text-white">
      <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between gap-3">
        <div className="text-sm">
          Download the Swaply App for the best experience.
        </div>
        <div className="flex items-center gap-2">
          {/* 先用 # 占位，拿到真实下载链接后替换 */}
          <a href="#" className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25">Android</a>
          <a href="#" className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25">iOS</a>
          <button onClick={close7days} className="px-2 py-1 rounded bg-black/20 hover:bg-black/30">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
