import { NextResponse } from "next/server";

import { hasCommerceConfiguration } from "@/lib/config";
import { getCartSnapshot } from "@/lib/cart/repository";
import { getCartToken, hashCartToken } from "@/lib/cart/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasCommerceConfiguration()) return NextResponse.json({ count: 0 });

  try {
    const token = await getCartToken();
    if (!token) return NextResponse.json({ count: 0 });
    const cart = await getCartSnapshot(hashCartToken(token));
    return NextResponse.json({ count: cart.itemCount });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
