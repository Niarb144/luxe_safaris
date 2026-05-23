"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Accommodation = {
  id: string;
  hotel_name: string;
  country_location: string;
  slug: string;

  accommodation_images: {
    id: string;
    image_url: string;
  }[];
};

export default function Accommodations() {
  const [accommodations, setAccommodations  ] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetchAccommodations();
  }, []);

  async function fetchAccommodations() {
    const { data, error } = await supabase
      .from("accommodations")
      .select(`
        id,
        hotel_name,
        country_location,
        slug,
        images
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setAccommodations(data || []);
    }

    setLoading(false);
  }

  // Generate categories dynamically
    const categories = useMemo(() => {
      const unique = Array.from(
        new Set(accommodations.map((accommodation) => accommodation.country_location || "Other"))
      );
  
      return ["All", ...unique];
    }, [accommodations  ]);

     // Filter tours
  const filtered =
    active === "All"
      ? accommodations
      : accommodations.filter((accommodation) => accommodation.country_location === active);

  if (loading) {
    return <p>Loading accommodations...</p>;
  }

  return (
    <div className="bg-white mt-0 p-0 text-gray-800">
    {/* Heading */}
    <div className="text-center">
      <h2 className="text-4xl font-bold text-[#3b2a1d] mt-10">
        Accommodations Across East Africa
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Explore our curated selection of accommodations, from luxury lodges to boutique hotels, each offering a unique blend of comfort and local charm.
      </p>
    </div>
    {/* Filters */}
    <div className="flex flex-wrap justify-center gap-4 mt-10">
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
      {filtered.map((accommodation) => (
        <Link
          key={accommodation.id}
          href={`/accommodations/${accommodation.slug}`}
          className="relative group rounded-[32px] overflow-hidden h-[400px] shadow-xl"
        >
          {/* Image */}
          <Image
            src={
              accommodation.destination_images?.[0]?.image_url ||
              "/images/logo.svg"
            }
            alt={accommodation.hotel_name}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            
            {/* Top label */}
            <div className="text-sm uppercase tracking-widest font-semibold opacity-90">
              {accommodation.country_location}
            </div>

            {/* Bottom title */}
            <div>
              <h2 className="text-3xl font-bold leading-tight">
                {accommodation.hotel_name}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </motion.div>
    </div>
  );
}