"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, MapPin, CalendarDays, Plane, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TourSearch() {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [holidayType, setHolidayType] = useState("");

  const [destinations, setDestinations] = useState<any[]>([]);
  const [holidayTypes, setHolidayTypes] = useState<any[]>([]);
  const [durationOptions, setDurationOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) handleClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const clearFilters = () => {
    setSearch("");
    setDestination("");
    setDuration("");
    setHolidayType("");
  };

  const handleClose = () => {
    clearFilters();
    setOpen(false);
  };

  async function fetchFilters() {
    const { data: destinationData } = await supabase.from("destinations").select("id,name").order("name");
    const { data: typeData } = await supabase.from("holiday_types").select("id,name").order("name");
    const { data: toursData } = await supabase.from("tours").select("duration");

    const uniqueDurations = [...new Set(toursData?.map((t) => t.duration).filter(Boolean))];

    setDestinations(destinationData || []);
    setHolidayTypes(typeData || []);
    setDurationOptions(uniqueDurations);
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (destination) params.set("destination", destination);
    if (duration) params.set("duration", duration);
    if (holidayType) params.set("type", holidayType);

    router.push(`/tours?${params.toString()}`);
    handleClose();
  };

  const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/30 transition";

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-3 rounded-full bg-[#b77e24] hover:bg-[#c99034] transition-all duration-300 shadow-lg shadow-[#b77e24]/30 cursor-pointer"
      >
        <Search className="text-white" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl rounded-[30px] overflow-hidden border border-white/10 bg-[#10261f] shadow-2xl"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <p className="uppercase tracking-[4px] text-[#b77e24] text-sm">Luxury Safari Search</p>
                  <h2 className="text-3xl text-white font-serif mt-1">Find Your Perfect Journey</h2>
                </div>
                <button onClick={handleClose} className="text-white hover:text-[#b77e24] transition cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <div className="p-8 grid md:grid-cols-2 gap-5">
                {/* Tour Name */}
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b77e24]" size={18} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tour Name"
                    className={inputStyle}
                  />
                </div>

                {/* Destination */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b77e24]" size={18} />
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className={inputStyle}>
                    <option value="" className="bg-[#10261f] text-white">Select Destination</option>
                    {destinations.map((item) => (
                      <option key={item.id} value={item.name} className="bg-[#10261f] text-white">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b77e24]" size={18} />
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className={inputStyle}>
                    <option value="" className="bg-[#10261f] text-white">Duration</option>
                    {durationOptions.map((item) => (
                      <option key={item} value={item} className="bg-[#10261f] text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Holiday Type */}
                <div className="relative">
                  <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b77e24]" size={18} />
                  <select value={holidayType} onChange={(e) => setHolidayType(e.target.value)} className={inputStyle}>
                    <option value="" className="bg-[#10261f] text-white">Safari Type</option>
                    {holidayTypes.map((type) => (
                      <option key={type.id} value={type.name} className="bg-[#10261f] text-white">
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 px-8 py-6 flex flex-col md:flex-row gap-4 justify-end">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 rounded-xl bg-[#b77e24] hover:bg-[#c99034] text-white font-medium transition-all shadow-lg hover:shadow-[#b77e24]/30 cursor-pointer"
                >
                  Search Safaris
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}