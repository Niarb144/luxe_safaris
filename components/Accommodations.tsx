"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type Accommodation = {
  id: string;
  hotel_name: string;
  country_location: string;
  slug: string;
  images?: string[];
};

export default function Accommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  const locale = useLocale();
  const t = useTranslations("accommodationsPage");

  useEffect(() => {
    fetchAccommodations();
  }, [locale]); // ← re-fetch when locale changes

  async function fetchAccommodations() {
    setLoading(true);

    const { data, error } = await supabase
      .from("accommodations")
      .select(`
        id,
        hotel_name,
        country_location,
        slug,
        images
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const rows = data || [];

    // ── Fetch translations for all accommodations in ONE batch query ───────
    let translationMap = new Map<string, Record<string, string>>();

    if (locale !== "en" && rows.length > 0) {
      const ids = rows.map((a) => a.id);

      const { data: translationData } = await supabase
        .from("translations")
        .select("record_id, field, translated_text")
        .eq("table_name", "accommodations")
        .eq("locale", locale)
        .in("record_id", ids)
        .in("field", ["hotel_name", "country_location"]);

      translationData?.forEach(({ record_id, field, translated_text }) => {
        if (!translationMap.has(record_id)) translationMap.set(record_id, {});
        translationMap.get(record_id)![field] = translated_text;
      });
    }

    // ── Merge translations over original data ONCE — no per-render lookup ──
    const merged = rows.map((accommodation) => ({
      ...accommodation,
      ...(translationMap.get(accommodation.id) ?? {}),
    }));

    setAccommodations(merged);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(accommodations.map((a) => a.country_location || "Other"))
    );
    return ["All", ...unique];
  }, [accommodations]);

  const filtered =
    active === "All"
      ? accommodations
      : accommodations.filter((a) => a.country_location === active);

  // ── Skeleton loader ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white mt-0 p-0 text-gray-800">
        {/* Heading skeleton */}
        <div className="text-center mt-10">
          <div className="h-10 w-80 bg-gray-200 animate-pulse rounded-xl mx-auto" />
          <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-xl mx-auto mt-4" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[32px] h-[400px] bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mt-0 p-0 text-gray-800">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#3b2a1d] mt-10">
          {t("title")}
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
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
        className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12"
      >
        {filtered.map((accommodation) => (
          <Link
            key={accommodation.id}
            href={`/accommodations/${accommodation.slug}`}
            className="relative group rounded-[32px] overflow-hidden h-[400px] shadow-xl"
          >
            {/* Image */}
            <Image
              src={accommodation.images?.[0] || "/images/logo.svg"}
              alt={accommodation.hotel_name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              <div className="text-sm uppercase tracking-widest font-semibold opacity-90">
                {accommodation.country_location}
              </div>

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