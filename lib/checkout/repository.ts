import { ConfigurationError, hasPublicSupabaseConfiguration } from "@/lib/config";
import { getPublicSupabaseClient, getServiceSupabaseClient } from "@/lib/supabase/server";

import type { CheckoutInput } from "./validation";

export type ShippingMethod = {
  id: string;
  name: string;
  flatRateCents: number;
  freeFromSubtotalCents: number | null;
  minBusinessDays: number | null;
  maxBusinessDays: number | null;
};

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  if (!hasPublicSupabaseConfiguration()) return [];
  const { data, error } = await getPublicSupabaseClient()
    .from("shipping_methods")
    .select("id, name, flat_rate_cents, free_from_subtotal_cents, min_business_days, max_business_days")
    .eq("active", true)
    .order("flat_rate_cents");
  if (error) throw new ConfigurationError("No fue posible cargar los métodos de envío.");

  return (data ?? []).map((method) => ({
    id: method.id,
    name: method.name,
    flatRateCents: method.flat_rate_cents,
    freeFromSubtotalCents: method.free_from_subtotal_cents,
    minBusinessDays: method.min_business_days,
    maxBusinessDays: method.max_business_days,
  }));
}

export async function prepareOrderFromCart(tokenHash: string, input: CheckoutInput) {
  const { data, error } = await getServiceSupabaseClient().rpc("prepare_checkout", {
    p_token_hash: tokenHash,
    p_idempotency_key: input.idempotencyKey,
    p_contact: { email: input.email, phone: input.phone },
    p_shipping_address: {
      address_line_1: input.addressLine1,
      ...(input.addressLine2 ? { address_line_2: input.addressLine2 } : {}),
      city: input.city,
      region: input.region,
      country: "CO",
    },
    p_shipping_method_id: input.shippingMethodId,
  });
  if (error || !data?.[0]) {
    throw new ConfigurationError("No fue posible preparar el pedido. Verifica la bolsa, envío e inventario.");
  }
  return data[0] as {
    order_id: string;
    access_token: string;
    reference: string;
    total_cents: number;
    currency: "COP";
    expires_at: string;
  };
}
