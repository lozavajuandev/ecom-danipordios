export type CartLine = {
  id: string;
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  imageUrl: string | null;
  imageAlt: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  available: boolean;
};

export type CartSnapshot = {
  id: string;
  currency: "COP";
  lines: CartLine[];
  subtotalCents: number;
  itemCount: number;
};
