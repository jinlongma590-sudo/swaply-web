// src/app/listing/page.tsx
import { redirect } from 'next/navigation';

/**
 * 处理旧的查询参数格式：/listing?id=xxx
 * 重定向到新的路径格式：/l/{id}
 */
export default function ListingPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const listingId = searchParams.id;

  // 如果没有 ID，重定向到浏览页
  if (!listingId) {
    redirect('/browse');
  }

  // 重定向到 /l/{id} 格式
  redirect(`/l/${listingId}`);
}

// 生成元数据
export const metadata = {
  title: 'Redirecting...',
};