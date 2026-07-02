"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Keep these as English keys — they must match the untranslated
// `classification` values stored in Supabase for filtering to work
// correctly regardless of the active locale.
const LEVEL_KEYS = ["Economy", "Comfort", "Luxury", "Superior Luxury"] as const;

// Color coding per classification — badge = text/border/active-bg, bg = inactive tint
const LEVEL_STYLES: Record<(typeof LEVEL_KEYS)[number], { badge: string; bg: string }> = {
  Economy: { badge: "#6B7280", bg: "#F8FAFC" },
  Comfort: { badge: "#0F766E", bg: "#ECFDF5" },
  Luxury: { badge: "#C9A227", bg: "#FFFBEB" },
  "Superior Luxury": { badge: "#111827", bg: "#F3F4F6" },
};

export default function Accommodations({
  accommodations,
}: {
  accommodations: any[];
}) {
  const t = useTranslations("accommodations");
  const [activeLevel, setActiveLevel] = useState<(typeof LEVEL_KEYS)[number]>("Economy");

  if (!accommodations?.length) return null;

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

      {/* LEVEL TABS — fixed 4-col grid, no horizontal scroll, color-coded per class */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-8">
        {LEVEL_KEYS.map((level) => {
          const { badge, bg } = LEVEL_STYLES[level];
          const isActive = activeLevel === level;

          return (
            <button
              key={level}
              type="button"
              onClick={() => setActiveLevel(level)}
              aria-pressed={isActive}
              style={
                isActive
                  ? { backgroundColor: badge, borderColor: badge }
                  : { backgroundColor: bg, borderColor: `${badge}33`, color: badge }
              }
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-2 sm:px-3 sm:py-2.5 text-center transition-all duration-200 cursor-pointer ${
                isActive ? "text-white shadow-md" : "hover:shadow-sm hover:opacity-90"
              }`}
            >
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-tight sm:tracking-widest leading-tight break-words">
                {t(`levels.${level}`)}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] uppercase tracking-wide leading-none ${
                  isActive ? "text-white/80" : "opacity-70"
                }`}
              >
                {t("levelSuffix")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center px-6 py-14 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: LEVEL_STYLES[activeLevel].badge }}
            >
              {t("noAccommodations", { default: "No available accommodation for this class" })}
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([destination, hotels]: any, groupIndex) => (
          <div key={destination} className={groupIndex > 0 ? "border-t border-gray-200" : ""}>

            {/* DESTINATION HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 "
              style={{
                      backgroundColor: LEVEL_STYLES[activeLevel].bg,
                      borderBottomColor: `${LEVEL_STYLES[activeLevel].badge}33`,
                    }}
                  >
              <span className="w-1 h-5 rounded-full bg-[#b77e24] shrink-0" />
              <h3 className="font-bold uppercase tracking-wider text-sm text-gray-900">
                {destination}
              </h3>
            </div>

            {/* DESKTOP TABLE */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr
                  className="border-b text-left transition-colors duration-200"
                  style={{
                    backgroundColor: LEVEL_STYLES[activeLevel].bg,
                    borderBottomColor: `${LEVEL_STYLES[activeLevel].badge}33`,
                  }}
                >
                  <th
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider w-1/4"
                    style={{ color: LEVEL_STYLES[activeLevel].badge }}
                  >
                    {t("country")}
                  </th>
                  <th
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider w-1/4"
                    style={{ color: LEVEL_STYLES[activeLevel].badge }}
                  >
                    {t("destination")}
                  </th>
                  <th
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: LEVEL_STYLES[activeLevel].badge }}
                  >
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
                <div
                  key={hotel.id}
                  className="px-4 py-4 space-y-2 border-l-4"
                  style={{
                    borderLeftColor: LEVEL_STYLES[activeLevel].badge,
                    backgroundColor: LEVEL_STYLES[activeLevel].bg,
                  }}
                >
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