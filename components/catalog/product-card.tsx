import Image from "next/image";
import Link from "next/link";

import { formatCop } from "@/lib/money";
import { productPriceRange, type Product } from "@/lib/catalog/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.media[0];
  const { min, max } = productPriceRange(product);
  const price = min === max ? formatCop(min) : min === null ? "Precio por definir" : `Desde ${formatCop(min)}`;

  return (
    <article className="catalog-card">
      <Link href={`/products/${product.slug}`} className="catalog-card__image-link" aria-label={`Ver ${product.name}`}>
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width ?? 1080}
            height={image.height ?? 1350}
            sizes="(min-width: 900px) 25vw, 50vw"
          />
        ) : (
          <span className="catalog-card__image-placeholder">Fotografía pendiente</span>
        )}
      </Link>
      <div className="catalog-card__meta">
        <div>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
          <p>{product.category === "hoodie" ? "Hoodie" : "Camiseta"}</p>
        </div>
        <p>{price}</p>
      </div>
    </article>
  );
}
