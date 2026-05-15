"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TourSearch() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [holidayType, setHolidayType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (destination) params.set("destination", destination);
    if (days) params.set("days", days);
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
        <Search className="text-white"/>
      </button>

      <AnimatePresence>
        {open && (

          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="
            fixed inset-0
            bg-black/50
            z-[100]
            flex items-center justify-center
            "
          >

            <motion.div
              initial={{scale:0.8}}
              animate={{scale:1}}
              exit={{scale:0.8}}
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
              onClick={()=>setOpen(false)}
              className="absolute top-4 right-4 cursor-pointer"
              >
                  <X/>
              </button>

              <h2 className="text-2xl mb-6 text-gray-800 font-bold">
                Search Tours
              </h2>

              <div className="grid gap-4">

                <input
                placeholder="Search by tour name..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="border p-3 rounded text-gray-700"
                />

                <input
                placeholder="Destination"
                value={destination}
                onChange={(e)=>setDestination(e.target.value)}
                className="border p-3 rounded text-gray-700"
                />

                <input
                placeholder="Days"
                value={days}
                onChange={(e)=>setDays(e.target.value)}
                className="border p-3 rounded text-gray-700"
                />

                <select
                value={holidayType}
                onChange={(e)=>setHolidayType(e.target.value)}
                className="border p-3 rounded text-gray-700"
                >
                    <option value="">
                        Holiday Type
                    </option>

                    <option value="Adventure">
                        Adventure
                    </option>

                    <option value="Luxury">
                        Luxury
                    </option>

                    <option value="Family">
                        Family
                    </option>

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