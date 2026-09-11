import { NextResponse } from "next/server";
import { z } from "zod";

import { hasCommerceConfiguration } from "@/lib/config";
import { setCartItem } from "@/lib/cart/repository";
import { getOrCreateCartToken, hashCartToken } from "@/lib/cart/session";
import { assertSameOrigin } from "@/lib/security";

const itemSchema = z.object({ variantId: z.uuid(), quantity: z.number().int().min(1).max(10) });

export async function POST(request: Request) {
  if (!hasCommerceConfiguration()) {
    return NextResponse.json({ message: "La bolsa se activará al configurar Supabase." }, { status: 503 });
  }

  try {
    assertSameOrigin(request);
    const body = itemSchema.parse(await request.json());
    const token = await getOrCreateCartToken();
    await setCartItem(hashCartToken(token), body.variantId, body.quantity);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible agregar la pieza.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
