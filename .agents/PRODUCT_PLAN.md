# Plan de producto y ejecución — uniCommerce

Versión 0.1 — propuesta para revisión  
Fecha: 2026-08-26  
Estado: dirección visual y catálogo V1 definidos; faltan insumos operativos y aprobación final del Gate 1.

## 1. Resumen ejecutivo

uniCommerce será una tienda de moda mobile-first, photo-first y guest-checkout-first. La interfaz reducirá opciones simultáneas y llevará del descubrimiento al pago sin obligar a crear cuenta, sin ocultar información de talla/costos y sin convertir el minimalismo en ambigüedad.

La V1 tendrá cuatro productos —dos camisetas y dos hoodies—. La hipótesis restante es una sola marca con inventario propio, venta nacional en Colombia, idioma español y precios en COP. El stack fijado es Next.js para la experiencia web, Supabase para Postgres/Auth/Storage/backend y Wompi para pagos. Las hipótesis operativas deben ratificarse en el Gate 1.

### Resultado esperado del MVP

Un comprador puede:

1. Entrar desde home, categoría, campaña, buscador o enlace directo.
2. Entender el producto principalmente por fotografía y datos breves.
3. Elegir variante/talla con confianza.
4. Añadir al carrito o usar compra rápida.
5. Comprar como invitado, conocer el costo total antes de pagar y completar Wompi.
6. Recibir y consultar un pedido cuyo estado procede del servidor, no de la redirección del navegador.

Un operador puede:

1. Publicar productos, variantes, precio, inventario y fotografías.
2. Ver pedidos y estados de pago/envío.
3. Corregir contenido sin desplegar código.
4. Conciliar una transacción Wompi con un único pedido y auditar sus eventos.

## 2. Principios no negociables

- **La fotografía vende; la UI orienta.** Controles y texto son sobrios, pero siempre visibles y comprensibles.
- **Pocos pasos, no pocas certezas.** Talla, precio total, envío, cambios y errores conservan el contexto necesario.
- **Invitado por defecto.** Crear cuenta nunca bloquea la compra; se ofrece después o como beneficio claro.
- **Servidor autoritativo.** Precio, promoción, stock, envío, firma y pago se calculan/verifican en servidor.
- **Velocidad por presupuesto.** No se añade una librería, tag, video o animación sin medir su costo.
- **Accesible por construcción.** Teclado, lector de pantalla, foco, contraste, targets y motion reducido entran desde wireframes.
- **Operable.** Cada estado visible tiene una acción operativa, un dueño y una ruta de recuperación.
- **Privacidad mínima.** Se recolecta sólo lo necesario para compra, entrega, facturación y consentimiento explícito.

## 3. Público e hipótesis que deben validarse

El público exacto no fue definido. El diseño no debe cerrarse hasta elegir al menos:

- segmento (edad no basta: ocasión, estilo, precio y comportamiento);
- categoría (streetwear, activewear, essentials, diseñador, etc.);
- género/fit (mujer, hombre, unisex o mezcla);
- rango de precio y ticket promedio objetivo;
- catálogo inicial, frecuencia de drops y profundidad de inventario;
- ciudades principales, promesa de entrega y política de cambios.

### Preguntas de investigación inicial

- ¿El tráfico llegará sobre todo de Instagram/TikTok, búsqueda orgánica, pauta o clientes existentes?
- ¿El usuario compra una pieza individual o arma looks/conjuntos?
- ¿Qué genera mayor duda: talla, tela, color real, largo, envío, reputación o medios de pago?
- ¿Qué porcentaje se espera en móvil y en redes embebidas?
- ¿Hay alta demanda por lanzamientos con riesgo de concurrencia/agotados?

## 4. Alcance

### V1 lean — incluido

- Home editorial/comercial.
- Catálogo general y colecciones curadas.
- Grid completo de cuatro productos; no requiere búsqueda ni filtros en V1.
- Ficha de producto con galería, variantes, talla, fit, stock y políticas resumidas.
- Quick add sólo cuando la variante pueda elegirse sin confusión.
- Carrito persistente de invitado y drawer con checkout directo.
- Checkout de una página o acordeón corto: contacto, entrega, resumen y pago.
- Wompi Widget como primera opción sujeta a spike; Checkout Web como fallback.
- Estado de pago/pedido, emails transaccionales y consulta por enlace seguro.
- Operación inicial de catálogo, inventario y pedidos desde Supabase; panel propio se difiere salvo ratificación contraria.
- Supabase RLS, auditoría básica, webhooks idempotentes y reconciliación.
- SEO técnico, datos estructurados, sitemaps, Open Graph e imágenes indexables.
- Analítica del funnel sin PII, monitoreo de errores y Core Web Vitals.
- Páginas legales/operativas: contacto, envíos, cambios/devoluciones, privacidad, términos, retracto/reversión según validación legal.

### Después de V1

- Cuenta de cliente, wishlist, historial, recompra, búsqueda y filtros.
- Panel administrativo propio para catálogo, inventario y pedidos.
- Reviews verificadas, loyalty, gift cards, bundles y recomendaciones.
- Multiidioma/multimoneda/venta internacional.
- Marketplace, múltiples vendedores o split payments.
- POS/tiendas físicas, pickup, transportadoras múltiples y cambios autoservicio.
- Personalización, visual search, IA, livestream shopping o app nativa.

### Fuera de alcance por defecto

- Almacenar o procesar datos de tarjeta.
- Motor propio de pagos.
- ERP/WMS completo.
- Constructor visual generalista.
- Marketplace multimarca: cambia pagos, impuestos, fulfillment y modelo de datos; requiere replantear el plan.

## 5. Arquitectura de información y rutas

| Ruta conceptual | Objetivo | Render recomendado |
|---|---|---|
| `/` | campaña principal, nuevos, categorías y prueba de marca | estático/cacheado con revalidación |
| `/shop` | todos los productos | server-rendered y cacheable por filtros canónicos |
| `/collections/[slug]` | landing indexable de colección | server-rendered/cacheado |
| `/products/[slug]` | decisión de compra | server-rendered; precio/stock actualizados con política explícita |
| `/search` | intención concreta | dinámico; política SEO controlada |
| `/cart` | fallback accesible al drawer | dinámico por carrito |
| `/checkout` | datos y confirmación previa a Wompi | dinámico, no indexable |
| `/orders/[token]` | resultado/seguimiento seguro | dinámico, no indexable |
| `/admin/*` | operación | autenticado, no indexable |
| `/policies/*` | confianza y cumplimiento | estático/indexable según contenido |

La URL de producto debe ser estable y compartible. Color/talla seleccionados pueden expresarse con query params sólo si la estrategia de variantes/canonical evita duplicación.

## 6. Flujo UX y presupuesto de clics

### Camino estándar desde home

1. Tap en producto o colección.
2. Seleccionar talla/variante y `Agregar`.
3. `Comprar ahora` en drawer.
4. Completar/confirmar contacto y entrega en una vista compacta.
5. Abrir/completar Wompi.

Objetivo: **máximo tres acciones principales desde una PDP con talla ya elegida hasta abrir Wompi** (`Agregar` → `Finalizar compra` → `Pagar`), sin contar escritura ni acciones dentro de la interfaz segura de Wompi.

### Camino rápido desde listado

1. `Agregar rápido` abre selector de talla inline/bottom sheet.
2. Elegir talla agrega y abre drawer.
3. `Finalizar compra`.

Quick add no aparece para productos que requieren explicar personalización, bundle o talla compleja.

### Reglas de interacción

- Una acción primaria por pantalla/contenedor; acciones secundarias como texto.
- Carrito abre sin navegación forzada y conserva scroll.
- CTA móvil de PDP puede ser sticky, sin tapar contenido ni mensajes.
- Guía de tallas abre en contexto; incluye medidas de prenda, modelo y cómo medir.
- Variante agotada se ve deshabilitada y explica la causa; no se descubre al pagar.
- Errores se muestran junto al campo, anuncian a tecnologías asistivas y no borran datos.
- Back conserva filtros, scroll y selección cuando sea técnicamente seguro.
- No habrá modal de país, chat ni promociones competidoras. La única excepción es el pop-up de bienvenida solicitado: email + 10% para primera compra. Se carga después de pintar el contenido principal, es descartable, accesible y no reaparece en cada navegación.
- Consentimiento de marketing separado de la compra y desmarcado por defecto salvo base jurídica confirmada.

### Estados obligatorios de diseño

- loading/skeleton sin CLS;
- vacío (búsqueda, colección, carrito);
- sin stock por producto y por variante;
- precio cambiado o stock perdido entre carrito y checkout;
- cupón inválido/expirado/no aplicable;
- envío no disponible;
- Wompi `PENDING`, `APPROVED`, `DECLINED`, `VOIDED`, `ERROR`;
- webhook retrasado, redirección sin transacción y reintento seguro;
- offline/timeout y recuperación sin duplicar pedido;
- pedido aprobado con notificación/email temporalmente fallido.

## 7. Dirección photo-first

### Jerarquía visual

- Home: 70–85% del primer viewport puede ser fotografía/campaña; CTA y navegación mantienen contraste.
- PLP: grid con imagen dominante y nombre/precio/tallas disponibles en jerarquía silenciosa.
- PDP móvil: primera imagen, identidad/precio, variante y CTA visibles pronto; galería vertical o swipe accesible.
- Desktop: galería generosa y panel de compra sticky; evitar carruseles que oculten la segunda foto.

### Shot list mínimo por producto

1. Portada limpia, encuadre consistente.
2. Cuerpo completo/frente.
3. Espalda.
4. Perfil o movimiento.
5. Detalle de textura/confección.
6. Referencia de escala y fit; altura del modelo y talla usada.
7. Color real en iluminación controlada.
8. Video corto opcional sólo si agrega información de caída/movimiento.

### Pipeline de medios

- Guardar master de alta resolución y derivados; nunca subir sólo una captura social comprimida.
- Definir relaciones 4:5 para producto/editorial móvil, 3:4 o 2:3 para catálogo y recortes de campaña; conservar safe areas.
- Nombre/metadata por producto, color, orden, tipo de toma y alt text.
- `next/image` o servicio compatible para `srcset`, `sizes`, formatos modernos y dimensiones explícitas.
- La imagen LCP se precarga/eager; imágenes fuera de viewport son lazy.
- Placeholder de baja calidad o color dominante sin alterar relación de aspecto.
- El contenido textual esencial y el JSON-LD no dependen de reconocer texto dentro de imágenes.

### Presupuesto inicial de imagen

- Hero/LCP móvil: objetivo ≤ 250 KB en formato moderno para viewport típico.
- Thumbnail de PLP: objetivo ≤ 120 KB por variante servida, con `sizes` correcto.
- Ningún video autoplay forma parte del LCP; poster optimizado y reproducción por intención.
- Estos valores son presupuestos de diseño, no límites ciegos: se validan con fotografía real y dispositivos de gama media.

## 8. Arquitectura técnica propuesta

### Next.js

- App Router y TypeScript estricto; fijar versión estable concreta al iniciar y registrar ADR.
- Server Components por defecto para catálogo, PDP, metadata y contenido legal.
- Client Components acotados a galería, selector de variante, carrito, formularios y Wompi.
- Route Handlers/Server Actions como boundary; toda mutación revalida autorización y datos.
- Caché/revalidación por dominio: contenido de colección largo; producto medio; stock/precio con invalidación dirigida.
- Carga diferida del script de Wompi al iniciar pago, no en todas las rutas.
- Fuentes locales/subset y cero tags de marketing bloqueantes.

### Supabase

- Postgres como fuente de verdad; migrations versionadas y datos semilla no sensibles.
- Supabase Storage para medios, con buckets/policies separados para público y admin.
- Auth para administradores desde MVP; cuenta de comprador opcional/post-MVP.
- RLS habilitada en todas las tablas expuestas. Navegador recibe sólo publishable key.
- `service_role`/secret key sólo en servidor y sólo donde RLS no sea el boundary apropiado.
- RPC/funciones transaccionales para crear pedido, reservar stock, confirmar/revertir reserva y aplicar webhook.

### Carrito invitado

- Cookie opaca, firmada, `HttpOnly`, `Secure`, `SameSite=Lax`; no incluir email, dirección ni precio.
- Los ítems persistidos referencian variante y cantidad. La vista recupera precio/stock actuales.
- Al checkout, servidor recalcula subtotal, descuentos, envío, impuestos y total; si cambian, exige confirmación visible.
- Expiración y limpieza definidas; merge con cuenta futura será una función posterior.

### Wompi

- Spike compara Widget (permanece en sitio) y Checkout Web (fallback robusto).
- Antes de abrir Wompi: servidor crea `order`/`payment_attempt`, genera referencia única y firma de integridad con secretos de servidor.
- El monto Wompi usa centavos. Para COP, `$100.000` se envía como `10.000.000` en `amount_in_cents`.
- La URL de redirección sirve para UX, nunca confirma pago.
- Webhook HTTPS verificado según firma/checksum oficial, almacenado de forma idempotente y procesado de manera reintentable.
- Estados aceptados: `PENDING`, `APPROVED`, `DECLINED`, `VOIDED`, `ERROR`; mapearlos a estados internos sin perder el original.
- Reconciliación activa por ID de transacción cubre webhook atrasado o dudoso.
- Sandbox y producción tienen llaves, URLs de eventos y datos separados.

### Flujo autoritativo de pago

```text
Cliente confirma checkout
        ↓
Servidor recalcula total + valida/reserva stock
        ↓
Crea order(draft) + payment_attempt(pending) + referencia única
        ↓
Genera firma Wompi y abre Widget/Checkout
        ↓
Wompi procesa ──→ redirección (sólo estado provisional para UI)
        ↓
Webhook verificado/idempotente
        ↓
Transacción DB: payment + order + inventario/outbox
        ↓
Página de pedido consulta estado real y notificación se envía con reintento
```

### Inventario y concurrencia

- `available = on_hand - reserved`; nunca confiar en stock mostrado minutos antes.
- Crear reserva transaccional al confirmar checkout, con expiración y un identificador por intento.
- Definir TTL y extensión para métodos asíncronos Wompi antes de construir; no liberar ciegamente un pago `PENDING`.
- Aprobación consume la reserva una sola vez. Decline/error/expiración la libera una sola vez.
- Constraints evitan inventario negativo; prueba concurrente intenta comprar la última unidad desde varias sesiones.
- Si pago llega aprobado después de expirar la reserva, usar una cola de excepción operativa; no ocultar el caso.

### Notificaciones y side effects

- Transacción principal escribe un evento/outbox; email/factura/fulfillment se procesan con reintentos.
- Fallar el email no revierte un pago aprobado.
- Cada side effect tiene idempotency key y estado auditable.

## 9. Modelo de datos inicial

Todos los IDs son UUID/identificadores no predecibles donde salen al cliente; timestamps en UTC y presentación en America/Bogota.

| Entidad | Campos/invariantes principales |
|---|---|
| `products` | slug único, nombre, descripción, estado draft/active/archived, SEO, publicación |
| `product_variants` | SKU único, producto, talla/color/opciones, precio en centavos, compare-at opcional, activo |
| `product_media` | producto/variante, storage key, tipo, dimensiones, alt, posición, focal point |
| `collections` | slug, nombre, editorial, estado, SEO |
| `collection_products` | colección, producto, posición; unique compuesto |
| `inventory_levels` | variante, `on_hand`, `reserved`, versión; no negativos |
| `inventory_reservations` | carrito/pedido, variante, cantidad, estado, expiración, idempotency key |
| `carts` | token hash, moneda, expiración, timestamps |
| `cart_items` | carrito, variante, cantidad; unique carrito+variante |
| `orders` | número público no secuencial sensible, estado, moneda, totales snapshot, contacto, dirección snapshot |
| `order_items` | producto/variante snapshot, SKU, nombre, opciones, precio, impuesto, cantidad |
| `payment_attempts` | order, proveedor, referencia única, monto, estado interno/proveedor, transaction_id |
| `payment_events` | event/transaction key única, payload mínimo/seguro, firma válida, procesado, error |
| `shipments` | order, estado, carrier, tracking, timestamps |
| `admin_profiles` | auth user, rol, estado; RLS/RBAC |
| `audit_log` | actor, acción, entidad, before/after limitado, timestamp; sin secretos |
| `outbox_events` | tipo, aggregate, payload mínimo, estado, intentos, próximo intento |

### Invariantes de dinero

- Enteros en unidad menor; nunca `float`.
- Moneda explícita aunque MVP sea COP.
- `order_items` conserva snapshot; una edición posterior del producto no reescribe pedidos.
- Total = subtotal − descuentos + envío + impuestos, con reglas y redondeo documentados.
- Monto firmado, monto Wompi y total del pedido deben coincidir antes de aprobar internamente.

### Estados internos propuestos

- Pedido: `draft → awaiting_payment → paid → processing → shipped → delivered`.
- Salidas: `payment_failed`, `cancelled`, `refunded`, `partially_refunded`, `manual_review`.
- Pago: `created → pending → approved | declined | voided | error`.
- Envío: `unfulfilled → preparing → shipped → delivered | returned`.

No mezclar estado comercial del pedido con estado técnico del pago.

## 10. Operación V1 y panel posterior

### Incluido en V1 mediante Supabase y runbooks

- Carga controlada de cuatro productos, variantes, media y stock mediante migración/seed y Supabase.
- Ajustes de inventario con motivo y auditoría mediante procedimientos documentados.
- Consulta restringida de pedidos, pagos y eventos.
- Registro manual inicial de fulfillment/tracking.
- Vistas/consultas de excepciones: webhook inválido, pago sin pedido, pago tardío y stock inconsistente.

### Panel propio propuesto para V1.1

- Login admin y roles `catalog_manager`, `order_manager`, `admin`.
- Formularios de producto/variantes/media, stock, pedidos y tracking.
- Se mantienen fuera un editor WYSIWYG complejo, BI completo, devolución automatizada, permisos por campo y multi-bodega.

## 11. Rendimiento y fiabilidad

### SLO y Core Web Vitals

Medir p75 real por tipo de página y dispositivo:

- LCP ≤ 2.5 s (objetivo interno ≤ 2.0 s en páginas insignia).
- INP ≤ 200 ms.
- CLS ≤ 0.1.
- TTFB p75 objetivo ≤ 800 ms para tráfico colombiano.
- Error rate de creación de pedido/pago < 0.5% excluyendo rechazos legítimos del medio de pago.
- Procesamiento de webhook: respuesta rápida 2xx tras validación/persistencia; side effects fuera de la ruta crítica.

### Presupuestos iniciales

- JavaScript inicial propio + terceros por ruta pública: objetivo ≤ 150 KB gzip; PDP/PLP se revisan por separado.
- CSS crítico pequeño, fuentes con subset y máximo dos familias iniciales.
- Cero script Wompi antes de intención de pago.
- Cero carrusel pesado o librería de animación sin justificación y medición.
- Home y PLP no hacen waterfall cliente para recuperar contenido esencial.

### Estrategia de carga

- HTML/RSC temprano, streaming para partes lentas, queries paralelas.
- CDN/cache de imágenes y contenido público; invalidación por tags/eventos al publicar o cambiar stock crítico.
- `width`/`height` o aspect ratio siempre; preload sólo LCP real.
- Skeletons con tamaño final; nunca spinner que refluye toda la vista.
- Prueba en conexión móvil y dispositivo de gama media, no sólo Lighthouse local.

### Observabilidad

- Logs estructurados con request/order/reference IDs; email/teléfono redactados.
- Métricas: latencia/error por ruta, DB, Wompi, webhook lag, reservas expiradas y stock exceptions.
- Alertas: webhooks inválidos o estancados, pagos aprobados sin pedido, inventario negativo, error rate, degradación de CWV.
- Runbooks para Wompi caído, Supabase degradado, reconciliación y rollback.

## 12. SEO

### Base técnica

- HTML inicial con nombre, descripción, precio, disponibilidad e imágenes clave.
- Metadata única, canonical, hreflang sólo cuando existan mercados reales.
- Sitemap index: productos, colecciones, páginas y opcional imágenes; excluir admin, cart, checkout, búsqueda interna y URLs de sesión.
- Robots coherente, 404/410/redirects para productos retirados y regla para agotados temporales.
- Breadcrumbs visibles y estructurados; enlazado home → colección → producto.

### Datos estructurados

- `Organization` y políticas de envío/devolución cuando estén confirmadas.
- `Product`/`ProductGroup`, `Offer`, variantes, SKU, brand, color, size, material, precio, COP, disponibilidad y URL.
- `BreadcrumbList`; `VideoObject` sólo si existe video principal adecuado.
- JSON-LD coincide exactamente con contenido visible/DB; nunca inventar rating/review.
- Validar con Rich Results y monitorizar Merchant listings/Product snippets en Search Console.

### Facetas y variantes

- Sólo indexar combinaciones con demanda y contenido útil.
- Filtros arbitrarios usan canonical/control de crawling para evitar explosión de URLs.
- Decidir si color tiene URL propia según fotografía, demanda y stock; talla normalmente no crea página indexable.
- Producto agotado temporal permanece con alternativas y disponibilidad correcta; retirado definitivo redirige sólo si hay sustituto equivalente.

### SEO de imágenes

- Nombres descriptivos, alt contextual en español, URLs estables y crawlables.
- Varias relaciones de aspecto de alta resolución para producto/merchant listing.
- La fotografía editorial puede tener caption/contexto; alt no se usa para keyword stuffing.

## 13. Analítica y KPIs

### Eventos mínimos

- `view_item_list`, `select_item`, `view_item`;
- `select_variant`, `open_size_guide`, `add_to_cart`, `remove_from_cart`;
- `view_cart`, `begin_checkout`, `add_shipping_info`;
- `payment_opened`, `payment_pending`, `purchase`, `payment_failed`;
- `search`, `filter`, `no_results`.

IDs de producto/variante, valor y moneda son permitidos; no enviar email, teléfono, dirección, documento ni payload Wompi a analítica.

### KPIs de producto

- Conversión compra/sesión y por fuente/dispositivo.
- PDP → add-to-cart; cart → checkout; checkout → approved.
- Tiempo/acciones desde PDP hasta pago.
- Error y abandono por campo/paso.
- Búsquedas sin resultado, filtros usados y agotados vistos.
- Ticket promedio, unidades/pedido, descuento, margen y devolución/cambio.
- CWV p75 por plantilla y tasa de error Wompi técnico vs rechazo.

No fijar metas numéricas de conversión sin baseline o benchmark comparable; medir dos semanas/volumen suficiente y definirlas después.

## 14. Seguridad, privacidad y cumplimiento

### Controles técnicos

- CSP, HSTS, headers, cookies seguras, CSRF/origin checks donde apliquen y rate limit en endpoints sensibles.
- Validación server-side con esquemas compartidos; autorización en cada Server Action/Route Handler.
- RLS probada con roles anon, customer futuro y admin.
- Secret scanning, dependabot/auditoría, backups/PITR según plan de Supabase y restauración ensayada.
- Webhook Wompi: verificar firma/checksum, monto, moneda, referencia y transaction ID; idempotencia y protección contra replay.
- No almacenar PAN, CVV ni tokens fuera del modelo autorizado por Wompi.
- Minimizar retención de payloads y PII; redactar logs y definir borrado/anonimización.

### Colombia — revisión profesional obligatoria

El diseño debe soportar, sujeto a asesoría legal/contable:

- identidad/contacto del proveedor;
- características, disponibilidad, precio total en COP, impuestos, envío, forma y fecha de entrega;
- resumen de compra antes de finalizar;
- términos, privacidad y autorización de tratamiento de datos;
- políticas de cambios, garantías, retracto y reversión del pago;
- facturación electrónica cuando el negocio esté obligado.

La documentación técnica no sustituye asesoría legal ni tributaria.

## 15. Pruebas y definición de terminado

### Unitarias

- dinero, redondeo, descuentos, envío e impuestos;
- máquina de estados de pedido/pago/reserva;
- creación/verificación de referencias y firmas sin snapshots de secretos;
- selección de variantes, reglas de stock y mapeo de SEO.

### Integración

- migraciones fresh y rollback/forward seguro;
- RLS por tabla/rol;
- crear pedido recalculando servidor;
- webhook válido, inválido, duplicado, tardío y fuera de orden;
- reserva/consumo/liberación atómica y última unidad concurrente;
- reintento de outbox sin duplicar email/factura/fulfillment.

### E2E

- invitado: home/PLP → PDP → talla → carrito → checkout → Wompi sandbox → resultado;
- quick add, carrito persistente, cambio de precio/stock y recuperación de error;
- navegación teclado, mobile viewport y back;
- operación: producto/stock seed, consulta segura de pedido y registro manual de tracking.

### Calidad visual/accesible

- screenshots aprobados en móvil pequeño, móvil grande, tablet y desktop;
- zoom 200%, contraste, focus visible, reduce motion, lector de pantalla smoke test;
- axe sin violaciones serias/críticas; auditoría humana para flujo principal.

### Rendimiento/SEO

- Lighthouse CI como señal de regresión, CWV real al salir;
- bundle analysis y presupuestos;
- Rich Results, HTML sin JS, sitemap/robots/canonical y enlaces rotos.

### Definition of Done por feature

- aceptación funcional + estados negativos;
- pruebas proporcionales al riesgo;
- analytics y observabilidad;
- accesibilidad y responsive;
- seguridad/privacidad;
- documentación operacional;
- sin regresión de presupuesto de rendimiento.

## 16. Roadmap estimado

Estimación orientativa para un equipo pequeño con decisiones y activos disponibles. No es compromiso contractual.

| Fase | Resultado | Duración orientativa | Gate |
|---|---|---:|---|
| 0. Descubrimiento | público, referentes, operación, KPIs y alcance | 3–5 días | Gate 1 |
| 1. Diseño técnico/UX | wireframes, prototype, ADR, schema, Wompi spike, art direction | 5–8 días | Gate 2 |
| 2. Fundación | Next.js, ambientes, Supabase, migraciones, auth admin, CI | 3–5 días | — |
| 3. Catálogo photo-first | home, grid de 4, PDP, media y operación Supabase | 6–9 días | — |
| 4. Compra | carrito, checkout, stock, Wompi, webhook, pedido, email | 8–12 días | — |
| 5. Operación/descubrimiento | runbooks de pedidos, SEO, analytics, legales, excepciones | 4–7 días | Gate 3 |
| 6. Hardening | E2E, concurrencia, a11y, performance, UAT, runbooks | 5–8 días | Gate 4 |
| 7. Lanzamiento | producción, smoke, monitoreo y rollback | 1–2 días | Gate 5 |

Rango total típico: 6–9 semanas. Se alarga si el MVP es multimarca, internacional, integra ERP/transportadora/facturación compleja o si fotografía/contenido no están listos.

## 17. Backlog inicial por prioridad

### P0 — bloquea venta

- Decisiones Gate 1, content model y dirección visual.
- Catálogo/variantes/media/stock.
- PDP, carrito invitado y checkout.
- Pedido snapshot, Wompi, webhook, idempotencia y reconciliación.
- Operación en Supabase, emails, políticas esenciales y observabilidad.
- Seguridad, a11y, SEO base, performance y UAT.

### P1 — mejora conversión/operación

- Quick add, guía de tallas avanzada, búsqueda afinada.
- Merchant Center, feed, recuperación de carrito con consentimiento.
- Cuenta post-compra, wishlist, tracking enriquecido.
- Promociones administrables y bundles simples.

### P2 — escala

- Internacionalización, multi-bodega, loyalty, reviews, personalización y automatización de devoluciones.

## 18. Riesgos principales y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Fotos pesadas dañan LCP | alto | pipeline, budgets, `sizes`, LCP prioritaria, QA con imágenes reales |
| “Pocos clics” oculta costos/talla | alto | pruebas UX, resumen siempre visible, errores en contexto |
| Webhook duplicado/tardío | crítico | firma, idempotencia, state machine, reconciliación |
| Overselling en drops | crítico | reserva transaccional, constraints, prueba concurrente, cola de excepción |
| Admin usando service role en cliente | crítico | boundary servidor, RLS/RBAC, secret scan |
| Catálogo dinámico rompe caché/SEO | medio/alto | estrategia por tags, invalidación y HTML inicial |
| Alcance marketplace no declarado | crítico | ratificar D-006/D-007 y modelo de negocio en Gate 1 |
| Legales/facturación tardíos | alto | responsable y proveedor definidos antes de Gate 3 |
| Terceros degradan INP | alto | load-on-intent, tag budget y monitoreo RUM |

## 19. Fuentes técnicas primarias consultadas

- [Next.js — production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Supabase — Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase — Auth y RLS](https://supabase.com/docs/guides/auth)
- [Supabase — Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Wompi — Widget & Checkout Web](https://docs.wompi.co/docs/colombia/widget-checkout-web/)
- [Wompi — Transacciones](https://docs.wompi.co/docs/colombia/transacciones/)
- [Wompi — Eventos/webhooks](https://docs.wompi.co/docs/colombia/eventos/)
- [Google Search — structured data ecommerce](https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce)
- [Google Search — merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [SIC — reversión del pago](https://sedeelectronica.sic.gov.co/atencion-y-servicios-a-la-ciudadania/glosario/reversion-del-pago)
- [DIAN — requisitos de facturación electrónica](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/que-requieres-para-factura-electronicamente/)
