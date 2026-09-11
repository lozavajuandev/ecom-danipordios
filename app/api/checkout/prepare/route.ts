import { NextResponse } from "next/server";

import { hasCommerceConfiguration, hasWompiConfiguration } from "@/lib/config";
import { prepareOrderFromCart } from "@/lib/checkout/repository";
import { checkoutSchema } from "@/lib/checkout/validation";
import { getCartToken, hashCartToken, rotateCartToken } from "@/lib/cart/session";
import { assertSameOrigin } from "@/lib/security";
import { prepareWompiPayment } from "@/lib/wompi";

export async function POST(request: Request) {
  if (!hasCommerceConfiguration() || !hasWompiConfiguration()) {
    return NextResponse.json({ message: "Falta configurar el comercio en el servidor." }, { status: 503 });
  }

  try {
    assertSameOrigin(request);
    const input = checkoutSchema.parse(await request.json());
    const cartToken = await getCartToken();
    if (!cartToken) throw new Error("Tu bolsa venció. Agrega las piezas de nuevo.");

    const preparedOrder = await prepareOrderFromCart(hashCartToken(cartToken), input);
    const payment = prepareWompiPayment({
      reference: preparedOrder.reference,
      amountInCents: preparedOrder.total_cents,
      accessToken: preparedOrder.access_token,
      expiresAt: preparedOrder.expires_at,
    });
    await rotateCartToken();

    return NextResponse.json({ payment, orderUrl: `/orders/${preparedOrder.access_token}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible preparar el pago.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
