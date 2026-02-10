// src/app/browse/page.tsx - 只升级顶部，保留所有原功能
"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

type Listing = {
  id: string;
  title: string | null;
  price: number | string | null;
  city: string | null;
  category?: string | null;
  images?: string[] | null;
  image_urls?: string[] | null;
  created_at?: string | null;
};

// 分类配置（与 App 一致）
const CATEGORIES = [
  { slug: "all", label: "All Listings", icon: "🔥", count: 0 },
  { slug: "phones", label: "Phones", icon: "📱", count: 0 },
  { slug: "vehicles", label: "Vehicles", icon: "🚗", count: 0 },
  { slug: "property", label: "Property", icon: "🏢", count: 0 },
  { slug: "electronics", label: "Electronics", icon: "💻", count: 0 },
  { slug: "fashion", label: "Fashion", icon: "👗", count: 0 },
  { slug: "services", label: "Services", icon: "🔧", count: 0 },
  { slug: "jobs", label: "Jobs", icon: "💼", count: 0 },
  { slug: "home-furniture", label: "Home & Furniture", icon: "🛋️", count: 0 },
  { slug: "beauty-care", label: "Beauty & Care", icon: "💄", count: 0 },
  { slug: "pets", label: "Pets", icon: "🐾", count: 0 },
  { slug: "baby-kids", label: "Baby & Kids", icon: "🧸", count: 0 },
  { slug: "repair", label: "Repair", icon: "🛠️", count: 0 },
  { slug: "leisure", label: "Leisure", icon: "🏃", count: 0 },
  { slug: "food-drinks", label: "Food & Drinks", icon: "🍔", count: 0 },
];

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

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Zimbabwe");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 加载商品
  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        let query = supabase
          .from("listings")
          .select("id, title, price, city, category, images, image_urls, created_at")
          .order("created_at", { ascending: false })
          .limit(100);

        // 分类筛选
        if (selectedCategory !== "all") {
          const categoryName = selectedCategory.replace(/-/g, " ");
          query = query.ilike("category", `%${categoryName}%`);
        }

        // 城市筛选
        if (selectedCity !== "All Zimbabwe") {
          query = query.ilike("city", selectedCity);
        }

        // 搜索筛选
        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
          setListings(data as Listing[]);
        }
      } catch (err) {
        console.error("Error loading listings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [selectedCategory, selectedCity, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 搜索会通过 useEffect 自动触发
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* 🚀 动态网格背景 - 保留 */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(45, 111, 230, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 111, 230, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'grid-move 20s linear infinite'
      }} />

      {/* 🚀 动态光晕 - 保留 */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)',
        filter: 'blur(60px)',
        animation: 'glow-pulse 8s ease-in-out infinite'
      }} />

      {/* 🎨 超现代化顶部导航 - 新设计！ */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/20" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="h-20 flex items-center justify-between">
            {/* Logo 区域 */}
            <Link href="/" className="group flex items-center gap-4">
              <div className="relative">
                {/* 外圈光环 */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                {/* Logo */}
                <div className="relative w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center font-black text-2xl transition-all duration-300 group-hover:scale-110" style={{
                  background: 'linear-gradient(135deg, #fff 0%, #f0f9ff 100%)',
                  color: '#3b82f6'
                }}>
                  S
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xl tracking-tight">Swaply</span>
                <span className="text-blue-100 text-xs font-medium tracking-wider">MARKETPLACE</span>
              </div>
            </Link>

            {/* 右侧按钮 */}
            <Link
              href="/download"
              className="group relative px-6 py-3 rounded-2xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              {/* 内部光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download App
              </span>
            </Link>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </header>

      {/* 🚀 霓虹玻璃态搜索栏 - 保留原样 */}
      <div className="sticky top-20 z-40 relative" style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200, 200, 200, 0.3)',
        boxShadow: '0 4px 12px rgba(45, 111, 230, 0.1)'
      }}>
        <div className="mx-auto max-w-[1400px] px-4 py-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            {/* 城市选择器 */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-11 px-4 rounded-xl font-medium transition-all md:w-48 relative"
              style={{
                border: '2px solid rgba(45, 111, 230, 0.2)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: '#1e293b',
                boxShadow: '0 2px 8px rgba(45, 111, 230, 0.1)',
                outline: 'none'
              }}
            >
              <option value="All Zimbabwe">All Zimbabwe</option>
              <option value="Harare">Harare</option>
              <option value="Bulawayo">Bulawayo</option>
              <option value="Chitungwiza">Chitungwiza</option>
              <option value="Mutare">Mutare</option>
              <option value="Gweru">Gweru</option>
              <option value="Kwekwe">Kwekwe</option>
              <option value="Kadoma">Kadoma</option>
              <option value="Masvingo">Masvingo</option>
              <option value="Chinhoyi">Chinhoyi</option>
              <option value="Chegutu">Chegutu</option>
              <option value="Bindura">Bindura</option>
              <option value="Marondera">Marondera</option>
              <option value="Redcliff">Redcliff</option>
            </select>

            {/* 🚀 霓虹搜索框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I am looking for..."
                className="w-full h-11 pl-4 pr-12 rounded-xl transition-all"
                style={{
                  border: '2px solid rgba(45, 111, 230, 0.2)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#1e293b',
                  boxShadow: '0 2px 8px rgba(45, 111, 230, 0.1)',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-white grid place-items-center transition-all hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff 0%, #3a8bff 50%, #a855f7 100%)',
                  boxShadow: '0 2px 8px rgba(0, 212, 255, 0.4), 0 0 12px rgba(0, 212, 255, 0.2)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>

            {/* 🚀 霓虹视图切换 */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{
              border: '2px solid rgba(45, 111, 230, 0.2)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(45, 111, 230, 0.1)'
            }}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "" : "text-neutral-600 hover:bg-neutral-100"}`}
                style={viewMode === "grid" ? {
                  background: 'linear-gradient(135deg, #00d4ff 0%, #3a8bff 50%, #a855f7 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 212, 255, 0.4)'
                } : {}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "" : "text-neutral-600 hover:bg-neutral-100"}`}
                style={viewMode === "list" ? {
                  background: 'linear-gradient(135deg, #00d4ff 0%, #3a8bff 50%, #a855f7 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 212, 255, 0.4)'
                } : {}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 主内容区域 - 保留所有原功能 */}
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 🚀 霓虹玻璃态分类导航 - 保留 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 p-4 rounded-2xl relative" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: '0 8px 32px rgba(45, 111, 230, 0.15)'
            }}>
              {/* 霓虹边框 */}
              <div style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(135deg, #00d4ff, #a855f7, #00d4ff)',
                backgroundSize: '200% 200%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'neon-border 4s linear infinite',
                opacity: 0.6,
                pointerEvents: 'none'
              }} />

              <h3 className="font-bold text-neutral-900 mb-3 text-sm uppercase tracking-wide" style={{
                background: 'linear-gradient(135deg, #00d4ff, #3a8bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Categories</h3>
              <nav className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      selectedCategory === cat.slug ? "" : "text-neutral-700 hover:bg-brand-50 hover:scale-[1.01]"
                    }`}
                    style={selectedCategory === cat.slug ? {
                      background: 'linear-gradient(135deg, #00d4ff 0%, #3a8bff 50%, #a855f7 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 212, 255, 0.4), 0 0 20px rgba(0, 212, 255, 0.2)',
                      transform: 'scale(1.02)'
                    } : {}}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm flex-1 font-medium">{cat.label}</span>
                    {selectedCategory === cat.slug && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* 移动端分类选择器 */}
          <div className="lg:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-neutral-300 bg-white text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 右侧商品网格 - 保留所有霓虹效果和3D效果 */}
          <div className="flex-1 min-w-0">
            {/* 结果数量 */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">
                {selectedCategory === "all" ? "All Listings" : CATEGORIES.find(c => c.slug === selectedCategory)?.label}
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  ({listings.length} {listings.length === 1 ? "ad" : "ads"})
                </span>
              </h2>
            </div>

            {/* 商品列表 */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600" />
              </div>
            ) : listings.length > 0 ? (
              <div className={`
                grid gap-4
                ${viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                }
              `}>
                {listings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/l/${item.id}`}
                    className="group relative"
                  >
                    <div className={`overflow-hidden rounded-2xl transition-all duration-500 ${viewMode === "list" ? "flex flex-row" : ""}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid transparent',
                        backgroundClip: 'padding-box',
                        boxShadow: '0 8px 24px rgba(45, 111, 230, 0.15)',
                        transformStyle: 'preserve-3d'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) rotateX(2deg) rotateY(-2deg)';
                        e.currentTarget.style.boxShadow = '0 16px 48px rgba(45, 111, 230, 0.25), 0 0 40px rgba(0, 212, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 111, 230, 0.15)';
                      }}
                    >
                      {/* 霓虹边框 */}
                      <div style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '16px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #00d4ff, #a855f7, #00d4ff)',
                        backgroundSize: '200% 200%',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        animation: 'neon-border-phone 4s linear infinite',
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.3s'
                      }} className="group-hover:opacity-60" />

                      {/* 商品图片 */}
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-32" : "aspect-[4/3] w-full"}`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(247, 251, 255, 0.95), rgba(238, 246, 255, 0.95))'
                        }}
                      >
                        <Image
                          src={firstImage(item)}
                          alt={item.title || "Product"}
                          fill
                          className="object-cover transition-transform duration-500"
                          style={{
                            transform: 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.transform = 'scale(1)';
                          }}
                          sizes={viewMode === "list" ? "192px" : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
                          unoptimized={firstImage(item).startsWith("http")}
                        />
                        {/* 渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* 商品信息 */}
                      <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <h4 className="font-semibold text-neutral-900 text-sm mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
                          {item.title || "Untitled"}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold" style={{
                            background: 'linear-gradient(135deg, #00d4ff, #3a8bff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>
                            {fmtPrice(item.price)}
                          </span>
                          {item.city && (
                            <span className="text-xs flex items-center gap-1 px-2 py-1 rounded-full" style={{
                              background: 'rgba(45, 111, 230, 0.1)',
                              color: '#2d6fe6'
                            }}>
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
              <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  No listings found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCity("All Zimbabwe");
                    setSearchQuery("");
                  }}
                  className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}