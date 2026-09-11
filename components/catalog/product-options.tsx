"use client";

import { useMemo, useState } from "react";

import { formatCop } from "@/lib/money";
import { findVariant, getColors, getSizes, productPriceRange, type Product } from "@/lib/catalog/types";

type ProductOptionsProps = {
  product: Product;
};

export function ProductOptions({ product }: ProductOptionsProps) {
  const colors = getColors(product);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const sizes = useMemo(() => getSizes(product, color), [product, color]);
  const [size, setSize] = useState<string | null>(sizes[0] ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const variant = findVariant(product, { color, size });
  const range = productPriceRange(product);
  const price = variant?.priceCents ?? range.min;
  const unavailable = !variant?.available;

  const selectColor = (nextColor: string) => {
    setColor(nextColor);
    const nextSizes = getSizes(product, nextColor);
    if (!size || !nextSizes.includes(size)) setSize(nextSizes[0] ?? null);
    setMessage(null);
  };

  const addToCart = async () => {
    if (!variant || !variant.available) return;
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ variantId: variant.id, quantity: 1 }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? "No fue posible agregar esta pieza.");

      window.dispatchEvent(new Event("unicommerce:cart-updated"));
      setMessage("Agregada a la bolsa.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible agregar esta pieza.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="product-options">
      <div className="product-options__price-row">
        <p className="product-options__price">{formatCop(price ?? null)}</p>
        {variant?.compareAtCents && variant.compareAtCents > variant.priceCents! ? (
          <del>{formatCop(variant.compareAtCents)}</del>
        ) : null}
      </div>

      {product.isDemo ? <p className="product-options__notice">Catálogo de demostración: compra desactivada hasta cargar productos reales.</p> : null}

      {colors.length > 0 ? (
        <fieldset className="option-group">
          <legend>Color <span>{color}</span></legend>
          <div className="option-group__choices">
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                className={item === color ? "is-selected" : undefined}
                onClick={() => selectColor(item)}
                aria-pressed={item === color}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {sizes.length > 0 ? (
        <fieldset className="option-group">
          <legend>Talla <a href="/size-guide">Guía de tallas</a></legend>
          <div className="option-group__choices option-group__choices--sizes">
            {sizes.map((item) => {
              const sizedVariant = findVariant(product, { color, size: item });
              return (
                <button
                  key={item}
                  type="button"
                  className={item === size ? "is-selected" : undefined}
                  onClick={() => {
                    setSize(item);
                    setMessage(null);
                  }}
                  aria-pressed={item === size}
                  disabled={!sizedVariant?.available}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <button
        type="button"
        className="add-to-bag"
        onClick={addToCart}
        disabled={pending || unavailable || product.isDemo}
      >
        {pending ? "Agregando…" : unavailable ? "No disponible" : "Agregar a la bolsa"}
      </button>
      <p className="form-feedback" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
