"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/img1.webp"
          alt="Safari"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight"
        >
          Discover Your Dream Safari
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-white/90"
        >
          Explore Africa’s most breathtaking destinations with curated safari
          experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <button className="bg-orange-500 hover:bg-[#b77e24] text-white px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105">
            Find a Safari
          </button>
        </motion.div>
      </div>
    </section>
  );
}
