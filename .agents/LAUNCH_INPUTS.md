# Insumos necesarios para construir y desplegar V1

Entrega lo siguiente. Los secretos nunca deben pegarse en una conversación ni guardarse en Git; se configuran en `.env.local` y en el gestor seguro del hosting.

## A. Cinco respuestas que bloquean el inicio

- [ ] **Marca final:** nombre exacto y dominio deseado. ¿`uniCommerce` es nombre real o sólo nombre del proyecto?
- [ ] **Público/fit:** hombre, mujer o unisex; descripción de una frase del comprador objetivo.
- [ ] **Operación:** confirmar Colombia, español y COP; ciudad/bodega de origen.
- [ ] **Alcance:** confirmar V1 lean sin panel admin propio, búsqueda, filtros, cuenta, wishlist ni reviews.
- [ ] **Hosting/dominio:** proveedor/cuenta donde se desplegará y acceso al DNS del dominio.

## B. Identidad de marca

- [ ] Logo principal en SVG y variantes claro/oscuro.
- [ ] Isotipo/favicon SVG o PNG de alta resolución.
- [ ] Paleta y tipografías con archivos/licencias; o autorización para proponerlas.
- [ ] Tagline de home y manifiesto/About de 80–150 palabras.
- [ ] Tono: palabras que sí/no usa la marca.
- [ ] Instagram/TikTok, WhatsApp o email de servicio al cliente.

## C. Datos de los cuatro productos

Una fila por producto y una fila por variante:

- [ ] Nombre comercial y categoría (`t-shirt` o `hoodie`).
- [ ] Descripción corta y detalle de diseño.
- [ ] Precio normal en COP y precio anterior, si existe.
- [ ] Colores y nombres exactos de color.
- [ ] Tallas disponibles y guía de medidas por talla.
- [ ] Stock inicial de cada combinación talla/color.
- [ ] SKU único por variante.
- [ ] Material/composición, peso de tela si aplica, fit y cuidados.
- [ ] Altura del modelo y talla usada en fotos.
- [ ] Peso y dimensiones empacadas si afectan el envío.
- [ ] Producto/look que será protagonista en home y en el giro 360.

Plantilla sugerida de variante: `Producto | SKU | Color | Talla | Precio COP | Stock | Peso`.

## D. Fotografía y video

### Por cada producto — mínimo

- [ ] 6 fotografías verticales 4:5, master JPEG/TIFF de al menos 2400 px de alto: portada, frente, espalda, lateral/movimiento, detalle y fit.
- [ ] Una toma consistente de catálogo para que los cuatro productos compartan grid.
- [ ] Derechos de uso web/comercial confirmados y nombres de créditos si aplican.

### Home

- [ ] Hero video desktop 16:9, 6–12 s, loop limpio, sin audio obligatorio ni texto incrustado.
- [ ] Hero video móvil 9:16 o 4:5 con encuadre propio; no reutilizar un crop que corte producto/cabeza.
- [ ] Poster frame para cada video.
- [ ] Tríptico: dos fotos y un video vertical, o indicar la combinación exacta deseada.
- [ ] Un video 360 del look/modelo, 6–10 s, fondo y luz consistentes; idealmente versión 4:5.
- [ ] Opcional ideal: video corto 4:5 de caída/movimiento por producto.

Se pueden entregar masters pesados; el build generará derivados WebP/AVIF/MP4 optimizados. Evitar logos/texto horneados dentro del material para permitir responsive.

## E. Descuento y captura de email

- [ ] Texto del pop-up: título, subtítulo, CTA y mensaje de éxito; o autorización para redactarlo.
- [ ] Nombre del código, o aprobar `WELCOME10` como placeholder.
- [ ] Vigencia desde la captura: 7, 15, 30 días o sin vencimiento.
- [ ] ¿Uso único por email? Recomendado: sí.
- [ ] ¿Aplica a los cuatro productos y se puede acumular? Recomendado: todos, no acumulable.
- [ ] ¿Descuenta sólo productos o también envío? Recomendado: sólo productos.
- [ ] Periodo para no mostrar de nuevo el pop-up tras cerrarlo. Recomendado: 30 días.
- [ ] Proveedor de email y dominio remitente si el código también se enviará; de lo contrario se mostrará inmediatamente en pantalla.
- [ ] Texto/aceptación de marketing y política de privacidad revisados.

## F. Envíos, cambios y legales

- [ ] Cobertura: nacional completa o ciudades/zonas específicas.
- [ ] Tarifa plana, tabla por ciudad o envío gratis desde cierto subtotal.
- [ ] Tiempo de preparación y promesa de entrega.
- [ ] Transportadora y proceso para obtener/registrar guía; puede ser manual en V1.
- [ ] Política de cambios, devoluciones, garantía, retracto y reversión.
- [ ] Razón social/nombre del responsable, NIT, dirección y canales de contacto que deban publicarse.
- [ ] Definición de IVA/precio incluido y obligación/proveedor de factura electrónica validada por contador.
- [ ] Términos, privacidad y tratamiento de datos revisados por asesor competente.

## G. Cuentas e integraciones

- [ ] Proyecto Supabase de desarrollo/producción o autorización para crearlo.
- [ ] Comercio Wompi habilitado y llaves **sandbox** para integración; producción sólo al pasar UAT.
- [ ] Secreto de integridad y secreto/firma de eventos Wompi configurados de forma segura.
- [ ] Cuenta/proyecto de hosting y dominio.
- [ ] Servicio de email transaccional y dominio verificado, si se enviarán pedido/cupón por correo.
- [ ] Email donde deben llegar avisos operativos de pedidos/fallos.
- [ ] Analítica: aprobar medición mínima sin marketing tags o indicar proveedor y consentimiento.

## H. Criterio para empezar y para publicar

### Puedo empezar implementación cuando tenga

1. Las cinco respuestas de A.
2. Datos completos de los cuatro productos, aunque el stock sea provisional.
3. Logo y al menos material de muestra para fijar la dirección.
4. Reglas de descuento/envío suficientemente definidas.
5. Aprobación explícita del Gate 1.

### Puedo desplegar preview cuando tenga

- contenido visual suficiente para home y una PDP completa;
- Supabase y Wompi sandbox;
- cuenta de hosting;
- textos legales provisionales claramente marcados como pendientes, si aún no son finales.

### Puedo publicar producción cuando tenga

- todos los assets finales y stock;
- Wompi producción y webhook verificado;
- dominio/DNS y email transaccional;
- políticas/legal/facturación aprobadas;
- prueba de compra sandbox y producción controlada;
- UAT móvil/desktop, accesibilidad, SEO, rendimiento, monitoreo y rollback aprobados.

