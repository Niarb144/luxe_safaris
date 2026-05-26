"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Destination = {
  id: string;
  name: string;
  country: string;
  slug: string;
  destination_images: {
    id: string;
    image_url: string;
  }[];
};

export default function Destinations({ limit }: { limit?: number }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    const { data, error } = await supabase
      .from("destinations")
      .select(`
        id,
        name,
        country,
        slug,
        destination_images (
          id,
          image_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDestinations(data || []);
    }
    setLoading(false);
  }

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(destinations.map((d) => d.country || "Other"))
    );
    return ["All", ...unique];
  }, [destinations]);

  const filtered =
    active === "All"
      ? destinations
      : destinations.filter((d) => d.country === active);

  // If a limit is set, slice the filtered results
  const displayed = limit ? filtered.slice(0, limit) : filtered;
  const hasMore = limit ? filtered.length > limit : false;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
        {Array.from({ length: limit ?? 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[32px] h-[400px] bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white mt-0 p-0 text-gray-800">

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#3b2a1d] mt-4">
          Destinations Across East Africa
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          From the iconic Serengeti to the hidden gems of Rwanda, explore our
          curated selection of unforgettable safari destinations.
        </p>
      </div>

      {/* Filters — only show on full page (no limit) */}
      {!limit && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2 rounded-full border transition cursor-pointer ${
                active === cat
                  ? "bg-[#b77e24] text-white border-[#b77e24]"
                  : "border-[#b77e24] text-[#b77e24] hover:bg-[#b77e24] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12"
      >
        <AnimatePresence mode="popLayout">
          {displayed.map((destination) => (
            <motion.div
              key={destination.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/destinations/${destination.slug}`}
                className="relative group rounded-[32px] overflow-hidden h-[400px] shadow-xl block"
              >
                <Image
                  src={destination.destination_images?.[0]?.image_url || "/images/logo.svg"}
                  alt={destination.name}
                  fill
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div className="text-sm uppercase tracking-widest font-semibold opacity-90">
                    {destination.country}
                  </div>
                  <h2 className="text-3xl font-bold leading-tight">
                    {destination.name}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* See More button — only shown on homepage when results are truncated */}
      {hasMore && (
        <div className="flex justify-center pb-12">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-3 bg-[#041f0e] hover:bg-[#062b12] text-white pl-6 pr-5 py-3.5 rounded-full border border-[#b77e24]/30 hover:border-[#b77e24]/60 transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg"
          >
            Explore All Destinations
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#b77e24] group-hover:bg-[#a06d1f] transition-colors duration-200 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}