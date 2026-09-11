export const COP_CURRENCY = "COP" as const;

export function formatCop(cents: number | null): string {
  if (cents === null) return "Precio por definir";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: COP_CURRENCY,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function assertCents(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("El valor monetario debe ser un entero no negativo en centavos.");
  }

  return value;
}
