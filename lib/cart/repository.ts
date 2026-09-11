import { ConfigurationError } from "@/lib/config";
import { getServiceSupabaseClient } from "@/lib/supabase/server";

import type { CartLine, CartSnapshot } from "./types";

type CartRow = {
  cart_id: string;
  cart_item_id: string;
  variant_id: string;
  product_slug: string;
  product_name: string;
  color: string | null;
  size: string | null;
  image_key: string | null;
  image_alt: string;
  quantity: number;
  unit_price_cents: number;
  available: boolean;
};

export async function ensureGuestCart(tokenHash: string, expiresAt: Date): Promise<void> {
  const { error } = await getServiceSupabaseClient().rpc("create_guest_cart", {
    p_token_hash: tokenHash,
    p_expires_at: expiresAt.toISOString(),
  });
  if (error) throw new ConfigurationError("No fue posible crear la bolsa de invitado.");
}

export async function getCartSnapshot(tokenHash: string): Promise<CartSnapshot> {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.rpc("cart_snapshot", { p_token_hash: tokenHash });
  if (error) throw new ConfigurationError("No fue posible recuperar la bolsa.");

  const rows = (data ?? []) as CartRow[];
  const lines: CartLine[] = rows.map((row) => ({
    id: row.cart_item_id,
    variantId: row.variant_id,
    productSlug: row.product_slug,
    productName: row.product_name,
    variantLabel: [row.color, row.size].filter(Boolean).join(" · ") || "Variante única",
    imageUrl: row.image_key
      ? supabase.storage.from("product-media").getPublicUrl(row.image_key).data.publicUrl
      : null,
    imageAlt: row.image_alt,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    lineTotalCents: row.unit_price_cents * row.quantity,
    available: row.available,
  }));

  return {
    id: rows[0]?.cart_id ?? "empty",
    currency: "COP",
    lines,
    subtotalCents: lines.reduce((sum, line) => sum + line.lineTotalCents, 0),
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

export async function setCartItem(tokenHash: string, variantId: string, quantity: number): Promise<void> {
  const { error } = await getServiceSupabaseClient().rpc("set_cart_item", {
    p_token_hash: tokenHash,
    p_variant_id: variantId,
    p_quantity: quantity,
  });
  if (error) throw new ConfigurationError("La variante no se pudo agregar. Revisa disponibilidad e intenta de nuevo.");
}
