import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { ConfigurationError, environment, hasCommerceConfiguration, hasPublicSupabaseConfiguration } from "@/lib/config";

let publicClient: SupabaseClient | undefined;
let serviceClient: SupabaseClient | undefined;

export function getPublicSupabaseClient(): SupabaseClient {
  if (!hasPublicSupabaseConfiguration()) {
    throw new ConfigurationError("Faltan las variables públicas de Supabase.");
  }

  publicClient ??= createClient(environment.supabaseUrl!, environment.supabasePublishableKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return publicClient;
}

export function getServiceSupabaseClient(): SupabaseClient {
  if (!hasCommerceConfiguration()) {
    throw new ConfigurationError("Faltan las variables privadas necesarias para comercio.");
  }

  serviceClient ??= createClient(environment.supabaseUrl!, environment.supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serviceClient;
}
