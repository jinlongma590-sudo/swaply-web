// src/app/city/[name]/page.tsx
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

type Listing = {
  id: string;
  title: string | null;
  price: number | string | null;
  city: string | null;
  images?: string[] | null;
  image_urls?: string[] | null;
  created_at?: string | null;
};

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

function firstImage(item: Listing): string {
  const arr = item.image_urls || item.images;
  if (Array.isArray(arr) && arr[0]) return arr[0];
  return "/og.png";
}

export async function generateMetadata(
  { params }: { params: { name: string } }
): Promise<Metadata> {
  const cityName = decodeURIComponent(params.name);
  return {
    title: `${cityName} Listings | Swaply`,
    description: `Browse items for sale in ${cityName} on Swaply`,
  };
}

export const revalidate = 60; // ISR: 1 minute

async function getCityListings(cityName: string): Promise<Listing[]> {
  const decodedCity = decodeURIComponent(cityName);
  
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, price, city, images, image_urls, created_at")
    .ilike("city", decodedCity)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching city listings:", error);
    return [];
  }

  return (data as Listing[]) || [];
}

export default async function CityPage({ params }: { params: { name: string } }) {
  const listings = await getCityListings(params.name);
  const cityName = decodeURIComponent(params.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-brand-600 shadow-lg">
        <div className="mx-auto max-w-[1320px] px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition">
            <div className="logo-square">S</div>
            <span className="text-lg font-semibold">Swaply</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/browse" className="btn btn-ghost text-sm">
              Open Web App
            </Link>
            <Link href="/download" className="btn btn-ghost text-sm">
              Download
            </Link>
          </nav>
        </div>
      </header>

      {/* 主内容 */}
      <main className="mx-auto max-w-[1320px] px-4 py-8">
        {/* 城市标题 */}
        <div className="mb-8 flex items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-brand-600">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>
          </svg>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-900 mb-1">
              {cityName}
            </h1>
            <p className="text-brand-700">
              {listings.length} {listings.length === 1 ? "item" : "items"} available
            </p>
          </div>
        </div>

        {/* 商品网格 */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/l/${item.id}`}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl bg-white border border-blue-100 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
                  {/* 商品图片 */}
                  <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={firstImage(item)}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={firstImage(item).startsWith("http")}
                    />
                  </div>

                  {/* 商品信息 */}
                  <div className="p-3">
                    <h4 className="font-semibold text-brand-900 truncate text-sm">
                      {item.title || "Untitled"}
                    </h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-brand-600">
                        {fmtPrice(item.price)}
                      </span>
                      {item.city && (
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>
                          </svg>
                          {item.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏙️</div>
            <h3 className="text-xl font-bold text-brand-900 mb-2">
              No items in {cityName} yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Check back soon or browse other cities!
            </p>
            <Link
              href="/browse"
              className="inline-block px-6 py-3 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition"
            >
              Browse All Listings
            </Link>
          </div>
        )}

        {/* 返回首页按钮 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-200 text-brand-700 rounded-full font-semibold hover:bg-brand-50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
