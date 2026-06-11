"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/components/UseTranslation";

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

// Stat card
function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
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

      <p className="mt-2 text-gray-600">
        {label}
      </p>
    </motion.div>
  );
}


export default function Numbers() {
  const [stats, setStats] = useState({
    tours: 0,
    destinations: 0,
    travelers: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Count tours
        const { count: toursCount } = await supabase
          .from("tours")
          .select("*", {
            count: "exact",
            head: true,
          });

        // Count destinations
        const { count: destinationsCount } = await supabase
          .from("destinations")
          .select("*", {
            count: "exact",
            head: true,
          });

        // Count travelers/bookings (optional)
        const { count: travelersCount } = await supabase
          .from("bookings")
          .select("*", {
            count: "exact",
            head: true,
          });

        setStats({
          tours: toursCount || 0,
          destinations: destinationsCount || 0,
          travelers: travelersCount || 0,
        });
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    }

    fetchCounts();
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-yellow-50 w-full">
      <div className="max-w-6xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-gray-900"
        >
          Our Impact in Numbers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Experience luxury safaris crafted with passion.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

          <StatCard
            label="Curated Tours"
            value={stats.tours}
          />

          <StatCard
            label="Destinations Covered"
            value={stats.destinations}
          />

          <StatCard
            label="Happy Travelers"
            value={stats.travelers}
          />

        </div>
      </div>
    </section>
  );
}