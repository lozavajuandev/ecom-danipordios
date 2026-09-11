# uniCommerce — instrucciones del repositorio

- Antes de implementar, leer `.agents/README.md`, `.agents/PRODUCT_PLAN.md` y `.agents/DECISIONS.md`.
- La fase actual es **planificación**. No crear la aplicación ni escribir código de producto hasta que el usuario apruebe el Gate 1 registrado en `.agents/DECISIONS.md`.
- El producto es mobile-first, photo-first y guest-checkout-first. La velocidad, accesibilidad, SEO y exactitud de inventario/pagos son requisitos, no mejoras posteriores.
- Mantener Next.js como capa web, Supabase como base de datos/backend/storage y Wompi como pasarela. Cualquier cambio de stack requiere una decisión explícita.
- Nunca confiar en totales, precios, inventario ni estados de pago enviados por el cliente. Wompi y la base de datos se reconcilian en servidor; los webhooks deben ser verificados e idempotentes.
- No exponer llaves privadas, `service_role`, secretos de integridad ni datos personales en el cliente, logs, fixtures o commits.
- Para trabajo especializado, usar los perfiles descritos en `.agents/roles/` y los agentes ejecutables de `.codex/agents/`. Evitar ediciones paralelas sobre el mismo archivo.
- Cada entrega debe incluir: alcance cubierto, evidencia de validación, riesgos restantes y decisiones pendientes.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
