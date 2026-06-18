"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

// Counter hook
function useCountUp(
  end: number,
  duration = 2000
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end <= 0) {
      setCount(0);
      return;
    }

    let startTimestamp: number;

    const step = (timestamp: number) => {
      if (!startTimestamp)
        startTimestamp = timestamp;

      const progress = Math.min(
        (timestamp - startTimestamp) /
          duration,
        1
      );

      setCount(
        Math.floor(progress * end)
      );

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
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

  const isInView = useInView(ref, {
    once: true,
  });

  const [hasStarted, setHasStarted] =
    useState(false);

  useEffect(() => {
    if (isInView) {
      setHasStarted(true);
    }
  }, [isInView]);

  const count = useCountUp(
    hasStarted ? value : 0
  );

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
      }}
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
  const [stats, setStats] = useState({ tours: 0, destinations: 0, travelers: 0 });
  const t = useTranslations("numbers");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [
          { count: toursCount },
          { count: destinationsCount },
          { count: travelersCount },
        ] = await Promise.all([
          supabase
            .from("tours")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("destinations")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("bookings")
            .select("*", { count: "exact", head: true }),
        ]);

        setStats({
          tours: toursCount ?? 0,
          destinations: destinationsCount ?? 0,
          travelers: travelersCount ?? 0,
        });
      } finally {
        setLoading(false);
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
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
         <StatCard
            label={t("tours")}
            value={loading ? 0 : stats.tours}
          />
          <StatCard 
            label={t("destinations")} 
            value={loading ? 0 : stats.destinations} />
          <StatCard 
            label={t("travelers")} 
            value={loading ? 0 : stats.travelers} />
        </div>

      </div>
    </section>
  );
}