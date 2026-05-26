"use client";

import Link from "next/link";
import { useState } from "react";

export default function Accommodations({
  accommodations,
}: {
  accommodations: any[];
}) {
  if (!accommodations?.length) return null;

  const levels = ["Economy", "Comfort", "Luxury", "Superior Luxury"];
  const [activeLevel, setActiveLevel] = useState("Economy");

  /* FILTER BY LEVEL */
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
      <h2 className="text-4xl font-bold uppercase mb-2">Accommodation</h2>
      <p className="text-gray-600 mb-8">Safari accommodation options</p>

      {/* LEVEL TABS */}
      <div className="flex overflow-x-auto mb-6">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-8 py-4 font-semibold uppercase border-r cursor-pointer ${
              activeLevel === level
                ? "bg-[#b77e24] text-white hover:bg-[#b77e24]/70"
                : "bg-[#041f0e] text-gray-200 hover:bg-[#041f0e]/90"
            }`}
          >
            {level} Level
          </button>
        ))}
      </div>

      <div className="border border-gray-300">
        {Object.entries(grouped).map(([destination, hotels]: any) => (
          <div key={destination}>
            {/* DESTINATION HEADER */}
            <div className="bg-gray-100 font-bold uppercase px-6 py-4 border-b text-xl">
              {destination}
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b text-left bg-white">
                  <th className="p-4">Country</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Accommodation</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel: any) => (
                  <tr key={hotel.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{hotel.country_location}</td>
                    <td className="p-4">{hotel.destinations?.name}</td>
                    <td className="p-4">
                      <Link
                        href={`/accommodations/${hotel.slug}`}
                        className="text-green-700 font-medium hover:underline"
                      >
                        {hotel.hotel_name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}