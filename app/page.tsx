import Image from "next/image";

import { CartIndicator } from "@/components/cart/cart-indicator";
import { ProductCard } from "@/components/catalog/product-card";
import { getProducts } from "@/lib/catalog/repository";

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <a className="skip-link" href="#content">
        Ir al contenido
      </a>

      <header className="site-header" aria-label="Navegación principal">
        <a className="wordmark" href="#top" aria-label="uniCommerce, inicio">
          uniCommerce
        </a>
        <nav className="primary-nav" aria-label="Secciones">
          <a href="/shop">Colección</a>
          <a href="#studio">Estudio</a>
        </nav>
        <a className="cart-link" href="/cart">
          <CartIndicator /> <span aria-hidden="true">·</span> Bolsa
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="/images/hero-placeholder.webp"
          alt="Imagen editorial de muestra: persona con hoodie negro en un estudio de luz natural."
          width={1080}
          height={1350}
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-content" id="content">
          <p className="utility-label">Colección inicial · Colombia</p>
          <h1 id="hero-title">La forma llega antes que el ruido.</h1>
          <p className="hero-copy">
            Cuatro piezas, una sola marca y una experiencia pensada primero para móvil.
          </p>
          <a className="primary-link" href="/shop">
            Conocer la colección <span aria-hidden="true">↘</span>
          </a>
        </div>
        <p className="hero-caption">Imagen editorial de muestra — pendiente fotografía final</p>
      </section>

      <section className="pieces-section" id="pieces" aria-labelledby="pieces-title">
        <div className="section-intro">
          <p className="utility-label">Primer drop</p>
          <h2 id="pieces-title">Cuatro estudios de producto.</h2>
          <p>
            Los nombres, precios, variantes e inventario se conectarán a Supabase después de recibir el catálogo real.
          </p>
        </div>

        <div className="catalog-grid" role="list" aria-label="Las cuatro piezas iniciales">
          {products.map((product) => (
            <div role="listitem" key={product.id}><ProductCard product={product} /></div>
          ))}
        </div>
      </section>

      <section className="studio-section" id="studio" aria-labelledby="studio-title">
        <p className="utility-label">El estudio</p>
        <div className="studio-copy">
          <h2 id="studio-title">Menos pasos no significa menos certeza.</h2>
          <p>
            Talla, precio total, disponibilidad y estado de pago se confirmarán desde el servidor. La primera versión no pedirá crear una cuenta.
          </p>
        </div>
        <div className="promise-list" aria-label="Principios de la tienda">
          <p>Fotografía protagonista</p>
          <p>Compra como invitado</p>
          <p>Colombia · COP</p>
        </div>
      </section>

      <footer className="site-footer">
        <p>uniCommerce <span aria-hidden="true">©</span> 2026</p>
        <p>Base de demostración. Contenido comercial pendiente.</p>
      </footer>
    </main>
  );
}
