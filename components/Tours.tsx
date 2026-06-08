"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ToursListProps = {
  limit?: number;
  searchParams?: {
    search?: string;
    destination?: string;
    duration?: string;
    type?: string;
  };
};

export default function ToursList({ limit, searchParams }: ToursListProps) {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  const search = searchParams?.search || "";
  const destination = searchParams?.destination || "";
  const duration = searchParams?.duration || "";
  const holidayType = searchParams?.type || "";

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase
      .from("tours")
      .select(`
        *,
        tour_images (image_url, is_main),
        tour_holiday_types (holiday_types (id, name)),
        tour_destinations (destinations (id, name))
      `);

      if (error) { console.error(error); return; }

      const formatted = data.map((tour) => {
        const mainImage = tour.tour_images?.find((img: any) => img.is_main);
        const countrySlug = tour.country
        ? tour.country.toLowerCase().replace(/\s+/g, "-")
        : "";

        return {
          ...tour,
          coverImage:
            mainImage?.image_url || "/images/logo.svg",

          holidayTypes:
            tour.tour_holiday_types?.map(
              (t: any) => t.holiday_types?.name
            ) || [],

          destinations:
            tour.tour_destinations?.map(
              (d: any) => d.destinations?.name
            ) || [],

          countrySlug,
        };
      });

      setTours(formatted);
      setLoading(false);
      // console.log(formatted[0]);
    }

    fetchTours();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        tours
          .map((tour) => tour.country)
          .filter(Boolean)
      )
    );

    return ["All", ...unique];
  }, [tours]);

  const filteredTours = tours.filter((tour) => {
    const locationMatch = active === "All" || tour.country === active;
    const searchMatch = !search || tour.title?.toLowerCase().includes(search.toLowerCase());
    const destinationMatch = !destination || tour.destinations?.includes(destination);
    const durationMatch = !duration || String(tour.duration) === duration;
    const holidayMatch = !holidayType || tour.holidayTypes?.includes(holidayType);
    return locationMatch && searchMatch && destinationMatch && durationMatch && holidayMatch;
  });

  // console.log("Active:", active);
  // console.log(
  //   tours.map((t) => ({
  //     title: t.title,
  //     country: t.country,
  //   }))
  // );

  const displayed = limit ? filteredTours.slice(0, limit) : filteredTours;
  const hasMore = limit ? filteredTours.length > limit : false;

  // Skeleton loader
  if (loading) {
    return (
      <section className="py-4 bg-[#f5f1ea] w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="h-10 w-72 bg-gray-200 animate-pulse rounded-xl mx-auto" />
            <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-xl mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            {Array.from({ length: limit ?? 8 }).map((_, i) => (
              <div key={i} className="rounded-[32px] h-[400px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-[#f5f1ea] w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#3b2a1d]">Explore Our Tours</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover unforgettable safari experiences across East Africa.
          </p>
        </div>

        {/* Filters — full page only */}
        {!limit && (
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
        )}

        {/* Cards */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <AnimatePresence mode="popLayout">
            {displayed.map((tour) => (
              <motion.div
                key={tour.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/tours/${tour.slug}`}
                  className="group relative overflow-hidden rounded-[32px] h-[400px] shadow-xl block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={tour.coverImage}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#041f0e]/80 via-[#041f0e]/30 to-[#041f0e]/10" />

                  <div className="relative h-full flex flex-col justify-between p-7">
                    <div>
                      <span className="text-white font-semibold text-sm tracking-wide">
                        {tour.country || "Safari"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-extrabold">{tour.title}</h3>
                      <p className="text-white/80 mt-2 line-clamp-1 text-sm">{tour.description}</p>
                      <div className="flex gap-4 mt-6 flex-wrap">
                        <div className="rounded-lg px-5 py-2 backdrop-blur-md bg-white/10">
                          <span className="text-white font-bold">{tour.duration}</span>
                        </div>
                        <div className="bg-[#b77e24] rounded-2xl px-5 py-2">
                          <span className="text-white font-bold text-sm">From ${tour.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {displayed.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No tours found matching your filters.
          </p>
        )}

        {/* See More button — homepage only */}
        {hasMore && (
          <div className="flex justify-center py-12">
            <Link
              href="/tours"
              className="group inline-flex items-center gap-3 bg-[#041f0e] hover:bg-[#062b12] text-white pl-6 pr-5 py-3.5 rounded-full border border-[#b77e24]/30 hover:border-[#b77e24]/60 transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg"
            >
              Explore All Tours
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#b77e24] group-hover:bg-[#a06d1f] transition-colors duration-200 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}