import type { NextRequest } from "next/server";

/** 不缓存，避免静态化 */
export const dynamic = "force-dynamic";

/** Apple 在浏览器回调时通常是 GET */
export async function GET(_req: NextRequest) {
  // 最小可用：返回 200 文本（或重定向到首页都行）
  return new Response("ok", {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

/** 有些场景 Apple 会 POST 回调，这里也兜底一下 */
export async function POST(_req: NextRequest) {
  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}
