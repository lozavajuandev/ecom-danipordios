"use client";

import { useEffect, useState } from "react";

export function CartIndicator() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const response = await fetch("/api/cart/count", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { count?: number };
        setCount(typeof payload.count === "number" ? payload.count : 0);
      } catch {
        // A decorative count must never interrupt browsing if the cart is unavailable.
      }
    };

    void loadCount();
    window.addEventListener("unicommerce:cart-updated", loadCount);
    return () => window.removeEventListener("unicommerce:cart-updated", loadCount);
  }, []);

  return <><span aria-hidden="true">{count}</span><span className="visually-hidden">{count} {count === 1 ? "artículo" : "artículos"} en la bolsa</span></>;
}
