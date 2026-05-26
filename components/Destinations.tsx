"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function Destinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
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

  // Generate categories dynamically
    const categories = useMemo(() => {
      const unique = Array.from(
        new Set(destinations.map((destination) => destination.country || "Other"))
      );
  
      return ["All", ...unique];
    }, [destinations]);

     // Filter tours
  const filtered =
    active === "All"
      ? destinations
      : destinations.filter((destination) => destination.country === active);

  if (loading) {
    return <p>Loading destinations...</p>;
  }

  return (
    <div className="bg-white mt-0 p-0 text-gray-800">
    {/* Heading */}
    <div className="text-center">
      <h2 className="text-4xl font-bold text-[#3b2a1d] mt-4">
        Destinations Across East Africa
      </h2>

      <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
        From the iconic Serengeti to the hidden gems of Rwanda, explore our curated selection of unforgettable safari destinations.
      </p>
    </div>
    {/* Filters */}
    <div className="flex flex-wrap justify-center gap-4 mt-2">
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
    <motion.div 
      layout
      className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
      {filtered.map((destination) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.slug}`}
          className="relative group rounded-[32px] overflow-hidden h-[400px] shadow-xl"
        >
          {/* Image */}
          <Image
            src={
              destination.destination_images?.[0]?.image_url ||
              "/images/logo.svg"
            }
            alt={destination.name}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            
            {/* Top label */}
            <div className="text-sm uppercase tracking-widest font-semibold opacity-90">
              {destination.country}
            </div>

            {/* Bottom title */}
            <div>
              <h2 className="text-3xl font-bold leading-tight">
                {destination.name}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </motion.div>
    </div>
  );
}