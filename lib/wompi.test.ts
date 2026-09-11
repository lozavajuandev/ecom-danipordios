import { createHash } from "node:crypto";

import { afterEach, describe, expect, it, vi } from "vitest";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function loadWompiWithSecrets() {
  vi.stubEnv("WOMPI_INTEGRITY_SECRET", "integrity-secret");
  vi.stubEnv("WOMPI_EVENTS_SECRET", "events-secret");
  vi.resetModules();
  return import("./wompi");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Wompi signatures", () => {
  it("builds the documented integrity material in the required order", async () => {
    const { createIntegritySignature } = await loadWompiWithSecrets();
    const expirationTime = "2026-09-11T18:30:00.000Z";

    expect(createIntegritySignature({
      reference: "UC-2609-ABC123",
      amountInCents: 9_500_000,
      currency: "COP",
      expirationTime,
    })).toBe(sha256(`UC-2609-ABC1239500000COP${expirationTime}integrity-secret`));
  });

  it("accepts only an event checksum that covers the declared transaction properties", async () => {
    const { verifyWompiEvent } = await loadWompiWithSecrets();
    const timestamp = 1_789_155_600;
    const checksum = sha256(`tx_123APPROVED9500000${timestamp}events-secret`);
    const event = {
      event: "transaction.updated",
      data: {
        transaction: {
          id: "tx_123",
          reference: "UC-2609-ABC123",
          status: "APPROVED",
          amount_in_cents: 9_500_000,
          currency: "COP",
        },
      },
      signature: {
        properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
        checksum,
      },
      timestamp,
    };

    expect(verifyWompiEvent(event, checksum)).toBe(true);
    expect(verifyWompiEvent(event, "not-the-event-checksum")).toBe(false);
  });
});
