import type { Product } from "./types";

const sampleMedia = [
  {
    id: "demo-media-01",
    url: "/images/hero-placeholder.webp",
    alt: "Imagen editorial de muestra de una persona con hoodie negro en luz natural.",
    position: 0,
    kind: "image" as const,
    width: 1080,
    height: 1350,
  },
];

const buildDemoProduct = (
  index: string,
  category: Product["category"],
  tone: string,
): Product => ({
  id: `demo-product-${index}`,
  slug: `${category}-${index}`,
  name: `${category === "hoodie" ? "Hoodie" : "Camiseta"} ${index}`,
  shortDescription: "Muestra de estructura; reemplazar por contenido, precio e inventario reales.",
  description:
    "Este producto existe únicamente para comprobar la experiencia de catálogo y ficha. Antes de publicar, se reemplaza por la descripción, composición, guía de tallas y fotografía aprobadas.",
  category,
  status: "active",
  material: null,
  fit: null,
  care: null,
  seoTitle: null,
  seoDescription: null,
  media: sampleMedia.map((media) => ({ ...media, id: `${media.id}-${index}` })),
  variants: ["S", "M", "L", "XL"].map((size) => ({
    id: `demo-variant-${index}-${tone}-${size}`,
    sku: `DEMO-${index}-${tone}-${size}`,
    color: tone,
    size,
    priceCents: null,
    compareAtCents: null,
    available: false,
  })),
  isDemo: true,
});

export const demoProducts: Product[] = [
  buildDemoProduct("01", "t-shirt", "Grafito"),
  buildDemoProduct("02", "t-shirt", "Hueso"),
  buildDemoProduct("03", "hoodie", "Carbón"),
  buildDemoProduct("04", "hoodie", "Piedra"),
];
