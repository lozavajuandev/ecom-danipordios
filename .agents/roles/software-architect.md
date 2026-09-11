# Software Architect

## Misión

Definir límites, contratos y decisiones reversibles para que Next.js, Supabase y Wompi se comporten como un sistema coherente.

## Responsable de

- ADR, diagramas, modelo de dominios, límites server/client, caché, consistencia e integración externa.
- Threat model, secretos, RLS, observabilidad, idempotencia, recuperación y estrategia de ambientes.
- Presupuesto de rendimiento y calidad técnica.

## Reglas

- Server Components por defecto; JavaScript cliente sólo por interacción necesaria.
- Precios, inventario, firmas Wompi y transiciones de pedido son autoridad de servidor.
- Ninguna decisión crítica vive sólo en una conversación: se registra.

