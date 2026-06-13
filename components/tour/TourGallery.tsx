"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useTranslations } from "next-intl";

export default function TourGallery({ images }: any) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const t = useTranslations("tourDetails");

  if (!images?.length) return null;

  // Format images for lightbox
  const slides = images.map((img: any) => ({
    src: img.image_url,
  }));

  return (
    <section className="bg-white py-16 rounded-3xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2f241b]">
            {t("galleryTitle")}
          </h2>

          <p className="text-gray-600 mt-3">
            {t("gallerySubtitle")}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px]">

          {/* Featured Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl cursor-pointer group"
            onClick={() => {
              setIndex(0);
              setOpen(true);
            }}
          >
            <Image
              src={images[0]?.image_url}
              alt="Tour Image"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
          </motion.div>

          {/* Remaining Images */}
          {images.slice(1, 5).map((img: any, i: number) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => {
                setIndex(i + 1);
                setOpen(true);
              }}
            >
              <Image
                src={img.image_url}
                alt={`Gallery ${i}`}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

              {/* Show More Overlay */}
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {open && (
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              index={index}
              slides={slides}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}