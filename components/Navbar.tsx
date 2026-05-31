"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import TourSearch from "./TourSearch";
import { supabase } from "@/lib/supabase";

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

const COUNTRY_ORDER = ["Kenya", "Uganda"];          // shown first; rest sorted alphabetically

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Thin animated underline shown on the active nav link */
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
  durationsByType: Map<string, string[]>;     // key = holiday_type id
  destinationsByType: Map<string, { id: string; name: string }[]>; // key = holiday_type id
  allTourDestinations: { id: string; name: string }[]; // flat list for "no type hovered" state
  scrolled: boolean;
}

function ToursDropdown({ holidayTypes, durationsByType, destinationsByType, allTourDestinations, scrolled }: ToursDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  // Destinations to show: scoped to hovered type, or all tour destinations
  const visibleDestinations = hoveredType
    ? (destinationsByType.get(hoveredType.id) ?? [])
    : allTourDestinations;

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* trigger */}
      <Link
        href="/tours"
        className={`text-sm font-medium transition-colors nav-link flex items-center gap-1 ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        Our Tours
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <ChevronRight size={13} className="rotate-90" />
        </motion.span>
      </Link>

      {pathname === "/tours" && <ActiveBar />}

      {/* hover underline */}
      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#041f0e] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      {/* dropdown panel */}
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
                Safari Type
              </p>
              {holidayTypes.map((ht) => (
                <button
                  key={ht.id}
                  onMouseEnter={() => setHoveredType({ id: ht.id, name: ht.name })}
                  onClick={() => navigate({ type: ht.name })}
                  className={`w-full text-left px-5 py-2.5 text-sm flex items-center justify-between transition-colors ${
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
                  View all tours →
                </button>
              </div>
            </div>

            {/* COL 2 – Duration (scoped to hovered type) */}
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
                    Duration
                  </p>
                  {(durationsByType.get(hoveredType.id) ?? []).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => navigate({ type: hoveredType.name, duration: dur })}
                      className="w-full text-left px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {dur}
                    </button>
                  ))}
                  {(durationsByType.get(hoveredType.id) ?? []).length === 0 && (
                    <p className="px-5 py-2 text-sm text-white/40 italic">No durations</p>
                  )}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={() => navigate({ type: hoveredType.name })}
                      className="w-full text-left px-5 py-2.5 text-xs text-[#b77e24] hover:text-white transition-colors"
                    >
                      All {hoveredType.name} →
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
                {hoveredType ? `${hoveredType.name} Destinations` : "By Destination"}
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
                  className="w-full text-left px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 hover:translate-x-0.5 transition-all duration-150 cursor-pointer"
                >
                  {dest.name} Tours
                </button>
              ))}
              {visibleDestinations.length === 0 && (
                <p className="px-5 py-2 text-sm text-white/40 italic">No destinations</p>
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
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/destinations"
        className={`text-sm font-medium transition-colors nav-link flex items-center gap-1 ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        Destination
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
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
                  {/* Country heading – also a link */}
                  <button
                    onClick={() => navigate({ country: group.country })}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-[3px] text-[#b77e24] font-semibold mb-2 hover:text-white transition-colors w-full text-left cursor-pointer"
                  >
                    {group.country} destinations
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
                      All {group.country} →
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

// ─── Static nav links (no dropdown) ──────────────────────────────────────────

const STATIC_LINKS = [
  { name: "Home",          href: "/" },
  { name: "Accommodation", href: "/accommodations" },
  { name: "Practical Info",href: "/info" },
  { name: "Contact",       href: "/contact" },
  { name: "Blog",          href: "/blog" },
];

function StaticLink({
  name,
  href,
  scrolled,
}: {
  name: string;
  href: string;
  scrolled: boolean;
}) {
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
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>([]);
  const [destGroups, setDestGroups]     = useState<DestinationGroup[]>([]);
  const [durationsByType, setDurationsByType]         = useState<Map<string, string[]>>(new Map());
  const [destinationsByType, setDestinationsByType]   = useState<Map<string, { id: string; name: string }[]>>(new Map());
  const [allTourDestinations, setAllTourDestinations] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  async function fetchDropdownData() {
    // Holiday types
    const { data: typeData } = await supabase
      .from("holiday_types")
      .select("id,name")
      .order("name");

    // Durations per holiday type via join table
    // Fetches tour_holiday_types joined with tours to get the duration for each type
    const { data: joinData } = await supabase
      .from("tour_holiday_types")
      .select("holiday_type_id, tours(id, duration)");

    // Build map: holiday_type_id → sorted unique durations
    const durMap = new Map<string, string[]>();
    (joinData || []).forEach((row: any) => {
      const typeId  = row.holiday_type_id as string;
      const duration = row.tours?.duration as string | undefined;
      if (!typeId || !duration) return;
      if (!durMap.has(typeId)) durMap.set(typeId, []);
      const existing = durMap.get(typeId)!;
      if (!existing.includes(duration)) existing.push(duration);
    });
    // Sort each list (numeric-aware: "3 Days" < "7 Days" < "10 Days")
    durMap.forEach((durations) => {
      durations.sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
      });
    });

    // Destinations with country field
    const { data: destData } = await supabase
      .from("destinations")
      .select("id,name,country")
      .order("name");

    setHolidayTypes(typeData || []);
    setDurationsByType(durMap);

    // Destinations linked to tours via tour_destinations join table
    // Pull tour_id + destination details, then cross-reference tour_holiday_types to scope by type
    const { data: tourDestData } = await supabase
      .from("tour_destinations")
      .select("tour_id, destinations(id, name)");

    // Build a map: tour_id → destinations[]
    const tourToDestMap = new Map<string, { id: string; name: string }[]>();
    (tourDestData || []).forEach((row: any) => {
      const tourId = row.tour_id as string;
      const dest   = row.destinations as { id: string; name: string } | null;
      if (!tourId || !dest) return;
      if (!tourToDestMap.has(tourId)) tourToDestMap.set(tourId, []);
      const existing = tourToDestMap.get(tourId)!;
      if (!existing.find((d) => d.id === dest.id)) existing.push(dest);
    });

    // Build tour_id → holiday_type_id[] map from earlier joinData
    const tourToTypesMap = new Map<string, string[]>();
    (joinData || []).forEach((row: any) => {
      const tourId = row.tours?.id as string | undefined; // need tour id
      const typeId = row.holiday_type_id as string;
      if (!tourId || !typeId) return;
      if (!tourToTypesMap.has(tourId)) tourToTypesMap.set(tourId, []);
      if (!tourToTypesMap.get(tourId)!.includes(typeId)) tourToTypesMap.get(tourId)!.push(typeId);
    });

    // Build destinationsByType map: holiday_type_id → unique destinations[]
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
    // Sort each destination list alphabetically
    destByTypeMap.forEach((dests) => dests.sort((a, b) => a.name.localeCompare(b.name)));

    // All unique tour destinations (flat, sorted) for the "no type selected" state
    const allDestsMap = new Map<string, { id: string; name: string }>();
    tourToDestMap.forEach((dests) => dests.forEach((d) => allDestsMap.set(d.id, d)));
    const allDestsSorted = Array.from(allDestsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    setDestinationsByType(destByTypeMap);
    setAllTourDestinations(allDestsSorted);

    if (destData) {
      // Group destinations by country, respecting COUNTRY_ORDER priority
      const map: Record<string, { id: string; name: string }[]> = {};
      destData.forEach((d) => {
        const c = d.country || "Other";
        if (!map[c]) map[c] = [];
        map[c].push({ id: d.id, name: d.name });
      });

      const ordered = [
        ...COUNTRY_ORDER.filter((c) => map[c]),
        ...Object.keys(map)
          .filter((c) => !COUNTRY_ORDER.includes(c))
          .sort(),
      ];

      setDestGroups(ordered.map((country) => ({ country, destinations: map[country] })));
    }
  }

  // ── Mobile accordion state
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen]   = useState(false);
  const [mobileHoveredType, setMobileHoveredType] = useState<string | null>(null);

  const router = useRouter();
  const navigate = (path: string, params: Record<string, string> = {}) => {
    const p = new URLSearchParams(params);
    const qs = p.toString();
    router.push(qs ? `${path}?${qs}` : path);
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image src="/images/logo.jpeg" alt="Logo" width={100} height={50} />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center">
          <StaticLink name="Home" href="/" scrolled={scrolled} />

          <ToursDropdown
            holidayTypes={holidayTypes}
            durationsByType={durationsByType}
            destinationsByType={destinationsByType}
            allTourDestinations={allTourDestinations}
            scrolled={scrolled}
          />

          <DestinationsDropdown groups={destGroups} scrolled={scrolled} />

          {STATIC_LINKS.filter((l) => l.href !== "/").map((link) => (
            <StaticLink key={link.href} name={link.name} href={link.href} scrolled={scrolled} />
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <TourSearch />
          <div className="bg-[#b77e24] text-white px-4 py-2 rounded text-sm flex flex-col leading-tight">
            <p className="font-medium">Call Us:</p>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span>+254 719 136 129</span>
              <span className="hidden sm:inline">/</span>
              <span>+254 722 486 677</span>
            </div>
          </div>
        </div>

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

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-1">

              {/* Home */}
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-black text-sm font-medium border-b pb-2 py-2">
                Home
              </Link>

              {/* Tours accordion */}
              <div className="border-b">
                <button
                  onClick={() => setMobileToursOpen(!mobileToursOpen)}
                  className="w-full flex items-center justify-between py-2 text-black text-sm font-medium"
                >
                  Our Tours
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
                                  {/* Destinations for this type */}
                                  {(destinationsByType.get(ht.id) ?? []).length > 0 && (
                                    <>
                                      <p className="mt-2 text-[10px] uppercase tracking-widest text-[#b77e24] font-semibold">
                                        Destinations
                                      </p>
                                      {(destinationsByType.get(ht.id) ?? []).map((dest) => (
                                        <button
                                          key={dest.id}
                                          onClick={() => navigate("/tours", { type: ht.name, destination: dest.name })}
                                          className="block py-1 text-xs text-gray-500 hover:text-[#b77e24] transition-colors"
                                        >
                                          {dest.name} Tours
                                        </button>
                                      ))}
                                    </>
                                  )}
                                  <button
                                    onClick={() => navigate("/tours", { type: ht.name })}
                                    className="block py-1 text-xs text-[#b77e24]"
                                  >
                                    All {ht.name} tours →
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}

                        <button
                          onClick={() => navigate("/tours")}
                          className="mt-1 text-xs text-[#b77e24]"
                        >
                          View all tours →
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
                  Destination
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rest of static links */}
              {STATIC_LINKS.filter((l) => l.href !== "/").map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-black text-sm font-medium border-b pb-2 py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="px-6 py-4 flex items-center gap-4">
              <p className="text-gray-600 text-sm">Search</p>
              <TourSearch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}