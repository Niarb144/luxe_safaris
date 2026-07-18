"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchButton from "./SearchButton";
import TourSearch from "./TourSearch";
import { supabase } from "@/lib/supabase";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HolidayType {
  id: string;
  name: string;
}

interface DestinationGroup {
  country: string;
  destinations: { id: string; name: string }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRY_ORDER = ["Kenya", "Uganda"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActiveBar() {
  return (
    <motion.span
      layoutId="active"
      className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#b77e24]"
    />
  );
}

// ─── Tours mega-dropdown ──────────────────────────────────────────────────────

interface ToursDropdownProps {
  holidayTypes: HolidayType[];
  durationsByType: Map<string, string[]>;
  destinationsByType: Map<string, { id: string; name: string }[]>;
  allTourDestinations: { id: string; name: string }[];
  scrolled: boolean;
}

function ToursDropdown({ holidayTypes, durationsByType, destinationsByType, allTourDestinations, scrolled }: ToursDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [hoveredType, setHoveredType] = useState<{ id: string; name: string } | null>(null);
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
      setHoveredType(null);
    }, 120);
  };

  const navigate = (params: Record<string, string>) => {
    const p = new URLSearchParams(params);
    router.push(`/tours?${p.toString()}`);
    setOpen(false);
    setHoveredType(null);
  };

  const visibleDestinations = hoveredType
    ? (destinationsByType.get(hoveredType.id) ?? [])
    : allTourDestinations;

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href="/tours"
        className={`text-sm font-medium transition-colors nav-link flex items-center gap-1 ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        {t("ourTours")}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
          <ChevronRight size={13} className="rotate-90" />
        </motion.span>
      </Link>

      {pathname === "/tours" && <ActiveBar />}
      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#041f0e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 bg-[#0a1a12] top-full mt-3 z-[200] flex shadow-2xl rounded-2xl overflow-hidden border border-white/10"
            style={{ minWidth: 700 }}
          >
            {/* COL 1 – Safari Types */}
            <div className="bg-[#10261f] w-52 flex-shrink-0 py-3">
              <p className="px-5 py-2 text-[10px] uppercase tracking-[3px] text-[#b77e24] font-semibold">
                {t("safariType")}
              </p>
              {holidayTypes.map((ht) => (
                <button
                  key={ht.id}
                  onMouseEnter={() => setHoveredType({ id: ht.id, name: ht.name })}
                  onClick={() => navigate({ type: ht.name })}
                  className={`w-full text-left px-5 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    hoveredType?.id === ht.id
                      ? "bg-white/10 text-[#b77e24]"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {ht.name}
                  <ChevronRight size={13} className="opacity-40" />
                </button>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                <button
                  onClick={() => navigate({})}
                  className="w-full text-left px-5 py-2.5 text-xs text-[#b77e24] hover:text-white transition-colors cursor-pointer"
                >
                  {t("viewAllTours")}
                </button>
              </div>
            </div>

            {/* COL 2 – Duration */}
            <AnimatePresence mode="wait">
              {hoveredType && (
                <motion.div
                  key={`dur-${hoveredType.id}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                  className="bg-[#0d1f18] border-l border-white/10 w-48 flex-shrink-0 py-3"
                >
                  <p className="px-5 py-2 text-[10px] uppercase tracking-[3px] text-[#b77e24] font-semibold">
                    {t("duration")}
                  </p>
                  {(durationsByType.get(hoveredType.id) ?? []).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => navigate({ type: hoveredType.name, duration: dur })}
                      className="w-full text-left px-5 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-[#b77e24] transition-colors cursor-pointer"
                    >
                      {dur}
                    </button>
                  ))}
                  {(durationsByType.get(hoveredType.id) ?? []).length === 0 && (
                    <p className="px-5 py-2 text-sm text-white/40 italic">{t("noDurations")}</p>
                  )}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={() => navigate({ type: hoveredType.name })}
                      className="w-full text-left px-5 py-2.5 text-xs text-[#b77e24] hover:text-white transition-colors cursor-pointer"
                    >
                      {t("allType", { type: hoveredType.name })}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* COL 3 – By Destination */}
            <motion.div
              key={hoveredType?.id ?? "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0a1a12] border-l border-white/10 w-[100%] flex-shrink-0 py-3 overflow-y-auto max-h-100"
            >
              <p className="px-5 py-2 text-[10px] uppercase tracking-[3px] text-[#b77e24] font-semibold sticky top-0 bg-[#0a1a12]">
                {hoveredType ? t("typeDestinations", { type: hoveredType.name }) : t("byDestination")}
              </p>
              {visibleDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() =>
                    navigate(
                      hoveredType
                        ? { type: hoveredType.name, destination: dest.name }
                        : { destination: dest.name }
                    )
                  }
                  className="w-full text-left px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-0.5 transition-all duration-150 cursor-pointer"
                >
                  {t("destTours", { name: dest.name })}
                </button>
              ))}
              {visibleDestinations.length === 0 && (
                <p className="px-5 py-2 text-sm text-white/40 italic">{t("noDestinations")}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Destinations mega-dropdown ───────────────────────────────────────────────

interface DestinationsDropdownProps {
  groups: DestinationGroup[];
  scrolled: boolean;
}

function DestinationsDropdown({ groups, scrolled }: DestinationsDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const navigate = (params: Record<string, string>) => {
    const p = new URLSearchParams(params);
    router.push(`/destinations?${p.toString()}`);
    setOpen(false);
  };

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href="/destinations"
        className={`text-sm font-medium transition-colors nav-link flex items-center gap-1 ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        {t("destination")}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
          <ChevronRight size={13} className="rotate-90" />
        </motion.span>
      </Link>

      {pathname === "/destinations" && <ActiveBar />}
      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#041f0e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-3 z-[200] shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-[#10261f]"
            style={{ minWidth: Math.max(220, groups.length * 170) }}
          >
            <div
              className="grid py-4"
              style={{ gridTemplateColumns: `repeat(${Math.min(groups.length, 4)}, minmax(160px,1fr))` }}
            >
              {groups.map((group) => (
                <div key={group.country} className="px-4 border-r border-white/10 last:border-r-0">
                  <button
                    onClick={() => navigate({ country: group.country })}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-[3px] text-[#b77e24] font-semibold mb-2 hover:text-white transition-colors w-full text-left cursor-pointer"
                  >
                    {t("destination")} — {group.country}
                  </button>
                  {group.destinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => navigate({ destination: dest.name })}
                      className="block w-full text-left py-2 text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer"
                    >
                      {dest.name}
                    </button>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={() => navigate({ country: group.country })}
                      className="text-xs text-[#b77e24] hover:text-white transition-colors cursor-pointer"
                    >
                      {t("allType", { type: group.country })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Practical Info dropdown ───────────────────────────────────────────────────
// Travel Advisory = the current /info page. The rest are the legal/booking pages.

interface PracticalInfoLink {
  name: string;
  href: string;
}

function PracticalInfoDropdown({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();
  const s = useTranslations("nav");
  const p = useTranslations("footer");
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const links: PracticalInfoLink[] = [
    { name: p("information.travelAdvisory", { default: "Travel Advisory" }), href: "/info" },
    { name: p("information.bookWithConfidence"), href: "/booking-with-confidence" },
    { name: p("information.privacyPolicy"), href: "/privacy-policy" },
    { name: p("information.termsAndConditions"), href: "/termsandconditions" },
    { name: p("information.onlinePayment"), href: "/payment-methods" },
  ];

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const isActive = links.some((l) => l.href === pathname);

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`text-sm font-medium transition-colors nav-link flex items-center gap-1 cursor-pointer ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        {s("practicalInfo")}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
          <ChevronRight size={13} className="rotate-90" />
        </motion.span>
      </button>

      {isActive && <ActiveBar />}
      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#041f0e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-3 z-[200] shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-[#10261f] py-2"
            style={{ minWidth: 240 }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  pathname === link.href
                    ? "text-[#b77e24] bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Static nav links ─────────────────────────────────────────────────────────

function StaticLink({ name, href, scrolled }: { name: string; href: string; scrolled: boolean }) {
  const pathname = usePathname();
  return (
    <div className="relative group">
      <Link
        href={href}
        className={`text-sm font-medium transition-colors nav-link ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        {name}
      </Link>
      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#041f0e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      {pathname === href && <ActiveBar />}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const t = useTranslations("nav");
  const p = useTranslations("footer");
  const locale = useLocale();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>([]);
  const [destGroups, setDestGroups]   = useState<DestinationGroup[]>([]);
  const [durationsByType, setDurationsByType]       = useState<Map<string, string[]>>(new Map());
  const [destinationsByType, setDestinationsByType] = useState<Map<string, { id: string; name: string }[]>>(new Map());
  const [allTourDestinations, setAllTourDestinations] = useState<{ id: string; name: string }[]>([]);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen]   = useState(false);
  const [mobilePracticalOpen, setMobilePracticalOpen] = useState(false);
  const [mobileHoveredType, setMobileHoveredType] = useState<string | null>(null);

  // Static links (Practical Info is now its own dropdown, rendered separately)
  const STATIC_LINKS = [
    { name: t("home"),          href: "/" },
    { name: t("accommodation"), href: "/accommodations" },
    { name: t("contact"),       href: "/contact" },
  ];

  const PRACTICAL_INFO_LINKS = [
    { name: p("information.travelAdvisory", { default: "Travel Advisory" }), href: "/info" },
    { name: p("information.bookWithConfidence"), href: "/booking-with-confidence" },
    { name: p("information.privacyPolicy"), href: "/privacy-policy" },
    { name: p("information.termsAndConditions"), href: "/termsandconditions" },
    { name: p("information.onlinePayment"), href: "/payment-methods" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [locale]);

  async function fetchDropdownData() {
    // ── Fetch raw data (same as before) ─────────────────────────────────────
    const { data: typeData } = await supabase.from("holiday_types").select("id,name").order("name");
    const { data: joinData } = await supabase.from("tour_holiday_types").select("holiday_type_id, tours(id, duration)");
    const { data: destData } = await supabase.from("destinations").select("id,name,country").order("name");
    const { data: tourDestData } = await supabase.from("tour_destinations").select("tour_id, destinations(id, name)");

    // ── Fetch translations in parallel (skip for English) ───────────────────
    let htTranslations:   Record<string, string> = {};
    let destTranslations: Record<string, string> = {};

    if (locale !== "en") {
      const htIds   = (typeData  || []).map((r: any) => r.id);
      const destIds = (destData  || []).map((r: any) => r.id);

      const [{ data: htTrans }, { data: destTrans }] = await Promise.all([
        supabase
          .from("translations")
          .select("record_id, translated_text")
          .eq("table_name", "holiday_types")
          .eq("field", "name")
          .eq("locale", locale)
          .in("record_id", htIds),
        supabase
          .from("translations")
          .select("record_id, translated_text")
          .eq("table_name", "destinations")
          .eq("field", "name")
          .eq("locale", locale)
          .in("record_id", destIds),
      ]);

      htTranslations = Object.fromEntries(
        (htTrans || []).map((r: any) => [r.record_id, r.translated_text])
      );
      destTranslations = Object.fromEntries(
        (destTrans || []).map((r: any) => [r.record_id, r.translated_text])
      );
    }

    // ── Apply translations to holiday types ──────────────────────────────────
    const translatedTypes: HolidayType[] = (typeData || []).map((ht: any) => ({
      id: ht.id,
      name: htTranslations[ht.id] ?? ht.name,
    }));

    // ── Apply translations to destinations ───────────────────────────────────
    const translateDest = (dest: { id: string; name: string }) => ({
      id: dest.id,
      name: destTranslations[dest.id] ?? dest.name,
    });

    // ── Duration map (same logic as before) ──────────────────────────────────
    const durMap = new Map<string, string[]>();
    (joinData || []).forEach((row: any) => {
      const typeId = row.holiday_type_id as string;
      const duration = row.tours?.duration as string | undefined;
      if (!typeId || !duration) return;
      if (!durMap.has(typeId)) durMap.set(typeId, []);
      const existing = durMap.get(typeId)!;
      if (!existing.includes(duration)) existing.push(duration);
    });
    durMap.forEach((durations) => {
      durations.sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
      });
    });

    // ── Destination-by-type map (with translations applied) ──────────────────
    const tourToDestMap = new Map<string, { id: string; name: string }[]>();
    (tourDestData || []).forEach((row: any) => {
      const tourId = row.tour_id as string;
      const dest   = row.destinations as { id: string; name: string } | null;
      if (!tourId || !dest) return;
      if (!tourToDestMap.has(tourId)) tourToDestMap.set(tourId, []);
      const existing = tourToDestMap.get(tourId)!;
      if (!existing.find((d) => d.id === dest.id)) existing.push(translateDest(dest));
    });

    const tourToTypesMap = new Map<string, string[]>();
    (joinData || []).forEach((row: any) => {
      const tourId = row.tours?.id as string | undefined;
      const typeId = row.holiday_type_id as string;
      if (!tourId || !typeId) return;
      if (!tourToTypesMap.has(tourId)) tourToTypesMap.set(tourId, []);
      if (!tourToTypesMap.get(tourId)!.includes(typeId)) tourToTypesMap.get(tourId)!.push(typeId);
    });

    const destByTypeMap = new Map<string, { id: string; name: string }[]>();
    tourToDestMap.forEach((dests, tourId) => {
      const typeIds = tourToTypesMap.get(tourId) ?? [];
      typeIds.forEach((typeId) => {
        if (!destByTypeMap.has(typeId)) destByTypeMap.set(typeId, []);
        const existing = destByTypeMap.get(typeId)!;
        dests.forEach((d) => {
          if (!existing.find((e) => e.id === d.id)) existing.push(d);
        });
      });
    });
    destByTypeMap.forEach((dests) => dests.sort((a, b) => a.name.localeCompare(b.name)));

    const allDestsMap = new Map<string, { id: string; name: string }>();
    tourToDestMap.forEach((dests) => dests.forEach((d) => allDestsMap.set(d.id, d)));
    const allDestsSorted = Array.from(allDestsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // ── Destination groups for the Destinations dropdown (translated) ─────────
    if (destData) {
      const map: Record<string, { id: string; name: string }[]> = {};
      destData.forEach((d: any) => {
        const c = d.country || "Other";
        if (!map[c]) map[c] = [];
        map[c].push(translateDest({ id: d.id, name: d.name }));
      });
      const ordered = [
        ...COUNTRY_ORDER.filter((c) => map[c]),
        ...Object.keys(map).filter((c) => !COUNTRY_ORDER.includes(c)).sort(),
      ];
      setDestGroups(ordered.map((country) => ({ country, destinations: map[country] })));
    }

    setHolidayTypes(translatedTypes);
    setDurationsByType(durMap);
    setDestinationsByType(destByTypeMap);
    setAllTourDestinations(allDestsSorted);
  }

  const router = useRouter();
  const navigate = (path: string, params: Record<string, string> = {}) => {
    const p = new URLSearchParams(params);
    const qs = p.toString();
    router.push(qs ? `${path}?${qs}` : path);
    setMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image src="/images/logo.jpeg" alt="Logo" width={100} height={50} />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center">
          <StaticLink name={t("home")} href="/" scrolled={scrolled} />

          <ToursDropdown
            holidayTypes={holidayTypes}
            durationsByType={durationsByType}
            destinationsByType={destinationsByType}
            allTourDestinations={allTourDestinations}
            scrolled={scrolled}
          />

          <DestinationsDropdown groups={destGroups} scrolled={scrolled} />

          <StaticLink name={t("accommodation")} href="/accommodations" scrolled={scrolled} />

          <PracticalInfoDropdown scrolled={scrolled} />

          <StaticLink name={t("contact")} href="/contact" scrolled={scrolled} />
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <SearchButton />

          <div className="bg-[#b77e24] text-white px-4 py-2 rounded text-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 items-center">
              {/* Left Column */}
              <p className="font-medium whitespace-nowrap">
                {t("callUs")}
              </p>

              {/* Right Column */}
              <div className="flex flex-col leading-tight">
                <a
                  href="tel:+254716686006"
                  className="hover:underline"
                >
                  +254 716 686 006
                </a>
                <a
                  href="tel:+254722486677"
                  className="hover:underline"
                >
                  +254 722 486 677
                </a>
              </div>
            </div>
          </div>
        </div>

        <LanguageSwitcher />

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-1">

              <Link href="/" onClick={() => setMenuOpen(false)} className="text-black text-sm font-medium border-b pb-2 py-2">
                {t("home")}
              </Link>

              {/* Tours accordion */}
              <div className="border-b">
                <button
                  onClick={() => setMobileToursOpen(!mobileToursOpen)}
                  className="w-full flex items-center justify-between py-2 text-black text-sm font-medium"
                >
                  {t("ourTours")}
                  <ChevronRight size={14} className={`transition-transform ${mobileToursOpen ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {mobileToursOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2">
                        {holidayTypes.map((ht) => (
                          <div key={ht.id}>
                            <button
                              onClick={() => setMobileHoveredType(mobileHoveredType === ht.name ? null : ht.name)}
                              className="w-full flex items-center justify-between py-1.5 text-sm text-gray-700"
                            >
                              {ht.name}
                              <ChevronRight size={12} className={`transition-transform ${mobileHoveredType === ht.name ? "rotate-90" : ""}`} />
                            </button>

                            <AnimatePresence>
                              {mobileHoveredType === ht.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="pl-4 overflow-hidden"
                                >
                                  {(durationsByType.get(ht.id) ?? []).map((dur) => (
                                    <button
                                      key={dur}
                                      onClick={() => navigate("/tours", { type: ht.name, duration: dur })}
                                      className="block py-1 text-xs text-gray-500 hover:text-[#b77e24] transition-colors"
                                    >
                                      {dur}
                                    </button>
                                  ))}
                                  {(destinationsByType.get(ht.id) ?? []).length > 0 && (
                                    <>
                                      <p className="mt-2 text-[10px] uppercase tracking-widest text-[#b77e24] font-semibold">
                                        {t("destinations")}
                                      </p>
                                      {(destinationsByType.get(ht.id) ?? []).map((dest) => (
                                        <button
                                          key={dest.id}
                                          onClick={() => navigate("/tours", { type: ht.name, destination: dest.name })}
                                          className="block py-1 text-xs text-gray-500 hover:text-[#b77e24] transition-colors"
                                        >
                                          {t("destTours", { name: dest.name })}
                                        </button>
                                      ))}
                                    </>
                                  )}
                                  <button
                                    onClick={() => navigate("/tours", { type: ht.name })}
                                    className="block py-1 text-xs text-[#b77e24]"
                                  >
                                    {t("allTypeTours", { type: ht.name })}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                        <button onClick={() => navigate("/tours")} className="mt-1 text-xs text-[#b77e24]">
                          {t("viewAllTours")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destinations accordion */}
              <div className="border-b">
                <button
                  onClick={() => setMobileDestOpen(!mobileDestOpen)}
                  className="w-full flex items-center justify-between py-2 text-black text-sm font-medium"
                >
                  {t("destination")}
                  <ChevronRight size={14} className={`transition-transform ${mobileDestOpen ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {mobileDestOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2">
                        {destGroups.map((group) => (
                          <div key={group.country} className="mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-[#b77e24] font-semibold pt-1 pb-0.5">
                              {group.country}
                            </p>
                            {group.destinations.map((dest) => (
                              <button
                                key={dest.id}
                                onClick={() => navigate("/destinations", { destination: dest.name })}
                                className="block py-1 text-sm text-gray-700 hover:text-[#b77e24] transition-colors"
                              >
                                {dest.name}
                              </button>
                            ))}
                          </div>
                        ))}
                        <button onClick={() => navigate("/destinations")} className="mt-1 text-xs text-[#b77e24]">
                          {t("viewAllDestinations")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accommodation */}
              <Link
                href="/accommodations"
                onClick={() => setMenuOpen(false)}
                className="text-black text-sm font-medium border-b pb-2 py-2"
              >
                {t("accommodation")}
              </Link>

              {/* Practical Info accordion */}
              <div className="border-b">
                <button
                  onClick={() => setMobilePracticalOpen(!mobilePracticalOpen)}
                  className="w-full flex items-center justify-between py-2 text-black text-sm font-medium"
                >
                  {t("practicalInfo")}
                  <ChevronRight size={14} className={`transition-transform ${mobilePracticalOpen ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {mobilePracticalOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2">
                        {PRACTICAL_INFO_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-1.5 text-sm text-gray-700 hover:text-[#b77e24] transition-colors"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-black text-sm font-medium border-b pb-2 py-2"
              >
                {t("contact")}
              </Link>
            </div>

            <div className="px-6 py-4 flex items-center gap-4">
              <p className="text-gray-600 text-sm">{t("search")}</p>
              <SearchButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}