"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function TourCard({ tour }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
    >
      {/* Image */}
      <Image
        src={tour.image}
        alt={tour.title}
        width={500}
        height={600}
        className="w-full h-[420px] object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-6 text-white">
        <p className="text-xs uppercase tracking-wide opacity-80">
          {tour.location}
        </p>

        <h3 className="text-lg font-semibold leading-snug mt-2">
          {tour.title}
        </h3>

        <p className="text-sm opacity-80 mt-2 line-clamp-3">
          {tour.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {tour.duration}
          </span>

          <span className="bg-orange-500 px-3 py-1 text-sm rounded-full">
            {tour.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}