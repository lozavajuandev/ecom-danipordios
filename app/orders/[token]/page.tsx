import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusRefresh } from "@/components/orders/order-status-refresh";
import { formatCop } from "@/lib/money";
import { getOrderByAccessToken } from "@/lib/orders/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedido",
  robots: { index: false, follow: false },
};

const statusCopy: Record<string, string> = {
  awaiting_payment: "Esperando confirmación de pago",
  paid: "Pago aprobado",
  payment_failed: "Pago no aprobado",
  manual_review: "Pago en verificación",
  processing: "Pedido en preparación",
  shipped: "Pedido enviado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
  refunded: "Pedido reembolsado",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { token } = await params;
  const { id: transactionId } = await searchParams;
  const order = await getOrderByAccessToken(token);
  if (!order) notFound();

  return (
    <main className="order-page">
      <header className="store-page__header"><Link className="wordmark wordmark--dark" href="/">uniCommerce</Link></header>
      <section className="order-page__content">
        <p className="utility-label">Pedido {order.number}</p>
        <h1>{statusCopy[order.status] ?? "Estado actualizado"}</h1>
        <p>La redirección de pago es informativa. El estado mostrado aquí procede del servidor después de verificar el evento de Wompi.</p>
        <OrderStatusRefresh token={token} transactionId={transactionId} />
        <div className="order-page__summary">
          {order.items.map((item) => (
            <p key={item.id}><span>{item.name} · {Object.values(item.options).join(" · ")} × {item.quantity}</span><span>{formatCop(item.unitPriceCents * item.quantity)}</span></p>
          ))}
          <p><span>Subtotal</span><span>{formatCop(order.subtotalCents)}</span></p>
          <p><span>Envío</span><span>{formatCop(order.shippingCents)}</span></p>
          <p><span>Impuestos</span><span>{formatCop(order.taxCents)}</span></p>
          <p className="order-page__total"><span>Total</span><span>{formatCop(order.totalCents)}</span></p>
        </div>
      </section>
    </main>
  );
}
