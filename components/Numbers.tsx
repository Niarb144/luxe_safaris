"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Counter hook
function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [end, duration]);

  return count;
}

// Individual Stat Card
function StatCard({ label, value }: { label: string; value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(isInView ? value : 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md text-center"
    >
      <h3 className="text-4xl md:text-5xl font-bold text-yellow-600">
        {count}+
      </h3>
      <p className="mt-2 text-gray-600">{label}</p>
    </motion.div>
  );
}

export default function Numbers() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-yellow-50 w-full">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-gray-900"
        >
          Our Impact in Numbers
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Experience luxury safaris crafted with passion. From breathtaking landscapes 
          to unforgettable wildlife encounters, we create journeys that stay with you forever.
        </motion.p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <StatCard label="Curated Tours" value={120} />
          <StatCard label="Destinations Covered" value={35} />
          <StatCard label="Happy Travelers" value={2500} />
        </div>
      </div>
    </section>
  );
}