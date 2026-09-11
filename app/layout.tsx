import type { Metadata } from "next";
import "./globals.css";

const directionContract = `<!--
THESIS: A calm editorial field becomes an honest first look at four future pieces; it refuses the typical sale-led fashion storefront.
OWN-WORLD: Chalk, ink, charcoal and sun-warmed concrete; precise hairlines, quiet serif display type and compact utility labels.
STORY: A mobile visitor immediately understands that this is a one-brand Colombian collection in formation and can preview its four-piece shape.
FIRST VIEWPORT: A full-height 4:5 editorial image carries the screen; a concise statement and one anchored action sit in the lower-left, with navigation remaining tactile above.
FORM: Editorial contact sheet, position 1 of 7 grounded structures; seed key 4cb790fd. Signature interaction: the photo field brightens subtly on the primary action while reduced-motion users receive the fully visible still state.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`;

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: "uniCommerce — Colección en preparación",
    template: "%s — uniCommerce",
  },
  description:
    "Base de demostración para la primera colección de uniCommerce. La información comercial final está pendiente.",
  robots: process.env.NEXT_PUBLIC_SITE_URL ? undefined : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body>
        <template data-direction-contract="unicommerce-home" dangerouslySetInnerHTML={{ __html: directionContract }} />
        {children}
      </body>
    </html>
  );
}
