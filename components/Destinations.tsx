"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Destination = {
  id: string;
  name: string;
  country: string;
  slug: string;

  destination_images: {
    id: string;
    image_url: string;
  }[];
};

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    const { data, error } = await supabase
      .from("destinations")
      .select(`
        id,
        name,
        country,
        slug,
        destination_images (
          id,
          image_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDestinations(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading destinations...</p>;
  }

  return (
    <>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.slug}`}
          className="relative group rounded-[32px] overflow-hidden h-[400px] shadow-xl"
        >
          {/* Image */}
          <img
            src={
              destination.destination_images?.[0]?.image_url ||
              "/placeholder.jpg"
            }
            alt={destination.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            
            {/* Top label */}
            <div className="text-sm uppercase tracking-widest font-semibold opacity-90">
              {destination.country}
            </div>

            {/* Bottom title */}
            <div>
              <h2 className="text-3xl font-bold leading-tight">
                {destination.name}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </section>
    </>
  );
}