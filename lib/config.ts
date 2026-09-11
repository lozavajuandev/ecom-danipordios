const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const environment = {
  siteUrl,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cartCookieSecret: process.env.CART_COOKIE_SECRET,
  wompiPublicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
  wompiIntegritySecret: process.env.WOMPI_INTEGRITY_SECRET,
  wompiEventsSecret: process.env.WOMPI_EVENTS_SECRET,
  wompiPrivateKey: process.env.WOMPI_PRIVATE_KEY,
  wompiEnvironment: process.env.WOMPI_ENVIRONMENT ?? "sandbox",
  cronSecret: process.env.CRON_SECRET,
} as const;

export function hasPublicSupabaseConfiguration(): boolean {
  return Boolean(environment.supabaseUrl && environment.supabasePublishableKey);
}

export function hasCommerceConfiguration(): boolean {
  return Boolean(
    hasPublicSupabaseConfiguration() &&
      environment.supabaseServiceRoleKey &&
      environment.cartCookieSecret,
  );
}

export function hasWompiConfiguration(): boolean {
  return Boolean(
    environment.siteUrl &&
      environment.wompiPublicKey &&
      environment.wompiIntegritySecret &&
      environment.wompiEventsSecret &&
      environment.wompiPrivateKey,
  );
}

export class ConfigurationError extends Error {
  constructor(message = "La tienda aún no terminó su configuración operativa.") {
    super(message);
    this.name = "ConfigurationError";
  }
}
