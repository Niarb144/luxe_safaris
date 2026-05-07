"use client";

import TourGallery from "./TourGallery";
import TourHeader from "./TourHeader";
import TourInclusions from "./TourInclusions";
import TourItinerary from "./TourItinerary";
import TourRoute from "./TourRoute";
import BookingCard from "./BookingCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import TourExclusions from "./TourExclusions";

export default function TourLayout({ tour, mainImage }: any) {
  const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      setLoaded(true);
    }, []);

  return (
    <>
    <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
  
  {/* Background Image */}
  <div className="absolute inset-0 rounded-lg overflow-hidden">
    <Image
      src={mainImage}
      alt={tour.title}
      fill
      priority
      sizes="100vw"
      className="object-cover scale-105"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/50" />

    {/* Optional Gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
  </div>

  {/* Content */}
  <div className="relative z-10 px-6 max-w-4xl">
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg"
    >
      {tour.title}
    </motion.h1>

    {/* Optional subtitle */}
  </div>
</section>
    <div className="bg-white text-gray-800 min-h-screen">

      

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-10 px-6 py-10">
        
        <div className="col-span-2 space-y-10">
          <TourHeader tour={tour} />
          <TourInclusions items={tour.tour_inclusions} />
          <TourExclusions items={tour.tour_exclusions} />
          <TourItinerary items={tour.tour_itinerary} />
          <TourRoute routes={tour.tour_routes} />
        </div>
        

        <BookingCard tour={tour} />
      </div>

      <TourGallery images={tour.tour_images} />
    </div>
    </>
    
  );
}