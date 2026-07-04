"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface GalleryImage {
  id: string | number;
  image_url: string;
}

interface DestinationGalleryProps {
  images: GalleryImage[];
  alt: string;
}

export default function DestinationGallery({
  images,
  alt,
}: DestinationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  // Keyboard navigation + scroll lock while lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, showPrev, showNext]);

  // Basic touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (deltaX > SWIPE_THRESHOLD) {
      showPrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      showNext();
    }
    touchStartX.current = null;
  };

  if (!images?.length) return null;

  return (
    <>
      {/* THUMBNAIL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.id}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1} of ${images.length}`}
            className="relative overflow-hidden rounded-[28px] h-[320px] group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B98A3E] focus-visible:ring-offset-2"
          >
            <SafeImage
              src={image.image_url}
              alt={alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
          </button>
        ))}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={close}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition z-10"
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 md:left-8 text-white/80 hover:text-white transition z-10 p-2"
                aria-label="Previous image"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex].image_url}
                alt={alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/img4.jpg";
                }}
                draggable={false}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 md:right-8 text-white/80 hover:text-white transition z-10 p-2"
                aria-label="Next image"
              >
                <ChevronRight size={40} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-6 text-white/60 text-sm tracking-wide">
                {activeIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}