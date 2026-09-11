import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/catalog/repository";
import { environment } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!environment.siteUrl) return [];
  const products = await getProducts();
  const baseUrl = environment.siteUrl;

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/size-guide`, changeFrequency: "monthly", priority: 0.4 },
    ...products.filter((product) => !product.isDemo).map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
