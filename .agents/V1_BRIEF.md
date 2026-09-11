# Brief de experiencia V1

Actualizado: 2026-08-27.  
Estado: dirección aprobada; pendiente de insumos en `LAUNCH_INPUTS.md`.

## Catálogo

- Cuatro productos: dos camisetas y dos hoodies.
- Una sola grilla; sin búsqueda, filtros ni paginación.
- Variantes por talla y color según matriz de inventario entregada.
- Compra como invitado; sin cuenta, wishlist o reviews.

## Home

1. **Entrada:** portada inmersiva con video silencioso en loop, inspirada en la contundencia de Undergold y la mezcla editorial de Massimo Dutti. Debe tener poster optimizado, `playsinline`, alternativa para reduced motion y versión móvil específica.
2. **Tríptico:** tres paneles photo/video inspirados en One Half. Cada panel lleva a un producto o look; en móvil se convierte en secuencia horizontal accesible o stack según prototipo.
3. **Módulo 360:** un modelo/look gira una vuelta completa, inspirado en Entire Studios. Será video/sequence optimizado, no una librería 3D pesada.
4. **Editorial → commerce:** fotografía de campaña seguida inmediatamente por grid de los cuatro productos, patrón tomado de Jacquemus.
5. **Cierre:** manifiesto breve, envío/cambios/contacto y footer legal.

Kith y Cole Buxton definen el tono general: premium streetwear, sobrio, gran escala fotográfica, tipografía contenida y producto protagonista.

## Pop-up de bienvenida

- Es el único pop-up comercial del sitio.
- Aparece en la primera sesión después de que el contenido principal ya se haya pintado; no bloquea LCP.
- Solicita email, explica la finalidad y enlaza privacidad.
- Beneficio: 10% para primera compra.
- Éxito: muestra el código inmediatamente; opcionalmente también se envía por email.
- Cierre visible, `Escape`, foco atrapado/restaurado y compatible con lector de pantalla.
- Después de cerrar o registrarse, no reaparece durante el periodo que se defina.
- El cupón se valida en servidor por email/orden, vigencia y uso; Wompi recibe el total ya descontado y firmado.

## Ficha de producto

- Carrusel/gallery de 6–8 medios: portada, frente, espalda, lateral/movimiento, detalle, fit y video opcional.
- Título, precio en COP y descripción breve.
- Color y talla como controles toggle/segmented inspirados en Fear of God; agotados deshabilitados.
- Guía de tallas, composición, cuidados, datos del modelo y política de cambios en accordions discretos.
- CTA sticky móvil `Agregar al carrito`; feedback inmediato y carrito drawer.
- Recomendación final limitada a los otros tres productos.

## Compra

- Drawer de carrito: producto, variante, cantidad, subtotal, descuento y CTA.
- Checkout invitado compacto: email, teléfono, dirección, envío, resumen y consentimiento requerido.
- Wompi Widget sujeto a validación sandbox; redirección como fallback.
- Estados reales: pendiente, aprobado, rechazado/error y recuperación.
- Confirmación y seguimiento mediante enlace seguro.

## Navegación V1

- Logo/Home.
- Shop o Products (los cuatro productos).
- About, guía de tallas y contacto/políticas en menú/footer.
- Carrito siempre visible.

## Exclusiones conscientes

- Sin sliders hero múltiples, pop-up de país, chat, countdown o barras promocionales competidoras.
- Sin búsqueda, filtros, login, wishlist, reviews, blog, loyalty o custom admin.
- Sin 3D/WebGL si el giro puede resolverse con un video liviano y de mayor fidelidad.

## Criterios visuales de aceptación

- El producto/fotografía ocupa la mayor parte del viewport.
- El usuario entiende qué puede comprar y llegar a una PDP sin adivinar.
- Home y PDP conservan intención en móvil; no son una reducción tardía del desktop.
- Video no impide ver contenido en mala red ni a usuarios con reduced motion.
- Sólo una acción primaria por bloque.
- Sin layout shift visible cuando cargan medios, precio o controles.

