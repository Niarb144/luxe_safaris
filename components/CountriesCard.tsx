"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const countryImages: Record<string, string> = {
  Kenya: "/images/kenya.jpg",
  Tanzania: "/images/tanzania.jpg",
  Uganda: "/images/uganda.jpg",
  Rwanda: "/images/rwanda.jpg",
};

export default function CountryCards() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);

      const { data, error } = await supabase
        .from("tours")
        .select("country");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const grouped = (data || []).reduce(
        (acc: any, tour: any) => {
          if (!tour.country) return acc;

          const key = tour.country.trim();

          if (!acc[key]) {
            acc[key] = {
              name: key,
              slug: key.toLowerCase(),
              tours: 0,
              image: countryImages[key] || "/images/default.jpg",
            };
          }

          acc[key].tours += 1;

          return acc;
        },
        {}
      );

      const result = Object.values(grouped).sort(
        (a: any, b: any) => b.tours - a.tours
      );

      setCountries(result);
      setLoading(false);
    }

    fetchCountries();
  }, []);

  if (loading)
    return <div className="py-20 text-center">Loading...</div>;

  return (
    <section className="w-full py-16 bg-[#faf6f1]">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
            Explore Extraordinary Tours Across Africa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/tours?country=${country.slug}`}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >

                <div className="relative h-[300px] w-full">
                  {country.image ? (
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-6 left-6 text-white">

                  <h3 className="text-2xl font-semibold">
                    {country.name}
                  </h3>

                  <div className="mt-2 inline-block bg-[#b77e24] px-4 py-1 rounded-full text-sm">
                    {country.tours} TOUR{country.tours !== 1 ? "S" : ""}
                  </div>

                </div>

              </motion.div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}