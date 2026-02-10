// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.swaply.cc";
  const now = new Date();

  return [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/app`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
}
