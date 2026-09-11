import { createHash } from "node:crypto";

import { getServiceSupabaseClient } from "@/lib/supabase/server";

export type OrderSnapshot = {
  id: string;
  number: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: string;
  shippingMethodName: string;
  payment: { reference: string; status: string; providerStatus: string | null; transactionId: string | null } | null;
  items: Array<{ id: string; name: string; sku: string; options: Record<string, string>; quantity: number; unitPriceCents: number }>;
};

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function getOrderByAccessToken(accessToken: string): Promise<OrderSnapshot | null> {
  const { data, error } = await getServiceSupabaseClient()
    .from("orders")
    .select("id, public_number, status, subtotal_cents, shipping_cents, tax_cents, total_cents, created_at, shipping_method_name, payment_attempts(reference, status, provider_status, transaction_id), order_items(id, product_name, sku, option_snapshot, quantity, unit_price_cents)")
    .eq("access_token_hash", tokenHash(accessToken))
    .maybeSingle();
  if (error) throw new Error("No fue posible consultar el pedido.");
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    public_number: string;
    status: string;
    subtotal_cents: number;
    shipping_cents: number;
    tax_cents: number;
    total_cents: number;
    created_at: string;
    shipping_method_name: string;
    payment_attempts: Array<{ reference: string; status: string; provider_status: string | null; transaction_id: string | null }>;
    order_items: Array<{ id: string; product_name: string; sku: string; option_snapshot: Record<string, string>; quantity: number; unit_price_cents: number }>;
  };

  return {
    id: row.id,
    number: row.public_number,
    status: row.status,
    subtotalCents: row.subtotal_cents,
    shippingCents: row.shipping_cents,
    taxCents: row.tax_cents,
    totalCents: row.total_cents,
    createdAt: row.created_at,
    shippingMethodName: row.shipping_method_name,
    payment: row.payment_attempts[0]
      ? {
          reference: row.payment_attempts[0].reference,
          status: row.payment_attempts[0].status,
          providerStatus: row.payment_attempts[0].provider_status,
          transactionId: row.payment_attempts[0].transaction_id,
        }
      : null,
    items: row.order_items.map((item) => ({
      id: item.id,
      name: item.product_name,
      sku: item.sku,
      options: item.option_snapshot,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
    })),
  };
}
