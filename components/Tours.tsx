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
              className="group relative overflow-hidden rounded-[32px] h-[400px] shadow-xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={tour.coverImage}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041f0e]/80 via-[#041f0e]/30 to-[#041f0e]/10" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-7">
                {/* Top Country */}
                <div className="flex items-center gap-3">
                  <span className="text-white uppercase tracking-wide font-bold text-sm">
                    {tour.location || "Safari"}
                  </span>
                </div>

                {/* Bottom Content */}
                <div>
                  {/* Title */}
                  <h3 className="text-white text-2xl font-extrabold leading-tight drop-shadow-lg">
                    {tour.title}
                  </h3>

                  {/* Optional Description */}
                  <p className="text-white/80 mt-4 line-clamp-2 text-sm leading-relaxed">
                    {tour.description}
                  </p>

                  {/* Bottom Tags */}
                  <div className="flex items-center gap-4 mt-8 flex-wrap">
                    {/* Duration */}
                    <div className="rounded-2xl px-5 py-2 backdrop-blur-md bg-white/10">
                      <span className="text-white font-bold text-md uppercase">
                        {tour.duration || "10 Days"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="bg-[#b77e24] rounded-2xl px-5 py-2 shadow-lg">
                      <span className="text-white font-extrabold text-sm uppercase">
                        From ${tour.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}