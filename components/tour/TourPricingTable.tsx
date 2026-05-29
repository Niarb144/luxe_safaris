"use client";

import { FaCrown } from "react-icons/fa";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { MdHotelClass } from "react-icons/md";

type Season = "LOW" | "MID" | "HIGH";
type Classification = "economy" | "comfort" | "luxury" | "superior_luxury";

// ─── Constants ────────────────────────────────────────────────────────────────
const SEASONS: { key: Season; label: string; subtitle: string; dotColor: string }[] = [
  { key: "LOW",  label: "Low Season",  subtitle: "Mar, Apr, May & Nov 1 – Dec 19", dotColor: "#7a4520" },
  { key: "MID",  label: "Mid Season",  subtitle: "Rest of the year",               dotColor: "#b8830a" },
  { key: "HIGH", label: "High Season", subtitle: "Jan, Jul, Aug, Sep & Dec 20–31", dotColor: "#1c0d00" },
];

const PERSONS = [2, 4, 6];

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
        <p className="text-xs uppercase tracking-[0.25em] text-[#b8830a] font-bold mb-1">
          Safari Rates
        </p>
        <h2 className="font-display text-3xl text-[#1c0d00]">Pricing</h2>
        <div className="w-12 h-px bg-[#b8830a] mt-3" />
      </div>

      <div className="space-y-8">
        {presentClassifications.map((cls) => {
          const clsData = lookup[cls.key]!;
          const presentSeasons = SEASONS.filter((s) => clsData[s.key]);
          if (!presentSeasons.length) return null;

          return (
            <div key={cls.key} className="rounded-2xl overflow-hidden border border-[#e8d5b0] shadow-sm">
              {/* Classification header */}
              <div className={`${cls.headerBg} ${cls.headerText} px-5 py-4 flex items-center gap-3`}>
                <span className="text-xl">{cls.icon}</span>
                <span className="font-display text-lg font-semibold">{cls.label}</span>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${cls.badgeBg} ${cls.badgeText}`}>
                  {currency} / person
                </span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-4 bg-[#fffdf7] border-b border-[#e8d5b0]">
                <div className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#7a5c2e]">Season</div>
                {PERSONS.map((p) => (
                  <div key={p} className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#7a5c2e] text-right">
                    {p} Persons
                  </div>
                ))}
              </div>

              {/* Season rows */}
              {presentSeasons.map((s, idx) => {
                const seasonData = clsData[s.key]!;
                return (
                  <div
                    key={s.key}
                    className={`grid grid-cols-4 border-b border-[#f0e0c0] last:border-0 ${idx % 2 === 0 ? cls.rowEven : cls.rowOdd}`}
                  >
                    {/* Season label */}
                    <div className="px-5 py-4 flex flex-col justify-center gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dotColor }} />
                        <span className="text-sm font-bold text-[#1c0d00]">{s.label}</span>
                      </div>
                      <span className="text-[11px] text-[#a08050] pl-4">{s.subtitle}</span>
                    </div>

                    {/* Price cells */}
                    {PERSONS.map((p) => {
                      const entry = seasonData[p];
                      return (
                        <div key={p} className="px-4 py-4 flex flex-col items-end justify-center">
                          {entry ? (
                            <>
                              <span className="text-base font-bold text-[#1c0d00]">{fmt(entry.price)}</span>
                              <span className="text-[10px] text-[#a08050] mt-0.5">{currency}*</span>
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
          );
        })}
      </div>

      <p className="text-xs text-[#a08050] mt-5">
        * Prices are per person per night and displayed in {currency}. Rates may vary — contact us for current availability and exact quotes.
      </p>
    </section>
  );
}