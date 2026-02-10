// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      // Supabase Storage 图片
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  // ✅ 添加 headers 配置，支持 Universal Links
  async headers() {
    return [
      {
        // Universal Links 配置文件
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // 缓存 1 小时
          },
        ],
      },
      {
        // OAuth callback 页面不缓存
        source: '/auth/callback',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;