"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ToursList() {
  const [tours, setTours] = useState<any[]>([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          tour_images (
            image_url,
            is_main
          )
        `);

      if (error) {
        console.error(error);
        return;
      }

      // attach main image
      const formatted = data.map((tour) => {
        const mainImage = tour.tour_images?.find(
          (img: any) => img.is_main === true
        );

        return {
          ...tour,
          coverImage: mainImage?.image_url || "/images/logo.svg",
        };
      });

      setTours(formatted);
    }

    fetchTours();
  }, []);

  // Generate categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(tours.map((tour) => tour.location || "Other"))
    );

    return ["All", ...unique];
  }, [tours]);

  // Filter tours
  const filtered =
    active === "All"
      ? tours
      : tours.filter((tour) => tour.location === active);

  return (
    <section className="py-20 bg-[#f5f1ea] w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#3b2a1d]">
            Explore Our Tours
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover unforgettable safari experiences across East Africa.
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

        {/* Tour Cards */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14"
        >
          {filtered.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={tour.coverImage}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute top-4 left-4 bg-[#b77e24] text-white text-sm px-3 py-1 rounded-full">
                  {tour.location || "Safari"}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2f241b] line-clamp-2">
                  {tour.title}
                </h3>

                <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      {tour.duration || "Custom Duration"}
                    </p>

                    <p className="text-lg font-bold text-[#b77e24]">
                      From ${tour.price}
                    </p>
                  </div>

                  <span className="text-[#b77e24] font-medium">
                    View Tour →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}