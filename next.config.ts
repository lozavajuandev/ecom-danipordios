import type { NextConfig } from "next";

let supabaseHostname: string | undefined;
try {
  supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : undefined;
} catch {
  // Runtime configuration provides a clearer commerce-disabled state than a build crash.
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/product-media/**",
          },
        ]
      : [],
  },
  poweredByHeader: false,
};

export default nextConfig;
