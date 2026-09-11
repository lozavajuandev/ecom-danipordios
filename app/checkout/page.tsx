import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <header className="store-page__header">
        <Link className="wordmark wordmark--dark" href="/">uniCommerce</Link>
        <a href="/cart">Volver a la bolsa</a>
      </header>
      <div className="checkout-page__intro">
        <p className="utility-label">Checkout como invitado</p>
        <h1>Tu pedido, sin crear una cuenta.</h1>
      </div>
      <CheckoutForm />
    </main>
  );
}
