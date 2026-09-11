import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductOptions } from "@/components/catalog/product-options";
import { CartIndicator } from "@/components/cart/cart-indicator";
import { getProductBySlug } from "@/lib/catalog/repository";
import { formatCop } from "@/lib/money";
import { productPriceRange } from "@/lib/catalog/types";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: product.media[0]
      ? { images: [{ url: product.media[0].url, alt: product.media[0].alt }] }
      : undefined,
  };
}

function productStructuredData(product: Awaited<ReturnType<typeof getProductBySlug>>) {
  if (!product) return null;
  const priceRange = productPriceRange(product);
  const available = product.variants.some((variant) => variant.available);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    category: product.category,
    image: product.media.map((media) => media.url),
    ...(product.material ? { material: product.material } : {}),
    ...(priceRange.min !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "COP",
            price: (priceRange.min / 100).toFixed(0),
            availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `/products/${product.slug}`,
          },
        }
      : {}),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const structuredData = productStructuredData(product);
  const priceRange = productPriceRange(product);

  return (
    <main className="product-page">
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <header className="product-page__header">
        <Link className="wordmark wordmark--dark" href="/">uniCommerce</Link>
        <nav aria-label="Navegación de la tienda">
          <a href="/shop">Colección</a>
          <a href="/size-guide">Tallas</a>
          <a href="/cart">Bolsa <CartIndicator /></a>
        </nav>
      </header>

      <div className="breadcrumb" aria-label="Migas de pan">
        <Link href="/">Inicio</Link><span>/</span><Link href="/shop">Colección</Link><span>/</span><span aria-current="page">{product.name}</span>
      </div>

      <section className="product-detail" aria-labelledby="product-title">
        <ProductGallery productName={product.name} media={product.media} />
        <div className="product-detail__buy-panel">
          <div className="product-detail__heading">
            <p className="utility-label">{product.category === "hoodie" ? "Hoodie" : "Camiseta"}</p>
            <h1 id="product-title">{product.name}</h1>
            <p>{product.shortDescription}</p>
            {priceRange.min !== null ? <p className="visually-hidden">Precio desde {formatCop(priceRange.min)}</p> : null}
          </div>
          <ProductOptions product={product} />
          <div className="product-detail__accordions">
            <details open>
              <summary>Detalles</summary>
              <p>{product.description}</p>
            </details>
            <details>
              <summary>Fit y composición</summary>
              <p>{product.fit ?? "Esta información se publicará con la ficha definitiva."}</p>
              <p>{product.material ?? "Composición pendiente de validación."}</p>
            </details>
            <details>
              <summary>Cuidado</summary>
              <p>{product.care ?? "Instrucciones de cuidado pendientes de validación."}</p>
            </details>
            <details>
              <summary>Envíos y cambios</summary>
              <p>Las condiciones se muestran al configurar la operación de la tienda. No se prometen plazos ni coberturas antes de ello.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
