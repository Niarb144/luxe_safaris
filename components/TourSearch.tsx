"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TourSearch() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [holidayType, setHolidayType] = useState("");

  // dropdown data
  const [destinations, setDestinations] = useState<any[]>([]);
  const [holidayTypes, setHolidayTypes] = useState<any[]>([]);
  const [durationOptions, setDurationOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  async function fetchFilters() {
    // destinations
    const { data: destinationData } = await supabase
      .from("destinations")
      .select("id,name")
      .order("name");

    // holiday types
    const { data: typeData } = await supabase
      .from("holiday_types")
      .select("id,name")
      .order("name");

    // days from tours
    const { data: toursData } =
    await supabase
      .from("tours")
      .select("duration");

    const uniqueDurations = [
    ...new Set(
      toursData
      ?.map(t => t.duration)
      .filter(Boolean)
    )
    ];

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

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-[#b77e24] rounded-full cursor-pointer"
      >
        <Search className="text-white" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
            fixed inset-0
            bg-black/50
            z-[100]
            flex items-center justify-center
            "
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="
              bg-white
              rounded-xl
              p-8
              w-full
              max-w-2xl
              relative
              "
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 cursor-pointer"
              >
                <X />
              </button>

              <h2 className="text-2xl mb-6 text-gray-800 font-bold">
                Search Tours
              </h2>

              <div className="grid gap-4">

                {/* Tour name */}
                <input
                  placeholder="Search by tour name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-3 rounded text-gray-700"
                />

                {/* Destination */}
                <select
                  value={destination}
                  onChange={(e)=>setDestination(e.target.value)}
                  className="border p-3 rounded text-gray-700 cursor-pointer"
                >
                  <option value="">
                    Destination
                  </option>

                  {destinations.map((item)=>(
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>


                {/* Duration */}
                <select
                  value={duration}
                  onChange={(e)=>setDuration(e.target.value)}
                  className="border p-3 rounded text-gray-700"
                >
                  <option value="">
                    Days
                  </option>

                  {durationOptions.map((duration)=>(
                    <option
                      key={duration}
                      value={duration}
                    >
                      {duration}
                    </option>
                  ))}
                </select>


                {/* Holiday types */}
                <select
                  value={holidayType}
                  onChange={(e)=>setHolidayType(e.target.value)}
                  className="border p-3 rounded text-gray-700 cursor-pointer"
                >
                  <option value="">
                    Holiday Type
                  </option>

                  {holidayTypes.map((type)=>(
                    <option
                      key={type.id}
                      value={type.name}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>


                <button
                  onClick={handleSearch}
                  className="
                  bg-[#b77e24]
                  text-white
                  py-3
                  rounded
                  cursor-pointer
                  "
                >
                  Search Tours
                </button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}