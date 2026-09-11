import { NextResponse } from "next/server";

import { applyVerifiedWompiEvent, type WompiEvent, verifyWompiEvent } from "@/lib/wompi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (rawBody.length > 256_000) return NextResponse.json({ message: "Payload demasiado grande." }, { status: 413 });
    const payload = JSON.parse(rawBody) as WompiEvent;
    if (!verifyWompiEvent(payload, request.headers.get("x-event-checksum"))) {
      return NextResponse.json({ message: "Firma inválida." }, { status: 401 });
    }
    await applyVerifiedWompiEvent(payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "No fue posible procesar el evento." }, { status: 500 });
  }
}
