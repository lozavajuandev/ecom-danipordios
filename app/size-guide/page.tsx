import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description: "Cómo consultar las medidas de cada prenda de uniCommerce.",
};

export default function SizeGuidePage() {
  return (
    <main className="reading-page">
      <header className="store-page__header">
        <Link className="wordmark wordmark--dark" href="/">uniCommerce</Link>
        <nav aria-label="Navegación de la tienda"><a href="/shop">Colección</a><a href="/cart">Bolsa</a></nav>
      </header>
      <article>
        <p className="utility-label">Guía de tallas</p>
        <h1>La talla se confirma en la ficha de cada prenda.</h1>
        <p>Cada producto publicado tendrá sus medidas, fit, altura del modelo y talla usada. No reutilizamos una tabla genérica para prendas que puedan cortar distinto.</p>
        <p>La matriz de medidas definitiva aún está pendiente de carga operativa.</p>
      </article>
    </main>
  );
}
