import type { Metadata } from "next";
import Link from "next/link";

import { CartIndicator } from "@/components/cart/cart-indicator";
import { ProductCard } from "@/components/catalog/product-card";
import { getProducts } from "@/lib/catalog/repository";

export const metadata: Metadata = {
  title: "Colección",
  description: "La colección inicial de uniCommerce.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="store-page">
      <header className="store-page__header">
        <Link className="wordmark wordmark--dark" href="/">uniCommerce</Link>
        <nav aria-label="Navegación de la tienda">
          <a href="/shop" aria-current="page">Colección</a>
          <a href="/size-guide">Tallas</a>
          <a href="/cart">Bolsa <CartIndicator /></a>
        </nav>
      </header>
      <section className="catalog-page" aria-labelledby="catalog-title">
        <div className="catalog-page__intro">
          <p className="utility-label">Colección</p>
          <h1 id="catalog-title">Las cuatro piezas.</h1>
          <p>Prendas, variantes y disponibilidad se actualizan desde inventario, no desde el navegador.</p>
        </div>
        {products.length > 0 ? (
          <div className="catalog-grid">
            {products.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        ) : (
          <p className="empty-state">La colección todavía no tiene productos publicados.</p>
        )}
      </section>
    </main>
  );
}
