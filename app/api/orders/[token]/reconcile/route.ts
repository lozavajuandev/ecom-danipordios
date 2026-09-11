import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { environment } from "@/lib/config";
import { getOrderByAccessToken } from "@/lib/orders/repository";
import { assertSameOrigin } from "@/lib/security";
import { applyWompiTransaction, type WompiTransaction } from "@/lib/wompi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const transactionId = new URL(request.url).searchParams.get("transaction_id");
  if (!transactionId || !environment.wompiPrivateKey) {
    return NextResponse.json({ message: "La conciliación no está disponible." }, { status: 503 });
  }

  try {
    assertSameOrigin(request);
    const order = await getOrderByAccessToken(token);
    if (!order?.payment || order.payment.transactionId && order.payment.transactionId !== transactionId) {
      return NextResponse.json({ message: "Pedido o transacción no válidos." }, { status: 404 });
    }
    const baseUrl = environment.wompiEnvironment === "production" ? "https://production.wompi.co" : "https://sandbox.wompi.co";
    const response = await fetch(`${baseUrl}/v1/transactions/${encodeURIComponent(transactionId)}`, {
      headers: { Authorization: `Bearer ${environment.wompiPrivateKey}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Wompi no devolvió la transacción.");
    const body = (await response.json()) as { data?: WompiTransaction };
    if (!body.data || body.data.reference !== order.payment.reference) throw new Error("La transacción no corresponde al pedido.");

    await applyWompiTransaction({
      transaction: body.data,
      eventKey: `reconcile:${createHash("sha256").update(`${body.data.id}:${body.data.status}`).digest("hex")}`,
      source: "wompi_reconcile",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "No fue posible conciliar la transacción." }, { status: 502 });
  }
}
