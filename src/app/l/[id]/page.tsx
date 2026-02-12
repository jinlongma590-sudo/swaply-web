// src/app/l/[id]/page.tsx
import "server-only";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { OpenInAppButton } from "@/components/OpenInAppButton"; // 确保路径正确，如果不报错就不用动

/** ===== Types ===== */
type ListingRow = {
  id: string;
  title: string | null;
  price: number | string | null;
  city: string | null;
  images?: string[] | null;
  image_urls?: string[] | null;
  description?: string | null;
  created_at?: string | null;
};

/** ===== Supabase (Server) ===== */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serverKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!serverKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or ANON KEY");

const supabase = createClient(supabaseUrl, serverKey, {
  auth: { persistSession: false },
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const revalidate = 60;

/** ===== Utils ===== */
async function getListing(id: string): Promise<ListingRow | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, price, city, images, image_urls, description, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`[getListing] ${error.message}`);
  return (data as ListingRow) ?? null;
}

async function getSimilarListings(id: string, city?: string | null) {
  const query = supabase
    .from("listings")
    .select("id, title, price, city, images, image_urls, created_at")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(6);

  if (city && city.trim()) {
    const { data, error } = await query.eq("city", city.trim()).limit(6);
    if (!error && data && data.length >= 3) return data as ListingRow[];
  }
  const { data } = await query;
  return (data as ListingRow[]) ?? [];
}

function imagesFrom(row: ListingRow | null): string[] {
  if (!row) return [];
  const a = Array.isArray(row.image_urls) && row.image_urls.length ? row.image_urls : row.images;
  return Array.isArray(a) ? a.map(String).filter(Boolean) : [];
}

function firstImage(row: ListingRow | null): string {
  const arr = imagesFrom(row);
  return arr[0] || "/og.png";
}

function fmtPrice(v: number | string | null | undefined): string {
  if (v == null || v === "") return "$0";
  const n = typeof v === "string" ? Number(v) : v;
  if (!isFinite(Number(n))) return String(v);
  return new Intl.NumberFormat("en-ZW", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function timeAgo(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const diff = Math.max(0, Date.now() - d.getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/** ===== Metadata (OG/Twitter) ===== */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const item = await getListing(id);
  if (!item) return { title: "Listing not found" };

  const title = `${item.title ?? "Listing"} – ${fmtPrice(item.price)}`;
  const description = [item.city, "View on Swaply"].filter(Boolean).join(" · ");
  const image = firstImage(item);
  const url = `${SITE_URL}/l/${item.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Swaply",
      images: [{ url: image, width: 1200, height: 630, alt: item.title ?? "Listing" }],
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** ===== Page (Server Component) ===== */
export default async function ListingPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const item = await getListing(id);
  if (!item) return notFound();
  const [similar] = await Promise.all([getSimilarListings(item.id, item.city)]);

  const imgs = imagesFrom(item);
  const hero = imgs[0] || "/og.png";
  const posted = timeAgo(item.created_at);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_50%_at_50%_-10%,#bfe2ff_0%,transparent_60%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_100%)]">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[280px] w-[580px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400/30 via-cyan-300/30 to-indigo-400/30 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] h-[260px] w-[260px] rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-400/10 blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-10">
        {/* 顶部主要信息卡片 */}
        <section className="rounded-2xl border border-white/40 bg-white/55 p-5 shadow-[0_10px_30px_rgba(30,64,175,0.08)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              {/* 🔥🔥🔥 关键修复 🔥🔥🔥
                 旧代码：text-transparent bg-clip-text ... (安卓11上会导致文字隐形)
                 新代码：text-blue-900 (稳稳的深蓝色)
              */}
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-blue-900 md:text-3xl">
                {item.title ?? "Listing"}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                {item.city && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/60 px-3 py-1 text-blue-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" className="-mt-[1px]"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>
                    {item.city}
                  </span>
                )}
                {posted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/70 px-3 py-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" className="-mt-[1px]"><path fill="currentColor" d="M12 20a8 8 0 1 1 8-8a8 8 0 0 1-8 8m.5-12h-1v5l4 2l.5-.87l-3.5-1.76Z"/></svg>
                    {posted}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/70 px-3 py-1">
                  ID: {item.id}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="relative">
                {/* 这里的动画装饰没问题，可以保留 */}
                <div aria-hidden className="absolute inset-0 rounded-xl p-[2px]">
                  <div
                    className="absolute inset-0 rounded-xl blur-md animate-spin [animation-duration:6s]"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, #60a5fa, #a78bfa, #22d3ee, #60a5fa)",
                    }}
                  />
                </div>
                <span className="relative block rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-2 text-lg font-extrabold text-white shadow-[0_6px_16px_rgba(37,99,235,0.45)]">
                  {fmtPrice(item.price)}
                </span>
              </div>
              <OpenInAppButton listingId={item.id} variant="secondary" />
            </div>
          </div>
        </section>

        {/* 图片区域 - 这里的代码你之前已经写得很好了，没问题 */}
        <section className="mt-5 md:mt-7">
          <div className="rounded-3xl border border-blue-200/60 bg-white/70 p-2 shadow-[0_12px_30px_rgba(30,64,175,0.08)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_20px_60px_rgba(30,64,175,0.18)]">
              <Image
                src={hero}
                alt={item.title ?? "Listing image"}
                width={1600}
                height={1000}
                className="h-auto w-full"
                priority
                unoptimized={hero.startsWith("http") ? true : undefined}
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40" />
            </div>

            {imgs.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto rounded-xl p-1">
                {imgs.map((src, i) => (
                  <div
                    key={i}
                    className="shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-white/70 shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={`thumb-${i}`}
                      width={240}
                      height={160}
                      className="h-[88px] w-[132px] object-cover"
                      unoptimized={src.startsWith("http") ? true : undefined}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 描述区域 */}
        {item.description && (
          <section className="mt-5 md:mt-7">
            <div className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-[0_10px_30px_rgba(30,64,175,0.06)] backdrop-blur-xl">
              <h2 className="text-lg font-bold text-blue-900">Description</h2>
              <p className="mt-2 whitespace-pre-line leading-7 text-neutral-800/90">
                {item.description}
              </p>
            </div>
          </section>
        )}

        {/* 相似商品推荐 - 这里有 Image fill，但我检查了你的代码，已经加了 relative，完美！ */}
        {similar && similar.length > 0 && (
          <section className="mt-6 md:mt-10">
            <h3 className="mb-3 text-lg font-extrabold tracking-tight text-blue-900">
              Similar listings{item.city ? ` in ${item.city}` : ""}
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {similar.map((s) => {
                const srcs = imagesFrom(s);
                const cover = srcs[0] || "/og.png";
                return (
                  <a
                    key={s.id}
                    href={`/l/${s.id}`}
                    className="group overflow-hidden rounded-2xl border border-blue-100/70 bg-white/80 shadow-sm backdrop-blur-sm transition hover:shadow-[0_10px_30px_rgba(30,64,175,0.15)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={cover}
                        alt={s.title ?? "listing"}
                        fill
                        className="object-cover transition group-hover:scale-[1.03]"
                        sizes="(max-width:768px) 50vw, 33vw"
                        unoptimized={cover.startsWith("http") ? true : undefined}
                      />
                    </div>
                    <div className="p-3">
                      <div className="truncate text-sm font-semibold text-neutral-800">
                        {s.title ?? "Listing"}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-sm font-extrabold text-blue-700">
                          {fmtPrice(s.price)}
                        </div>
                        {s.city && (
                          <div className="text-xs text-neutral-500">{s.city}</div>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <div className="sticky bottom-4 mt-8 flex justify-end">
          <OpenInAppButton listingId={item.id} variant="primary" />
        </div>
      </div>
    </main>
  );
}