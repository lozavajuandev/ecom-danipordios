import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().trim().email().max(254),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,24}$/, "Ingresa un teléfono válido.").max(24),
  addressLine1: z.string().trim().min(5).max(180),
  addressLine2: z.string().trim().max(180).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().min(2).max(100),
  shippingMethodId: z.uuid(),
  acceptsTerms: z.literal(true),
  idempotencyKey: z.uuid(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
