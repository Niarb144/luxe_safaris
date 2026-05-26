"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CountryCards() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          id,
          location,
          tour_images (
            image_url,
            is_main
          )
        `);

      if (error) {
        console.error(error);
        return;
      }

      const grouped = data.reduce((acc: any, tour: any) => {
        const country = tour.location;

        const mainImage =
          tour.tour_images?.find((img: any) => img.is_main)?.image_url ||
          tour.tour_images?.[0]?.image_url ||
          null;

        if (!acc[country]) {
          acc[country] = {
            id: country,
            name: country,
            image: mainImage,
            tours: 0,
          };
        }

        acc[country].tours += 1;

        if (!acc[country].image && mainImage) {
          acc[country].image = mainImage;
        }

        return acc;
      }, {});

      setCountries(Object.values(grouped));
      setLoading(false);
    }

    fetchCountries();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

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
              key={country.id}
              href={`/tours?location=${encodeURIComponent(country.name)}`}
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