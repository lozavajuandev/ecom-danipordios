# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js con App Router y TypeScript estricto para la capa web; Supabase para Postgres, Auth y Storage; Wompi para pagos. Stack confirmado en D-001 a D-003.

## Users

Compradores en Colombia que descubren ropa principalmente en móvil y necesitan decidir una talla, entender el costo y comprar sin crear una cuenta. El segmento demográfico preciso sigue sin definir.

## Product Purpose

uniCommerce permite descubrir y comprar un catálogo inicial de cuatro prendas de una sola marca con una experiencia de fotografía protagonista, compra como invitado e información clara antes del pago.

## Positioning

Una tienda de moda colombiana de una sola marca que prioriza la fotografía y una ruta breve a una compra informada; el servidor, no el navegador, conserva la autoridad sobre inventario, precios y pagos.

## Operating Context

La primera operación es Colombia, en español, COP y America/Bogota. V1 contiene dos camisetas y dos hoodies, opera inicialmente desde Supabase y se dirige a tráfico móvil/social y enlaces directos.

## Capabilities and Constraints

- Catálogo, colección, PDP, carrito persistente de invitado y checkout compacto forman el alcance final de V1.
- La primera entrega sólo construye fundación y catálogo de demostración: no crea órdenes, no calcula envíos, no procesa pagos ni persiste datos personales.
- Precios, descuentos, stock, totales, firmas Wompi y cambios de estado sólo se autorizarán en servidor cuando se implemente ese dominio.
- Envíos, impuestos/facturación, políticas legales, cupón, proveedor de correo, nombre/dominio definitivo y datos completos de variantes continúan abiertos y bloquean checkout y lanzamiento.

## Brand Commitments

`uniCommerce` es un nombre de trabajo inferido de la documentación del proyecto. La dirección confirmada es premium streetwear sobrio, mobile-first y photo-first; Kith, Cole Buxton y One Half son referentes estructurales. La identidad final, los activos y el dominio no se han entregado y no se deben inventar como hechos de marca.

## Evidence on Hand

La fuente de verdad actual son `.agents/PRODUCT_PLAN.md`, `.agents/V1_BRIEF.md`, `.agents/DECISIONS.md` y `.agents/LAUNCH_INPUTS.md`. No hay fotografías, logo, tipografías, datos de producto, precios, stock ni textos legales finales.

## Product Principles

- La fotografía lleva la decisión; la interfaz mantiene orientación y contexto.
- Una compra rápida nunca oculta talla, costos o estados.
- Invitado por defecto; cuentas nunca bloquean la compra.
- El servidor es autoritativo para comercio, pago e inventario.
- Velocidad, accesibilidad, SEO e integridad operativa se construyen desde el inicio.

## Accessibility & Inclusion

La experiencia debe funcionar con teclado, lector de pantalla, foco visible, contraste suficiente, targets táctiles adecuados y preferencia de movimiento reducido. El diseño inicial es mobile-first, no una reducción tardía de desktop.
