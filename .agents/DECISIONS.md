# Registro de decisiones

Actualizado: 2026-09-11, America/Bogota.

## Decisiones confirmadas

| ID | Decisión | Estado |
|---|---|---|
| D-001 | La aplicación web se desarrollará con Next.js. | Confirmada por el propietario |
| D-002 | Supabase será base de datos y backend; se contempla Storage para medios. | Confirmada por el propietario |
| D-003 | Wompi será la pasarela de pagos. | Confirmada por el propietario |
| D-004 | La experiencia será minimalista, mobile-first, photo-first y orientada a compra con pocos clics. | Confirmada por el propietario |
| D-005 | No se iniciará código de producto antes de aprobar el plan. | Confirmada por el propietario |
| D-006 | La primera operación se diseña para Colombia, español, COP y zona horaria America/Bogota. | Confirmada por el propietario |
| D-007 | Checkout como invitado; la cuenta será opcional y posterior a la compra. | Confirmada por el propietario |
| D-008 | Wompi Widget es la opción base porque conserva al comprador dentro del sitio; Checkout Web queda como fallback. | Propuesta; validar en spike técnico |
| D-009 | El catálogo V1 tendrá exactamente cuatro productos: dos camisetas y dos hoodies. | Confirmada por el propietario |
| D-010 | Referentes estructurales principales: Kith, Cole Buxton y One Half. | Confirmada por el propietario |
| D-011 | La home combinará video de entrada, tríptico de foto/video, módulo 360 y fotografía seguida por grid de los cuatro productos. | Confirmada por el propietario |
| D-012 | La PDP usará carrusel fotográfico y controles tipo toggle para talla y color. | Confirmada por el propietario |
| D-013 | Habrá un único pop-up comercial: captura de email y descuento del 10% para primera compra. | Confirmada por el propietario |
| D-014 | Para acelerar V1 se excluyen búsqueda, filtros, cuenta, wishlist, reviews y panel administrativo propio; la operación inicial usa Supabase. | Confirmada por el propietario |
| D-015 | `uniCommerce` es el nombre de trabajo. El dominio y la identidad final siguen pendientes y deben definirse antes de preview público o producción. | Confirmada como condición temporal por el propietario |
| D-016 | El propietario autorizó iniciar implementación el 2026-09-11 y ampliar el 2026-09-11 la construcción a catálogo, PDP, carrito, checkout, pedidos, Supabase y Wompi. Gate 1 queda aprobado para implementar; los datos y reglas operativas no se inventan. | Confirmada por el propietario |
| D-017 | Envíos, impuestos, facturación, políticas legales, cupón y correo transaccional se difieren por instrucción del propietario. Ninguno se inventará; bloquean checkout, Wompi y cualquier lanzamiento. | Confirmada como diferimiento por el propietario |
| D-018 | La implementación debe quedar lista para activar con migraciones y variables de entorno. Las reglas operativas ausentes se modelan como configuración requerida y bloquean el cobro hasta que un operador las defina. | Confirmada por el propietario |

## Gate 1 — decisiones necesarias antes de escribir la aplicación

- [x] Elegir referentes primarios y patrones de `REFERENCE_STORES.md`.
- [ ] Definir categoría y público inicial: mujer, hombre, unisex, activewear, streetwear u otra.
- [x] Confirmar si uniCommerce venderá una sola marca o será multimarca/marketplace. Será **una sola marca con inventario propio**.
- [x] Confirmar países de venta en MVP. Sólo Colombia.
- [ ] Definir transportadora, reglas de costo de envío, cobertura, tiempos y origen de despacho.
- [ ] Definir política de cambios, devoluciones, retracto, reversión y garantías con asesoría legal.
- [ ] Definir IVA/impuestos, obligación de facturación electrónica y proveedor de facturación con contador/asesor tributario.
- [x] Definir número de productos: cuatro, dos camisetas y dos hoodies. Faltan variantes y volumen esperado.
- [x] Ratificar que V1 no requiere panel administrativo propio; Supabase será la interfaz operativa inicial.
- [ ] Entregar activos iniciales: nombre final, logo, tipografías/licencias, paleta, fotografías de muestra y tono editorial.
- [ ] Definir herramienta de analítica/consentimiento o aprobar una fase inicial sin marketing tags.
- [ ] Definir reglas del cupón de bienvenida: duración, uso único, exclusiones, acumulación y mínimo de compra.
- [ ] Definir proveedor/dominio de email o aprobar que V1 muestre el cupón inmediatamente sin envío por correo.

## Gate 1 — criterio de aprobación

El propietario escribe una aprobación explícita del plan y responde los puntos que cambian arquitectura o alcance. Los puntos operativos aún desconocidos pueden quedar como hipótesis si tienen dueño y fecha de resolución.

**Veredicto (2026-09-11):** el propietario autorizó empezar mediante la instrucción `Start` y ampliar la construcción para dejar la aplicación lista para migración y configuración de entorno. Los puntos diferidos en D-017 siguen siendo bloqueadores de checkout, pagos, logística y lanzamiento; el código debe exigirlos, no suplirlos con supuestos.

## Decisiones técnicas posteriores

| Gate | Decisión | Momento |
|---|---|---|
| 2 | Proveedor de hosting, dominio, ambientes y región de Supabase. | Antes de infraestructura |
| 2 | Widget Wompi vs Checkout Web tras prueba sandbox y revisión de UX móvil. | Antes de checkout |
| 2 | Estrategia de reservas de inventario para pagos `PENDING`. | Antes del modelo de pedidos |
| 2 | Proveedor de envíos y facturación electrónica. | Antes de UAT operacional |
| 3 | Consent manager, analítica, email transaccional y monitoreo. | Antes de producción |
