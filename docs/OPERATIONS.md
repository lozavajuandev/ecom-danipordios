# Operación y activación

## Orden de activación

1. Aplica la migración `supabase/migrations/202609110001_initial_commerce.sql` una sola vez en el proyecto Supabase de producción o sandbox correspondiente. Crea tablas, RLS, bucket `product-media`, funciones transaccionales e índices.
2. Configura las variables de `.env.example` en el proveedor de despliegue. `NEXT_PUBLIC_SITE_URL` debe ser la URL canónica HTTPS sin slash final; no hay dominio definido aún, por lo que el sitio se mantiene `noindex` hasta configurarlo.
3. Carga fotos finales en el bucket `product-media`, después registra productos, variantes activas, precios en centavos COP, medios con texto alternativo e inventario. El inventario numérico nunca se consulta desde el navegador; el storefront sólo recibe disponibilidad booleana.
4. Antes de habilitar cobro, define los ajustes y el método de envío aprobados por la operación. La migración inicia ambos ajustes con `configured: false` para impedir una activación accidental.
5. En Wompi registra el webhook `https://<dominio>/api/webhooks/wompi` para `transaction.updated`; usa el secreto de eventos, no el secreto de integridad. Programa `POST /api/internal/release-expired-reservations` con `Authorization: Bearer <CRON_SECRET>` cada pocos minutos.
6. En sandbox verifica por lo menos un pago aprobado, declinado, pendiente y un webhook repetido antes de usar llaves de producción.

## Configuración operativa requerida para cobrar

El siguiente bloque es una plantilla de forma, no datos que se deban copiar sin aprobarlos. Los valores de impuestos, cobertura, plazos y versión legal deben venir de la persona responsable de operación, contabilidad y legal.

```sql
update public.app_settings
set value = jsonb_build_object(
  'configured', true,
  'reservation_ttl_minutes', <entre_5_y_120>,
  'terms_version', '<version_aprobada>'
)
where key = 'checkout';

update public.app_settings
set value = jsonb_build_object(
  'configured', true,
  'tax_rate_basis_points', <tasa_aprobada_en_puntos_base>,
  'prices_include_tax', <true_o_false>
)
where key = 'tax';

insert into public.shipping_methods (
  name, active, flat_rate_cents, free_from_subtotal_cents,
  min_business_days, max_business_days, coverage
) values (
  '<nombre>', true, <valor_en_centavos_COP>, null,
  <min_dias>, <max_dias>,
  '{"countries":["CO"],"regions":["<departamento_opcional>"],"cities":["<ciudad_opcional>"]}'::jsonb
);
```

Si `coverage` contiene `countries`, `regions` o `cities`, el checkout exige una coincidencia exacta con los datos de la dirección. Omite una clave para no restringir por ese nivel. Mantén los nombres de departamento y ciudad normalizados de la misma forma que se los pedirá a clientes.

## Controles incorporados

- El cliente no decide precios, totales, disponibilidad, impuestos ni estados de pago.
- La bolsa usa un token opaco firmado en cookie `HttpOnly`; en la base se guarda solamente su hash.
- La orden toma snapshots de precio/variante, bloquea inventario durante la preparación y crea una reserva con vencimiento.
- Wompi se verifica por checksum de eventos; los eventos son idempotentes y la conciliación consulta la transacción desde el servidor.
- Un pago aprobado después de liberar o revisar una reserva queda en `manual_review`; no consume inventario automáticamente.
- Las llaves privadas se usan únicamente en código de servidor y no hay datos personales en fixtures ni en payloads de auditoría.

## Pendientes externos de lanzamiento

- Dominio canónico y DNS/HTTPS.
- Catálogo, fotografía, precios, stock, guía de medidas y textos alternativos reales.
- Aprobación de términos, tratamiento de datos, cambios/devoluciones, envío, impuestos y facturación aplicables.
- Credenciales Wompi de producción y validación de la cuenta comercial.

No hay una interfaz de administración en esta primera versión. La operación inicial carga los registros en Supabase con acceso administrativo restringido; el storefront solo puede leer el catálogo publicado.
