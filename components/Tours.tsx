"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ToursList() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTours() {
      const { data, error } = await supabase
        .from("tours")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setTours(data);
    }

    fetchTours();
  }, []);

  return (
    <div className="p-6 bg-blue-500 h-[50vh] overflow-y-auto">
      {tours.map((tour) => (
        <div key={tour.id} className="mb-4">
          <h2 className="text-xl font-bold text-white">{tour.title}</h2>
          <p className="text-white">${tour.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}