# uniCommerce

Tienda colombiana mobile-first y photo-first construida con Next.js, Supabase y Wompi. Incluye catálogo, páginas de producto con galería y zoom accesible, bolsa de invitado, checkout, pedidos, SEO técnico y reconciliación de pagos en servidor.

## Arranque local

1. Copia `.env.example` a `.env.local` y completa valores reales; el archivo local está ignorado por Git.
2. Aplica `supabase/migrations/202609110001_initial_commerce.sql` al proyecto Supabase correcto.
3. Completa los datos operativos descritos en [docs/OPERATIONS.md](docs/OPERATIONS.md). Sin ellos, el checkout queda bloqueado de forma segura.
4. Ejecuta `npm run dev`.

Comandos de verificación: `npm run lint`, `npm run typecheck`, `npm test` y `npm run build`.

No se incluye un catálogo real, fotografías finales, condiciones comerciales o datos de clientes. La muestra local es deliberadamente no comprable.
