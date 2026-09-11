"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, PlusIcon } from "@/components/icons";
import type { ProductMedia } from "@/lib/catalog/types";

type ProductGalleryProps = {
  productName: string;
  media: ProductMedia[];
};

export function ProductGallery({ productName, media }: ProductGalleryProps) {
  const images = media.filter((item) => item.kind === "image");
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const dialogRef = useRef<HTMLDialogElement>(null);

  const activeMedia = images[activeIndex];

  useEffect(() => {
    if (!zoomed) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [zoomed]);

  if (!activeMedia) {
    return (
      <div className="product-gallery product-gallery--empty" aria-label={`Fotografías de ${productName} pendientes`}>
        <span>Fotografía pendiente</span>
      </div>
    );
  }

  const moveZoom = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomPosition({
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  return (
    <section className="product-gallery" aria-label={`Galería de ${productName}`}>
      <div className="product-gallery__stage">
        <button
          className="product-gallery__image-button"
          type="button"
          onClick={() => setZoomed(true)}
          onPointerMove={moveZoom}
          aria-label={`Ampliar imagen ${activeIndex + 1} de ${images.length} de ${productName}`}
          style={{
            backgroundImage: `url(${activeMedia.url})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        >
          <Image
            src={activeMedia.url}
            alt={activeMedia.alt}
            width={activeMedia.width ?? 1080}
            height={activeMedia.height ?? 1350}
            sizes="(min-width: 960px) 56vw, 100vw"
            priority
          />
          <span className="product-gallery__zoom-hint">
            <PlusIcon width="17" height="17" /> Ampliar
          </span>
        </button>
        <p className="product-gallery__count" aria-live="polite">
          {activeIndex + 1} / {images.length}
        </p>
      </div>

      {images.length > 1 ? (
        <div className="product-gallery__thumbnails" aria-label="Elegir imagen">
          {images.map((media, index) => (
            <button
              type="button"
              key={media.id}
              className={index === activeIndex ? "is-active" : undefined}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <Image src={media.url} alt="" width={96} height={120} sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="zoom-dialog"
        aria-label={`Vista ampliada de ${productName}`}
        onClose={() => setZoomed(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setZoomed(false);
        }}
      >
        <button className="zoom-dialog__close" type="button" onClick={() => setZoomed(false)}>
          <CloseIcon width="22" height="22" /> <span>Cerrar</span>
        </button>
        <div className="zoom-dialog__image-wrap">
          <Image
            src={activeMedia.url}
            alt={activeMedia.alt}
            width={activeMedia.width ?? 1080}
            height={activeMedia.height ?? 1350}
            sizes="100vw"
          />
        </div>
      </dialog>
    </section>
  );
}
