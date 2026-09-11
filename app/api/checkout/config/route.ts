import { NextResponse } from "next/server";

import { hasCommerceConfiguration, hasWompiConfiguration } from "@/lib/config";
import { getShippingMethods } from "@/lib/checkout/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const methods = await getShippingMethods();
    return NextResponse.json({
      commerceConfigured: hasCommerceConfiguration(),
      paymentConfigured: hasWompiConfiguration(),
      methods,
    });
  } catch {
    return NextResponse.json({ message: "No fue posible cargar la configuración de checkout." }, { status: 500 });
  }
}
