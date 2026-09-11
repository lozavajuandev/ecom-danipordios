"use client";

import { useEffect, useId, useState } from "react";

import type { ShippingMethod } from "@/lib/checkout/repository";
import type { CartSnapshot } from "@/lib/cart/types";
import { formatCop } from "@/lib/money";

type CheckoutConfig = {
  commerceConfigured: boolean;
  paymentConfigured: boolean;
  methods: ShippingMethod[];
};

type PaymentConfig = {
  publicKey: string;
  currency: "COP";
  amountInCents: number;
  reference: string;
  integrity: string;
  redirectUrl: string;
  expirationTime: string;
};

declare global {
  interface Window {
    WidgetCheckout?: new (configuration: {
      currency: string;
      amountInCents: number;
      reference: string;
      publicKey: string;
      signature: { integrity: string };
      redirectUrl: string;
      expirationTime: string;
    }) => { open: (callback?: (result: unknown) => void) => void };
  }
}

let wompiScript: Promise<void> | undefined;

function loadWompiWidget(): Promise<void> {
  if (window.WidgetCheckout) return Promise.resolve();
  wompiScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No fue posible cargar la pasarela de pago."));
    document.head.appendChild(script);
  });
  return wompiScript;
}

export function CheckoutForm() {
  const termsId = useId();
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void Promise.all([fetch("/api/cart"), fetch("/api/checkout/config")])
      .then(async ([cartResponse, configResponse]) => {
        if (!cartResponse.ok || !configResponse.ok) throw new Error("No fue posible iniciar checkout.");
        setCart((await cartResponse.json()) as CartSnapshot);
        setConfig((await configResponse.json()) as CheckoutConfig);
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "No fue posible iniciar checkout."));
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage(null);
    setPending(true);
    try {
      await loadWompiWidget();
      if (!window.WidgetCheckout) throw new Error("La pasarela no respondió. Intenta de nuevo.");
      const response = await fetch("/api/checkout/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          phone: form.get("phone"),
          addressLine1: form.get("addressLine1"),
          addressLine2: form.get("addressLine2"),
          city: form.get("city"),
          region: form.get("region"),
          shippingMethodId: form.get("shippingMethodId"),
          acceptsTerms: form.get("acceptsTerms") === "on",
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as { message?: string; payment?: PaymentConfig; orderUrl?: string };
      if (!response.ok || !payload.payment || !payload.orderUrl) throw new Error(payload.message ?? "No fue posible preparar el pago.");

      const checkout = new window.WidgetCheckout({
        currency: payload.payment.currency,
        amountInCents: payload.payment.amountInCents,
        reference: payload.payment.reference,
        publicKey: payload.payment.publicKey,
        signature: { integrity: payload.payment.integrity },
        redirectUrl: payload.payment.redirectUrl,
        expirationTime: payload.payment.expirationTime,
      });
      checkout.open(() => window.location.assign(payload.orderUrl!));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible abrir el pago.");
    } finally {
      setPending(false);
    }
  };

  const unableToPay = !cart || cart.lines.length === 0 || !config?.commerceConfigured || !config?.paymentConfigured || !config.methods.length;
  const selectedMethod = config?.methods.find((method) => method.id === shippingMethodId);
  const estimatedShipping = selectedMethod
    ? selectedMethod.freeFromSubtotalCents !== null && (cart?.subtotalCents ?? 0) >= selectedMethod.freeFromSubtotalCents
      ? 0
      : selectedMethod.flatRateCents
    : null;

  return (
    <form className="checkout-form" onSubmit={submit} noValidate>
      <section>
        <p className="utility-label">Contacto</p>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Teléfono<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required /></label>
      </section>
      <section>
        <p className="utility-label">Entrega</p>
        <label>Dirección<input name="addressLine1" autoComplete="shipping street-address" required /></label>
        <label>Complemento <span>Opcional</span><input name="addressLine2" autoComplete="shipping address-line2" /></label>
        <div className="checkout-form__two-column">
          <label>Ciudad<input name="city" autoComplete="shipping address-level2" required /></label>
          <label>Departamento<input name="region" autoComplete="shipping address-level1" required /></label>
        </div>
        <fieldset className="shipping-methods">
          <legend>Método de envío</legend>
          {config?.methods.map((method) => (
            <label key={method.id}>
              <input type="radio" name="shippingMethodId" value={method.id} required checked={shippingMethodId === method.id} onChange={() => setShippingMethodId(method.id)} />
              <span><strong>{method.name}</strong><small>{method.minBusinessDays !== null && method.maxBusinessDays !== null ? `${method.minBusinessDays}–${method.maxBusinessDays} días hábiles` : "Tiempo a confirmar"}</small></span>
              <span>{method.freeFromSubtotalCents !== null && (cart?.subtotalCents ?? 0) >= method.freeFromSubtotalCents ? "Gratis" : formatCop(method.flatRateCents)}</span>
            </label>
          ))}
          {config && config.methods.length === 0 ? <p>No hay un método de envío activo todavía.</p> : null}
        </fieldset>
      </section>
      <section className="checkout-summary">
        <p className="utility-label">Resumen</p>
        {cart?.lines.map((line) => <p key={line.id}><span>{line.productName} × {line.quantity}</span><span>{formatCop(line.lineTotalCents)}</span></p>)}
        <p className="checkout-summary__subtotal"><span>Subtotal</span><span>{formatCop(cart?.subtotalCents ?? null)}</span></p>
        {estimatedShipping !== null ? <p><span>Envío estimado</span><span>{estimatedShipping === 0 ? "Gratis" : formatCop(estimatedShipping)}</span></p> : null}
        <p className="checkout-summary__note">El total final se recalcula en el servidor con envío e impuestos antes de abrir Wompi.</p>
      </section>
      <label className="checkbox-label" htmlFor={termsId}>
        <input id={termsId} name="acceptsTerms" type="checkbox" required />
        <span>Acepto los términos y el tratamiento de datos aplicables a mi compra.</span>
      </label>
      <button className="add-to-bag" type="submit" disabled={pending || unableToPay}>
        {pending ? "Preparando pago…" : "Continuar a pago seguro"}
      </button>
      <p className="form-feedback" role="status" aria-live="polite">
        {message ?? (unableToPay ? "El checkout se habilita al configurar catálogo, envío, impuestos y Wompi." : null)}
      </p>
    </form>
  );
}
