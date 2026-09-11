"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { CartSnapshot } from "@/lib/cart/types";
import { formatCop } from "@/lib/money";

export function CartPageContent() {
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  const reload = async () => {
    const response = await fetch("/api/cart");
    const body = (await response.json()) as CartSnapshot & { message?: string };
    if (!response.ok) throw new Error(body.message ?? "No fue posible cargar la bolsa.");
    setCart(body);
  };

  useEffect(() => {
    let active = true;
    void fetch("/api/cart")
      .then(async (response) => {
        const body = (await response.json()) as CartSnapshot & { message?: string };
        if (!response.ok) throw new Error(body.message ?? "No fue posible cargar la bolsa.");
        return body;
      })
      .then((body) => {
        if (active) setCart(body);
      })
      .catch((error: unknown) => {
        if (active) setMessage(error instanceof Error ? error.message : "No fue posible cargar la bolsa.");
      });
    return () => {
      active = false;
    };
  }, []);

  const changeQuantity = async (variantId: string, quantity: number) => {
    setPendingVariant(variantId);
    setMessage(null);
    try {
      const response = await fetch(`/api/cart/items/${variantId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(body.message ?? "No fue posible actualizar la bolsa.");
      await reload();
      window.dispatchEvent(new Event("unicommerce:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible actualizar la bolsa.");
    } finally {
      setPendingVariant(null);
    }
  };

  if (message && !cart) return <p className="empty-state">{message}</p>;
  if (!cart) return <p className="empty-state">Cargando bolsa…</p>;
  if (cart.lines.length === 0) {
    return <div className="cart-empty"><p>Tu bolsa está vacía.</p><Link href="/shop">Ver colección</Link></div>;
  }

  return (
    <div className="cart-content">
      <div className="cart-lines">
        {cart.lines.map((line) => (
          <article className="cart-line" key={line.id}>
            {line.imageUrl ? (
              <div className="cart-line__image">
                <Image src={line.imageUrl} alt={line.imageAlt} fill sizes="110px" />
              </div>
            ) : <div className="cart-line__placeholder" aria-hidden="true" />}
            <div className="cart-line__details">
              <div><Link href={`/products/${line.productSlug}`}>{line.productName}</Link><p>{line.variantLabel}</p></div>
              <p>{formatCop(line.lineTotalCents)}</p>
              {!line.available ? <p className="cart-line__warning">Esta variante cambió de disponibilidad.</p> : null}
              <div className="quantity-control" aria-label={`Cantidad de ${line.productName}`}>
                <button type="button" onClick={() => changeQuantity(line.variantId, line.quantity - 1)} disabled={pendingVariant === line.variantId} aria-label="Reducir cantidad">−</button>
                <span aria-live="polite">{line.quantity}</span>
                <button type="button" onClick={() => changeQuantity(line.variantId, line.quantity + 1)} disabled={pendingVariant === line.variantId || line.quantity >= 10} aria-label="Aumentar cantidad">+</button>
                <button type="button" className="quantity-control__remove" onClick={() => changeQuantity(line.variantId, 0)} disabled={pendingVariant === line.variantId}>Eliminar</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="cart-summary">
        <p><span>Subtotal</span><strong>{formatCop(cart.subtotalCents)}</strong></p>
        <p>Envío e impuestos se calculan con la dirección antes de pagar.</p>
        <Link className="add-to-bag" href="/checkout">Finalizar compra</Link>
        <p className="form-feedback" role="status">{message}</p>
      </aside>
    </div>
  );
}
