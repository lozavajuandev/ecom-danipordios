import { createHash } from "node:crypto";

import { ConfigurationError, environment, hasWompiConfiguration } from "@/lib/config";
import { safeEqual } from "@/lib/security";
import { getServiceSupabaseClient } from "@/lib/supabase/server";

export type WompiTransaction = {
  id: string;
  reference: string;
  status: string;
  amount_in_cents: number;
  currency: string;
};

export type WompiEvent = {
  event: string;
  data: { transaction?: WompiTransaction };
  signature: { properties: string[]; checksum: string };
  timestamp: number;
};

export type PreparedWompiPayment = {
  publicKey: string;
  currency: "COP";
  amountInCents: number;
  reference: string;
  integrity: string;
  redirectUrl: string;
  expirationTime: string;
};

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function createIntegritySignature(input: {
  reference: string;
  amountInCents: number;
  currency: "COP";
  expirationTime: string;
}): string {
  if (!environment.wompiIntegritySecret) throw new ConfigurationError("Falta WOMPI_INTEGRITY_SECRET.");
  return sha256(
    `${input.reference}${input.amountInCents}${input.currency}${input.expirationTime}${environment.wompiIntegritySecret}`,
  );
}

export function prepareWompiPayment(input: {
  reference: string;
  amountInCents: number;
  accessToken: string;
  expiresAt: string;
}): PreparedWompiPayment {
  if (!hasWompiConfiguration() || !environment.wompiPublicKey || !environment.siteUrl) {
    throw new ConfigurationError("Falta la configuración de Wompi o la URL pública del sitio.");
  }

  return {
    publicKey: environment.wompiPublicKey,
    currency: "COP",
    amountInCents: input.amountInCents,
    reference: input.reference,
    integrity: createIntegritySignature({
      reference: input.reference,
      amountInCents: input.amountInCents,
      currency: "COP",
      expirationTime: input.expiresAt,
    }),
    redirectUrl: `${environment.siteUrl}/orders/${input.accessToken}`,
    expirationTime: input.expiresAt,
  };
}

function eventValue(data: WompiEvent["data"], path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object" || !(key in current)) return undefined;
    return (current as Record<string, unknown>)[key];
  }, data);
}

export function verifyWompiEvent(payload: WompiEvent, checksumHeader: string | null): boolean {
  if (!environment.wompiEventsSecret || !payload.signature?.properties || !payload.signature?.checksum) return false;
  const values = payload.signature.properties.map((property) => eventValue(payload.data, property));
  if (values.some((value) => value === undefined || value === null)) return false;
  const expected = sha256(`${values.map(String).join("")}${payload.timestamp}${environment.wompiEventsSecret}`);
  const received = checksumHeader ?? payload.signature.checksum;
  return safeEqual(expected.toLowerCase(), received.toLowerCase()) &&
    (!checksumHeader || safeEqual(checksumHeader.toLowerCase(), payload.signature.checksum.toLowerCase()));
}

function sanitizedPayload(transaction: WompiTransaction, source: "wompi_webhook" | "wompi_reconcile"): Record<string, unknown> {
  return {
    source,
    transaction: {
      id: transaction.id,
      reference: transaction.reference,
      status: transaction.status,
      amount_in_cents: transaction.amount_in_cents,
      currency: transaction.currency,
    },
  };
}

export async function applyWompiTransaction(input: {
  transaction: WompiTransaction;
  eventKey: string;
  source: "wompi_webhook" | "wompi_reconcile";
}): Promise<void> {
  const { transaction, eventKey, source } = input;
  const { error } = await getServiceSupabaseClient().rpc("apply_wompi_payment_event", {
    p_event_key: eventKey,
    p_reference: transaction.reference,
    p_transaction_id: transaction.id,
    p_provider_status: transaction.status,
    p_amount_cents: transaction.amount_in_cents,
    p_currency: transaction.currency,
    p_payload: sanitizedPayload(transaction, source),
  });
  if (error) throw new Error("No fue posible aplicar el evento de pago.");
}

export async function applyVerifiedWompiEvent(payload: WompiEvent): Promise<void> {
  const transaction = payload.data.transaction;
  if (payload.event !== "transaction.updated" || !transaction?.id || !transaction.reference) return;

  const eventKey = `wompi:${sha256(`${transaction.id}:${transaction.status}:${payload.timestamp}`)}`;
  await applyWompiTransaction({ transaction, eventKey, source: "wompi_webhook" });
}

export async function releaseExpiredReservations(): Promise<number> {
  const { data, error } = await getServiceSupabaseClient().rpc("release_expired_reservations");
  if (error) throw new Error("No fue posible procesar reservas vencidas.");
  return typeof data === "number" ? data : 0;
}
