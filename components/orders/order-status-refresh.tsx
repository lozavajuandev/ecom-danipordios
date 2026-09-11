"use client";

import { useState } from "react";

export function OrderStatusRefresh({ token, transactionId }: { token: string; transactionId?: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!transactionId) return null;

  return (
    <div className="order-refresh">
      <button
        type="button"
        onClick={async () => {
          setPending(true);
          setMessage(null);
          try {
            const response = await fetch(`/api/orders/${token}/reconcile?transaction_id=${encodeURIComponent(transactionId)}`, { method: "POST" });
            const body = (await response.json()) as { message?: string };
            if (!response.ok) throw new Error(body.message ?? "No fue posible consultar Wompi.");
            window.location.reload();
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "No fue posible actualizar el estado.");
          } finally {
            setPending(false);
          }
        }}
        disabled={pending}
      >
        {pending ? "Actualizando…" : "Actualizar estado"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
