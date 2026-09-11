import { NextResponse } from "next/server";
import { z } from "zod";

import { hasCommerceConfiguration } from "@/lib/config";
import { setCartItem } from "@/lib/cart/repository";
import { getCartToken, hashCartToken } from "@/lib/cart/session";
import { assertSameOrigin } from "@/lib/security";

const quantitySchema = z.object({ quantity: z.number().int().min(0).max(10) });

export async function PATCH(request: Request, { params }: { params: Promise<{ variantId: string }> }) {
  if (!hasCommerceConfiguration()) return NextResponse.json({ message: "La bolsa no está configurada." }, { status: 503 });

  try {
    assertSameOrigin(request);
    const { variantId } = await params;
    if (!z.uuid().safeParse(variantId).success) throw new Error("Variante inválida.");
    const { quantity } = quantitySchema.parse(await request.json());
    const token = await getCartToken();
    if (!token) throw new Error("La bolsa no existe o venció.");
    await setCartItem(hashCartToken(token), variantId, quantity);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible actualizar la bolsa.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
