import { hasPublicSupabaseConfiguration } from "@/lib/config";
import { getPublicSupabaseClient } from "@/lib/supabase/server";

import { demoProducts } from "./demo";
import type { Product, ProductMedia, ProductVariant } from "./types";

type CatalogRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category: "t-shirt" | "hoodie";
  status: Product["status"];
  material: string | null;
  fit: string | null;
  care: string | null;
  seo_title: string | null;
  seo_description: string | null;
  product_media: Array<{
    id: string;
    storage_key: string;
    alt_text: string;
    position: number;
    kind: ProductMedia["kind"];
    width: number | null;
    height: number | null;
  }> | null;
  product_variants: Array<{
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    price_cents: number;
    compare_at_cents: number | null;
    active: boolean;
  }> | null;
};

type AvailabilityRow = { variant_id: string; available: boolean };

function mapProduct(row: CatalogRow, availability: Map<string, boolean>): Product {
  const supabase = getPublicSupabaseClient();
  const media = (row.product_media ?? [])
    .map((item) => ({
      id: item.id,
      url: supabase.storage.from("product-media").getPublicUrl(item.storage_key).data.publicUrl,
      alt: item.alt_text,
      position: item.position,
      kind: item.kind,
      width: item.width,
      height: item.height,
    }))
    .sort((a, b) => a.position - b.position);

  const variants: ProductVariant[] = (row.product_variants ?? []).map((variant) => {
    return {
      id: variant.id,
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      priceCents: variant.price_cents,
      compareAtCents: variant.compare_at_cents,
      available: variant.active && availability.get(variant.id) === true,
    };
  });

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    status: row.status,
    material: row.material,
    fit: row.fit,
    care: row.care,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    media,
    variants,
    isDemo: false,
  };
}

async function withAvailability(rows: CatalogRow[]): Promise<Product[]> {
  const variantIds = rows.flatMap((row) => row.product_variants?.map((variant) => variant.id) ?? []);
  if (variantIds.length === 0) return rows.map((row) => mapProduct(row, new Map()));

  const { data, error } = await getPublicSupabaseClient().rpc("variant_availability", { p_variant_ids: variantIds });
  if (error) throw new Error("No fue posible consultar la disponibilidad del catálogo.");
  const availability = new Map(((data ?? []) as AvailabilityRow[]).map((item) => [item.variant_id, item.available]));
  return rows.map((row) => mapProduct(row, availability));
}

export async function getProducts(): Promise<Product[]> {
  if (!hasPublicSupabaseConfiguration()) return demoProducts;

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, description, category, status, material, fit, care, seo_title, seo_description, product_media(id, storage_key, alt_text, position, kind, width, height), product_variants(id, sku, color, size, price_cents, compare_at_cents, active)",
    )
    .eq("status", "active")
    .order("published_at", { ascending: false });

  if (error) throw new Error("No fue posible cargar el catálogo publicado.");
  return withAvailability(data as unknown as CatalogRow[]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasPublicSupabaseConfiguration()) {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, description, category, status, material, fit, care, seo_title, seo_description, product_media(id, storage_key, alt_text, position, kind, width, height), product_variants(id, sku, color, size, price_cents, compare_at_cents, active)",
    )
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error("No fue posible cargar el producto solicitado.");
  return data ? (await withAvailability([data as unknown as CatalogRow]))[0] : null;
}
