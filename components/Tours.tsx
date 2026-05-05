"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
        <Link key={tour.id} href={`/tours/${tour.id}`} className="block mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{tour.title}</h2>
          <p>${tour.price.toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
}