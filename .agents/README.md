# Harness de agentes — uniCommerce

Este directorio es el centro operativo del proyecto. Contiene el plan aprobado o pendiente de aprobación, los referentes, las decisiones y los contratos de trabajo de cada especialidad. No contiene código de la tienda.

## Estado actual

- Fase: inicio de implementación limitado — fundación web y catálogo de demostración.
- Gate 1: aprobado para el alcance limitado de D-016 (2026-09-11).
- Gate activo: Gate 2 para Supabase, inventario, pedidos, Wompi, envíos e infraestructura.
- Implementación de producto: autorizada para catálogo, PDP, carrito, checkout, Supabase y Wompi; D-017 bloquea la activación de checkout, pagos, logística y lanzamiento hasta completar configuración operativa.
- Stack fijado por el propietario: Next.js + Supabase + Wompi.

## Archivos de entrada obligatoria

1. `PRODUCT_PLAN.md`: visión, alcance, UX, arquitectura, modelo de datos, seguridad, rendimiento, SEO, pruebas y fases.
2. `V1_BRIEF.md`: traducción de los referentes elegidos a la primera experiencia de cuatro productos.
3. `LAUNCH_INPUTS.md`: checklist exacto de contenido, operación, activos y accesos necesarios.
4. `REFERENCE_STORES.md`: 30 referentes clasificados y qué estudiar de cada uno.
5. `DECISIONS.md`: supuestos y decisiones que requieren aprobación.
6. `HARNESS.md`: protocolo de coordinación, gates y matriz de responsabilidades.
7. `roles/*.md`: contrato detallado de cada especialidad.

## Perfiles

| Perfil | Archivo | Agente Codex ejecutable |
|---|---|---|
| Business Analyst | `roles/business-analyst.md` | `.codex/agents/business_analyst.toml` |
| Ecommerce Expert | `roles/ecommerce-expert.md` | `.codex/agents/ecommerce_expert.toml` |
| UX | `roles/ux.md` | `.codex/agents/ux_designer.toml` |
| Designer | `roles/designer.md` | `.codex/agents/visual_designer.toml` |
| Software Architect | `roles/software-architect.md` | `.codex/agents/software_architect.toml` |
| Backend | `roles/backend.md` | `.codex/agents/backend_engineer.toml` |
| Frontend | `roles/frontend.md` | `.codex/agents/frontend_engineer.toml` |
| SEO Expert | `roles/seo-expert.md` | `.codex/agents/seo_expert.toml` |

La carpeta `.agents` es la fuente de verdad solicitada para el harness. `.codex/agents` es el adaptador ejecutable para Codex: la documentación oficial ubica allí los agentes personalizados de alcance de proyecto.

## Regla de activación

No se ejecutan los ocho perfiles en cada tarea. El coordinador selecciona sólo los necesarios, asigna entregables sin solapamiento y consolida el resultado. Los perfiles de análisis trabajan en modo lectura; Backend y Frontend sólo escriben después del gate correspondiente.
