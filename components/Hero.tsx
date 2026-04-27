"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 border rounded-lg overflow-hidden">
        <Image
          src="/images/img3.webp"
          alt="Safari landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover border rounded-lg"
          placeholder="blur"
          blurDataURL="/images/img3.webp"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight"
        >
          Discover Your Dream Safari
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-lg md:text-xl text-white/90"
        >
          Explore Africa’s most breathtaking destinations with curated safari experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8"
        >
          <button className="bg-[#b77e24] hover:bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-transform hover:scale-105 cursor-pointer">
            Find a Safari
          </button>
        </motion.div>
      </div>
    </section>
  );
}