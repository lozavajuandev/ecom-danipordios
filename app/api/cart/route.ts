import { NextResponse } from "next/server";

import { hasCommerceConfiguration } from "@/lib/config";
import { cartExpiry, getOrCreateCartToken, hashCartToken } from "@/lib/cart/session";
import { ensureGuestCart, getCartSnapshot } from "@/lib/cart/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasCommerceConfiguration()) {
    return NextResponse.json({ message: "La bolsa estará disponible al configurar Supabase." }, { status: 503 });
  }

  try {
    const token = await getOrCreateCartToken();
    const tokenHash = hashCartToken(token);
    await ensureGuestCart(tokenHash, cartExpiry());
    return NextResponse.json(await getCartSnapshot(tokenHash));
  } catch {
    return NextResponse.json({ message: "No fue posible consultar la bolsa." }, { status: 500 });
  }
}
