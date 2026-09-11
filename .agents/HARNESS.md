# Protocolo de coordinación

## Principios

1. El coordinador conserva requisitos, decisiones y resultado final; los especialistas devuelven evidencia y recomendaciones acotadas.
2. Los trabajos de investigación, auditoría y pruebas pueden ir en paralelo. Las escrituras que toquen los mismos módulos se serializan.
3. Ningún especialista cambia alcance, stack o política comercial de forma implícita.
4. Seguridad de pagos, integridad de inventario, accesibilidad y rendimiento pueden bloquear un release.
5. Toda recomendación se separa en: hecho comprobado, inferencia, propuesta y decisión pendiente.

## Ciclo de una tarea

1. **Brief:** objetivo, contexto, archivos permitidos, fuera de alcance y criterio de aceptación.
2. **Exploración:** Business/UX/Architecture/SEO reúnen evidencia sin modificar producto.
3. **Decisión:** se registra cualquier cambio material en `DECISIONS.md`.
4. **Ejecución:** Backend y Frontend trabajan con contratos y migraciones acordados.
5. **Revisión cruzada:** el dueño funcional y el dueño técnico revisan el cambio.
6. **Verificación:** pruebas, accesibilidad, rendimiento, seguridad, SEO y evidencia visual según riesgo.
7. **Handoff:** resumen, archivos, comandos ejecutados, resultados y riesgos restantes.

## Gates

- **Gate 1 — Product direction:** referentes, público, mercado, catálogo, operación y plan aprobados.
- **Gate 2 — Technical design:** ADR, esquema, RLS, contrato Wompi, estados de pedido, presupuesto de rendimiento y wireframes aprobados.
- **Gate 3 — Feature complete:** catálogo, PDP, carrito, checkout, pedido, admin mínimo y eventos analíticos completos en sandbox.
- **Gate 4 — Release candidate:** UAT, conciliación de pagos, concurrencia de inventario, legales, accesibilidad, SEO y rendimiento aprobados.
- **Gate 5 — Production:** llaves productivas, webhooks, dominio, backups, alertas, runbooks y rollback validados.

## Matriz de responsabilidad

| Artefacto | Responsable | Revisores obligatorios |
|---|---|---|
| PRD, alcance y KPIs | Business Analyst | Ecommerce, UX, propietario |
| Funnel, merchandising y operación | Ecommerce Expert | Business, Backend |
| Flujos, wireframes y pruebas de usabilidad | UX | Ecommerce, Designer, Frontend |
| Dirección visual y sistema fotográfico | Designer | UX, Frontend, SEO |
| ADR, límites y contratos | Software Architect | Backend, Frontend, SEO |
| Esquema, RLS, Wompi, inventario | Backend | Architect, Ecommerce |
| UI, Server Components y rendimiento | Frontend | UX, Designer, SEO |
| SEO técnico y datos estructurados | SEO Expert | Frontend, Architect |

## Formato de entrega de cada agente

- Objetivo cubierto.
- Evidencia consultada o pruebas ejecutadas.
- Hallazgos ordenados por impacto.
- Recomendación concreta.
- Riesgos y casos límite.
- Decisiones que necesita del propietario.
- Archivos que creó o modificó.

## Política de conflictos

- UX decide claridad del flujo; Ecommerce decide impacto comercial; Designer decide expresión visual; Frontend decide viabilidad de presentación; Architect decide límites sistémicos; Backend decide integridad transaccional; SEO decide indexabilidad; Business Analyst escala el trade-off al propietario.
- Si velocidad y riqueza visual chocan, se conserva la intención creativa dentro del presupuesto de rendimiento; cualquier excepción se mide y registra.
- Si “menos clics” choca con información legal, selección de talla o prevención de errores, prevalece una compra informada y reversible.

