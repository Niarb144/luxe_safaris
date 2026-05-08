"use client";

import TourGallery from "./TourGallery";
import TourHeader from "./TourHeader";
import TourInclusions from "./TourInclusions";
import TourItinerary from "./TourItinerary";
import TourRoute from "./TourRoute";
import BookingCard from "./BookingCard";
import TourExclusions from "./TourExclusions";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function TourLayout({ tour, mainImage }: any) {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

 useEffect(() => {
  setLoaded(true);

  const handleScroll = () => {
    const sections = menuItems.map((item) => {
      const element = document.getElementById(item.id);

      if (!element) return null;

      return {
        id: item.id,
        offsetTop: element.offsetTop,
      };
    });

    const scrollPosition = window.scrollY + 180;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      if (section && scrollPosition >= section.offsetTop) {
        setActiveSection(section.id);
        break;
      }
    }
  };

  window.addEventListener("scroll", handleScroll);

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "inclusions", label: "Inclusions" },
    { id: "exclusions", label: "Exclusions" },
    { id: "itinerary", label: "Itinerary" },
    { id: "route", label: "Route" },
    { id: "gallery", label: "Gallery" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <Image
            src={mainImage}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105"
          />

          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg"
          >
            {tour.title}
          </motion.h1>
        </div>
      </section>

      {/* STICKY NAV */}
      <div className="sticky top-24 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide h-20">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative whitespace-nowrap font-medium transition duration-300 pb-2
                  ${
                    activeSection === item.id
                      ? "text-[#b77e24]"
                      : "text-gray-600 hover:text-[#b77e24]"
                  }
                `}
              >
                {item.label}

                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 bottom-0 w-full h-[3px] bg-[#b77e24] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white text-gray-800 min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-20">
            <section id="overview" data-section="overview">
              <TourHeader tour={tour} />
            </section>

            <section id="inclusions" data-section="inclusions">
              <TourInclusions items={tour.tour_inclusions} />
            </section>

            <section id="exclusions" data-section="exclusions">
              <TourExclusions items={tour.tour_exclusions} />
            </section>

            <section id="itinerary" data-section="itinerary">
              <TourItinerary items={tour.tour_itinerary} />
            </section>

            <section id="route" data-section="route">
              <TourRoute routes={tour.tour_route_maps} />
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="relative">
            <div className="sticky top-28">
              <BookingCard tour={tour} />
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <section
          id="gallery"
          data-section="gallery"
          className="scroll-mt-32"
        >
          <TourGallery images={tour.tour_images} />
        </section>
      </div>
    </>
  );
}