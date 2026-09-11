# ADR 0001 — Fundación web de uniCommerce

- Estado: aceptada
- Fecha: 2026-09-11

## Contexto

El propietario autorizó una primera implementación sin operaciones de checkout, pagos, envíos, impuestos, facturación ni datos reales de catálogo. La capa web debe conservar los límites acordados para una tienda colombiana, mobile-first, photo-first y guest-checkout-first.

## Decisión

- Usar Next.js `16.3.3` (Active LTS parcheado) con App Router, TypeScript `5.9.3` estricto y ESLint `9.39.5` compatible con `eslint-config-next`.
- Fijar React y React DOM `19.3.0`.
- Empezar con Server Components por defecto y cero librerías de UI, estado o analítica.
- Mantener Supabase y Wompi fuera del runtime hasta que sus contratos, secretos, esquema, impuestos, envíos y reglas operativas estén aprobados.
- Servir la imagen LCP local, con dimensiones explícitas y `priority`; no cargar scripts de terceros.
- Mantener el preview sin indexación hasta que exista dominio, contenido comercial y SEO final.

## Consecuencias

La base puede validarse y evolucionar sin exponer secretos ni simular transacciones. Antes de introducir carrito real, checkout o Wompi se requiere el Gate 2 y los dominios pendientes de D-017.
