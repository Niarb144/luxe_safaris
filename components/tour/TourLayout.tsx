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

export default function TourLayout({ tour }: any) {
  const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      setLoaded(true);
    }, []);

  return (
    <>
    <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
          {/* Optimized Background Image */}
          <div className="absolute inset-0 border rounded-lg overflow-hidden">
            <Image
              src="/images/img6.jpg"
              alt="Safari landscape"
              fill
              priority
              sizes="100vw"
              className="object-cover border rounded-lg"
              placeholder="blur"
              blurDataURL="/images/img6.jpg"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
    
          {/* Content */}
          <div className="relative z-10 px-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              Have a question?
            </motion.h1>
            <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 text-lg md:text-xl text-white/90"
            >
              We're here to help!
            </motion.p>
          </div>
        </section>
        <div className="bg-neutral-950 text-white min-h-screen">

      <TourGallery images={tour.tour_images} />

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-10 px-6 py-10">
        
        <div className="col-span-2 space-y-10">
          <TourHeader tour={tour} />
          <TourInclusions items={tour.tour_inclusions} />
          <TourItinerary items={tour.tour_itinerary} />
          <TourRoute routes={tour.tour_routes} />
        </div>

        <BookingCard tour={tour} />
      </div>
    </div>
    </>
    
  );
}