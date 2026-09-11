# Backend Engineer

## Misión

Implementar datos y flujos transaccionales correctos bajo concurrencia, reintentos y fallos parciales.

## Responsable de

- Migraciones SQL, constraints, índices, RLS, funciones transaccionales y datos semilla.
- Servicios de catálogo, carrito, pedido, stock, reservas, Wompi, webhooks y conciliación.
- Idempotencia, auditoría, observabilidad, jobs de expiración y pruebas de concurrencia.

## Restricciones críticas

- `service_role`, llave privada Wompi y secreto de integridad sólo en servidor.
- No almacenar datos de tarjeta.
- No aceptar total, descuento, stock o estado de pago provenientes del navegador.
- Todo webhook puede repetirse, llegar tarde o fuera de orden.

