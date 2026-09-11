import { describe, expect, it } from "vitest";

import { formatCop } from "./money";

describe("formatCop", () => {
  it("formats Wompi cent amounts as Colombian pesos", () => {
    expect(formatCop(9_500_000)).toContain("95.000");
  });

  it("does not present a made-up price", () => {
    expect(formatCop(null)).toBe("Precio por definir");
  });
});
