"use client";

import { FaCrown } from "react-icons/fa";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { MdHotelClass } from "react-icons/md";

type Season = "LOW" | "HIGH" | "PEAK";
type Classification = "economy" | "comfort" | "luxury" | "superior_luxury";

// ─── Constants ────────────────────────────────────────────────────────────────
const SEASONS: { key: Season; label: string; subtitle: string; dotColor: string }[] = [
  { key: "LOW",  label: "Low Season",  subtitle: "Mar, Apr, May & Nov 1 – Dec 19", dotColor: "#7a4520" },
  { key: "HIGH", label: "High Season", subtitle: "Rest of the year",               dotColor: "#b8830a" },
  { key: "PEAK", label: "Peak Season", subtitle: "Jan, Jul, Aug, Sep & Dec 20–31", dotColor: "#1c0d00" },
];

const PERSONS = [1, 2, 4, 6];

const CLASSIFICATIONS: {
  key: Classification; label: string; icon: any;
  headerBg: string; headerText: string;
  rowEven: string; rowOdd: string;
  badgeBg: string; badgeText: string;
}[] = [
  {
    key: "economy",
    label: "Economy",         icon: <IoStarOutline />,
    headerBg: "bg-gray-700",  headerText: "text-gray-100",
    rowEven: "bg-gray-50",    rowOdd: "bg-white",
    badgeBg: "bg-gray-200",   badgeText: "text-gray-700",
  },
  {
    key: "comfort",
    label: "Comfort",         icon: <IoStarSharp />,
    headerBg: "bg-[#b8830a]", headerText: "text-white",
    rowEven: "bg-amber-50",   rowOdd: "bg-white",
    badgeBg: "bg-amber-100",  badgeText: "text-amber-800",
  },
  {
    key: "luxury",
    label: "Luxury",          icon: <MdHotelClass />,
    headerBg: "bg-violet-700",headerText: "text-white",
    rowEven: "bg-violet-50",  rowOdd: "bg-white",
    badgeBg: "bg-violet-100", badgeText: "text-violet-800",
  },
  {
    key: "superior_luxury",
    label: "Superior Luxury", icon: <FaCrown />,
    headerBg: "bg-[#3d2008]", headerText: "text-[#f5e6c8]",
    rowEven: "bg-yellow-50",  rowOdd: "bg-white",
    badgeBg: "bg-yellow-100", badgeText: "text-yellow-800",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function TourPricing({ items }: any) {
  if (!items?.length) return null;

  const currency: string = items[0]?.currency ?? "USD";

  // Build lookup: classification → season → persons → entry
  const lookup: Partial<Record<Classification, Partial<Record<Season, Record<number, any>>>>> = {};
  for (const entry of items) {
    if (!lookup[entry.classification as Classification]) lookup[entry.classification as Classification] = {};
    const clsMap = lookup[entry.classification as Classification]!;
    if (!clsMap[entry.season as Season]) clsMap[entry.season as Season] = {};
    clsMap[entry.season as Season]![entry.persons] = entry;
  }

  const presentClassifications = CLASSIFICATIONS.filter((c) => lookup[c.key]);

  const fmt = (price: number) =>
    price.toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 2 });

  return (
    <section className="py-10">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-3xl text-gray-800">Safari Pricing Rates</h2>
      </div>

      <div className="space-y-8">
        {presentClassifications.map((cls) => {
          const clsData = lookup[cls.key]!;
          const presentSeasons = SEASONS.filter((s) => clsData[s.key]);
          if (!presentSeasons.length) return null;

          return (
            <div
              key={cls.key}
              className="rounded-2xl overflow-hidden border border-[#e8d5b0] shadow-sm"
            >
              {/* Header */}
              <div
                className={`${cls.headerBg} ${cls.headerText} px-5 py-4 flex items-center gap-3`}
              >
                <span className="text-xl">{cls.icon}</span>
                <span className="font-display text-lg font-semibold">
                  {cls.label}
                </span>
                <span
                  className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${cls.badgeBg} ${cls.badgeText}`}
                >
                  {currency} / person
                </span>
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <div className="grid grid-cols-5 bg-[#fffdf7] border-b border-[#e8d5b0]">
                  <div className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#7a5c2e]">
                    Season
                  </div>
                  {PERSONS.map((p) => (
                    <div
                      key={p}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#7a5c2e] text-right"
                    >
                      {p} Persons
                    </div>
                  ))}
                </div>

                {presentSeasons.map((s, idx) => {
                  const seasonData = clsData[s.key]!;
                  return (
                    <div
                      key={s.key}
                      className={`grid grid-cols-5 border-b border-[#f0e0c0] last:border-0 ${
                        idx % 2 === 0 ? cls.rowEven : cls.rowOdd
                      }`}
                    >
                      <div className="px-5 py-4 flex flex-col justify-center gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: s.dotColor }}
                          />
                          <span className="text-sm font-bold text-[#1c0d00]">
                            {s.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#a08050] pl-4">
                          {s.subtitle}
                        </span>
                      </div>

                      {PERSONS.map((p) => {
                        const entry = seasonData[p];
                        return (
                          <div
                            key={p}
                            className="px-4 py-4 flex flex-col items-end justify-center"
                          >
                            {entry ? (
                              <>
                                <span className="text-base font-bold text-[#1c0d00]">
                                  {fmt(entry.price)}
                                </span>
                                <span className="text-[10px] text-[#a08050] mt-0.5">
                                  {currency}*
                                </span>
                              </>
                            ) : (
                              <span className="text-[#d0b890] text-sm">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden space-y-4 p-4 bg-[#fffdf7]">
                {presentSeasons.map((s) => {
                  const seasonData = clsData[s.key]!;

                  return (
                    <div
                      key={s.key}
                      className="rounded-xl border border-[#e8d5b0] bg-white p-4 shadow-sm"
                    >
                      {/* Season header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: s.dotColor }}
                        />
                        <div>
                          <p className="font-semibold text-[#1c0d00]">
                            {s.label}
                          </p>
                          <p className="text-xs text-[#a08050]">
                            {s.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Price grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {PERSONS.map((p) => {
                          const entry = seasonData[p];

                          return (
                            <div
                              key={p}
                              className="rounded-lg bg-[#fffdf7] border border-[#f0e0c0] p-3 flex flex-col items-start"
                            >
                              <span className="text-xs text-[#7a5c2e] font-medium">
                                {p} pax
                              </span>

                              {entry ? (
                                <>
                                  <span className="text-sm font-bold text-[#1c0d00]">
                                    {fmt(entry.price)}
                                  </span>
                                  <span className="text-[10px] text-[#a08050]">
                                    {currency}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[#d0b890] text-sm">
                                  —
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#a08050] mt-5">
        * Prices are per person per night and displayed in {currency}. Rates may vary — contact us for current availability and exact quotes.
      </p>
    </section>
  );
}