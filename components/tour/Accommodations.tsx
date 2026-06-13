"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Keep these as English keys — they must match the untranslated
// `classification` values stored in Supabase for filtering to work
// correctly regardless of the active locale.
const LEVEL_KEYS = ["Economy", "Comfort", "Luxury", "Superior Luxury"];

export default function Accommodations({
  accommodations,
}: {
  accommodations: any[];
}) {
  const t = useTranslations("accommodations");

  if (!accommodations?.length) return null;

  const [activeLevel, setActiveLevel] = useState("Economy");

  /* FILTER BY LEVEL — compares against English classification value */
  const filtered = accommodations.filter(
    (hotel) => hotel.classification === activeLevel
  );

  /* GROUP BY DESTINATION */
  const grouped = filtered.reduce((acc: any, hotel: any) => {
    const destination = hotel.destinations?.name || "Other";
    if (!acc[destination]) acc[destination] = [];
    acc[destination].push(hotel);
    return acc;
  }, {});

  return (
    <div className="py-12">
      <h2 className="text-4xl font-bold uppercase mb-2">{t("title")}</h2>
      <p className="text-gray-600 mb-8">{t("subtitle")}</p>

      {/* LEVEL TABS */}
      <div className="flex overflow-x-auto mb-8 rounded-xl border border-[#b77e24]/20 bg-[#041f0e]/5 p-1 gap-1">
        {LEVEL_KEYS.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`flex-1 min-w-max px-5 py-2.5 text-sm font-semibold uppercase tracking-widest rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeLevel === level
                ? "bg-[#b77e24] text-white shadow-md shadow-[#b77e24]/30"
                : "text-[#041f0e]/70 hover:text-[#b77e24] hover:bg-[#b77e24]/8"
            }`}
          >
            {t(`levels.${level}`)} {t("levelSuffix")}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {Object.entries(grouped).map(([destination, hotels]: any, groupIndex) => (
          <div key={destination} className={groupIndex > 0 ? "border-t border-gray-200" : ""}>

            {/* DESTINATION HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#041f0e] to-[#041f0e]/85">
              <span className="w-1 h-5 rounded-full bg-[#b77e24] shrink-0" />
              <h3 className="font-bold uppercase tracking-wider text-sm text-white/90">
                {destination}
              </h3>
            </div>

            {/* DESKTOP TABLE */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-1/4">
                    {t("country")}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-1/4">
                    {t("destination")}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t("accommodation")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hotels.map((hotel: any) => (
                  <tr key={hotel.id} className="group hover:bg-amber-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {hotel.country_location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {hotel.destinations?.name}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/accommodations/${hotel.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b77e24] hover:text-[#041f0e] transition-colors duration-150 group/link"
                      >
                        {hotel.hotel_name}
                        <svg
                          className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-150"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MOBILE CARDS */}
            <div className="sm:hidden divide-y divide-gray-100">
              {hotels.map((hotel: any) => (
                <div key={hotel.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/accommodations/${hotel.slug}`}
                      className="text-sm font-semibold text-[#b77e24] hover:text-[#041f0e] transition-colors"
                    >
                      {hotel.hotel_name}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {hotel.country_location && (
                      <span className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{t("countryLabel")}</span>{" "}
                        {hotel.country_location}
                      </span>
                    )}
                    {hotel.destinations?.name && (
                      <span className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{t("destinationLabel")}</span>{" "}
                        {hotel.destinations.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}