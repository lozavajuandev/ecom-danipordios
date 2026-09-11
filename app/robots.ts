import type { MetadataRoute } from "next";

import { environment } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/checkout", "/orders/"],
    },
    ...(environment.siteUrl ? { sitemap: `${environment.siteUrl}/sitemap.xml` } : {}),
  };
}
