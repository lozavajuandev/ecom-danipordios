import { NextResponse } from "next/server";

import { environment } from "@/lib/config";
import { safeEqual } from "@/lib/security";
import { releaseExpiredReservations } from "@/lib/wompi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!environment.cronSecret || !secret || !safeEqual(secret, environment.cronSecret)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const released = await releaseExpiredReservations();
    return NextResponse.json({ released });
  } catch {
    return NextResponse.json({ message: "No fue posible procesar reservas." }, { status: 500 });
  }
}
