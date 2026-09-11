export type ProductStatus = "draft" | "active" | "archived";

export type ProductMedia = {
  id: string;
  url: string;
  alt: string;
  position: number;
  kind: "image" | "video";
  width: number | null;
  height: number | null;
};

export type ProductVariant = {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: "t-shirt" | "hoodie";
  status: ProductStatus;
  material: string | null;
  fit: string | null;
  care: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  media: ProductMedia[];
  variants: ProductVariant[];
  isDemo: boolean;
};

export function productPriceRange(product: Product): { min: number | null; max: number | null } {
  const prices = product.variants
    .map((variant) => variant.priceCents)
    .filter((price): price is number => price !== null);

  if (prices.length === 0) return { min: null, max: null };

  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function findVariant(
  product: Product,
  selection: { color?: string | null; size?: string | null },
): ProductVariant | undefined {
  return product.variants.find(
    (variant) =>
      (selection.color === undefined || variant.color === selection.color) &&
      (selection.size === undefined || variant.size === selection.size),
  );
}

export function getColors(product: Product): string[] {
  return [...new Set(product.variants.map((variant) => variant.color).filter(Boolean))] as string[];
}

export function getSizes(product: Product, color?: string | null): string[] {
  return [
    ...new Set(
      product.variants
        .filter((variant) => !color || variant.color === color)
        .map((variant) => variant.size)
        .filter(Boolean),
    ),
  ] as string[];
}
