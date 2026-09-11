import type { Metadata } from "next";
import Link from "next/link";

import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Bolsa",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="cart-page">
      <header className="store-page__header">
        <Link className="wordmark wordmark--dark" href="/">uniCommerce</Link>
        <a href="/shop">Seguir comprando</a>
      </header>
      <section aria-labelledby="cart-title">
        <p className="utility-label">Bolsa</p>
        <h1 id="cart-title">Tus piezas.</h1>
        <CartPageContent />
      </section>
    </main>
  );
}
