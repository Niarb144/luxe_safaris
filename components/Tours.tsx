"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type ToursListProps = {
  limit?: number;
  searchParams?: {
    search?: string;
    country?: string;       // slug from CountryCards e.g. "kenya"
    destination?: string;
    duration?: string;
    type?: string;
  };
};

export default function ToursList({ limit, searchParams }: ToursListProps) {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  const locale = useLocale();
  const t = useTranslations("tours");

  const search       = searchParams?.search      || "";
  const countrySlugParam = searchParams?.country || "";   // e.g. "kenya"
  const destination  = searchParams?.destination || "";
  const duration     = searchParams?.duration    || "";
  const holidayType  = searchParams?.type        || "";

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase
        .from("tours_with_countries")           // ← view instead of "tours"
        .select(`
          *,
          tour_images (image_url, is_main),
          tour_holiday_types (holiday_types (id, name)),
          tour_destinations (destinations (id, name))
        `);

      if (error) { console.error(error); return; }

      // ── Fetch translations ─────────────────────────────────────────────────
      let translationMap = new Map<string, Record<string, string>>();

      if (locale !== "en" && data.length > 0) {
        const tourIds = data.map((t) => t.id);

        const { data: translationsData } = await supabase
          .from("translations")
          .select("record_id, field, translated_text")
          .eq("table_name", "tours")
          .eq("locale", locale)
          .in("record_id", tourIds)
          .in("field", ["title", "description", "duration", "holiday_types"]);
          // "country" removed — country names now come from the countries table

        translationsData?.forEach(({ record_id, field, translated_text }) => {
          if (!translationMap.has(record_id)) translationMap.set(record_id, {});
          translationMap.get(record_id)![field] = translated_text;
        });
      }

      // ── Format and merge ───────────────────────────────────────────────────
      const formatted = data.map((tour) => {
        const mainImage    = tour.tour_images?.find((img: any) => img.is_main);
        const translations = translationMap.get(tour.id) ?? {};

        return {
          ...tour,
          ...translations,
          coverImage:   mainImage?.image_url || "/images/logo.svg",
          holidayTypes: tour.tour_holiday_types?.map((t: any) => t.holiday_types?.name) || [],
          destinations: tour.tour_destinations?.map((d: any) => d.destinations?.name)  || [],
          // countries & country_slugs come directly from the view as arrays
        };
      });

      setTours(formatted);
      setLoading(false);
    }

    fetchTours();
  }, [locale]);

  // Category pills: one entry per unique country name across all tours
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(tours.flatMap((tour) => tour.countries ?? []).filter(Boolean))
    );
    return ["All", ...unique];
  }, [tours]);

  const filteredTours = tours.filter((tour) => {
    // Country pill filter uses the display name; slug param from CountryCards uses the slug array
    const pillMatch   = active === "All" || (tour.countries ?? []).includes(active);
    const slugMatch   = !countrySlugParam || (tour.country_slugs ?? []).includes(countrySlugParam);
    const searchMatch = !search      || tour.title?.toLowerCase().includes(search.toLowerCase());
    const destMatch   = !destination || (tour.destinations ?? []).includes(destination);
    const durMatch    = !duration    || String(tour.duration) === duration;
    const typeMatch   = !holidayType || (tour.holidayTypes ?? []).includes(holidayType);

    return pillMatch && slugMatch && searchMatch && destMatch && durMatch && typeMatch;
  });

  const displayed = limit ? filteredTours.slice(0, limit) : filteredTours;
  const hasMore   = limit ? filteredTours.length > limit : false;

  // ── Skeleton ───────────────────────────────────────────────────────────────
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
              <div key={i} className="rounded-2xl h-[400px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="py-4 bg-[#f5f1ea] w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#3b2a1d]">{t("title")}</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Country pill filters — full page only */}
        {!limit && (
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
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
                  className="group relative overflow-hidden rounded-2xl h-[350px] shadow-xl block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={tour.coverImage}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={90}
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#041f0e]/50 via-[#041f0e]/10 to-[#041f0e]/5" />

                  <div className="relative h-full flex flex-col justify-between p-7">
                    {/* Top: country label(s) */}
                    <div>
                      <span className="text-white font-semibold text-sm tracking-wide">
                        {(tour.countries ?? []).join(" · ") || t("safari")}
                      </span>
                    </div>

                    {/* Bottom: title + hover description + duration/price */}
                    <div>
                      <h3 className="text-white text-base font-extrabold leading-snug mb-1 group-hover:mb-0 transition-all duration-300">
                        {tour.title}
                      </h3>

                      <div className="max-h-0 overflow-hidden group-hover:max-h-[180px] transition-all duration-500 ease-in-out">
                        <p className="text-white/80 text-xs leading-5 line-clamp-8 mt-1">
                          {tour.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <div className="rounded-lg px-3 py-1.5 backdrop-blur-md bg-white/10">
                          <span className="text-white font-bold text-xs">{tour.duration}</span>
                        </div>
                        <div className="bg-[#b77e24] rounded-2xl px-3 py-1.5">
                          <span className="text-white font-bold text-xs">
                            {tour.price === 0
                              ? t("learnMore")
                              : `${t("from")} $${tour.price.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {displayed.length === 0 && (
          <p className="text-center mt-10 text-gray-500">{t("noResults")}</p>
        )}

        {hasMore && (
          <div className="flex justify-center py-12">
            <Link
              href="/tours"
              className="group inline-flex items-center gap-3 bg-[#041f0e] hover:bg-[#062b12] text-white pl-6 pr-5 py-3.5 rounded-full border border-[#b77e24]/30 hover:border-[#b77e24]/60 transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg"
            >
              {t("exploreAll")}
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