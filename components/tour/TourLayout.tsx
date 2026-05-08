"use client";

import TourGallery from "./TourGallery";
import TourHeader from "./TourHeader";
import TourInclusions from "./TourInclusions";
import TourItinerary from "./TourItinerary";
import TourRoute from "./TourRoute";
import BookingCard from "./BookingCard";
import TourExclusions from "./TourExclusions";
import RelatedTours from "./RelatedTours";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TourLayout({ tour, mainImage, relatedTours }: any) {
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
      <RelatedTours tours={relatedTours} />

      <section className="py-24 bg-[#041f0e] text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#2d241a] to-[#15110c] p-10 md:p-16 shadow-2xl">
            
            {/* BACKGROUND GLOW */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#b77e24]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#b77e24]/10 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              
              {/* TEXT */}
              <div>
                <p className="uppercase tracking-[0.3em] text-sm text-[#d4a54b] font-medium">
                  Need Assistance?
                </p>

                <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                  Have Any Inquiries?
                  <br />
                  Feel Free To Reach Out
                </h2>

                <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl">
                  Our safari specialists are ready to help you plan the perfect
                  African adventure. Whether you need custom itineraries, pricing
                  details, or travel guidance, we’re here to assist you every step
                  of the way.
                </p>
              </div>

              {/* CONTACT CARD */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-8 space-y-6">
                
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">
                    Call Us
                  </p>

                  <a
                    href="tel:+254700000000"
                    className="mt-2 block text-3xl font-semibold hover:text-[#d4a54b] transition"
                  >
                    +254 700 000 000
                  </a>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">
                    Email
                  </p>

                  <a
                    href="mailto:info@luxesafaris.com"
                    className="mt-2 block text-lg text-gray-200 hover:text-[#d4a54b] transition"
                  >
                    info@luxeplainsafricasafaris.com
                  </a>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">
                    Office Hours
                  </p>

                  <p className="mt-2 text-gray-300">
                    Monday – Friday
                    <br />
                    8:00 AM – 6:00 PM
                  </p>
                </div>

                <Link href="/contact" className="w-full mt-4 bg-[#b77e24] hover:bg-[#a06d1f] transition text-white py-4 px-6 rounded-xl font-semibold text-md shadow-lg">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}