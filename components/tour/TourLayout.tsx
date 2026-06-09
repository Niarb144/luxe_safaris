"use client";

import TourGallery from "./TourGallery";
import TourHeader from "./TourHeader";
import TourInclusions from "./TourInclusions";
import TourItinerary from "./TourItinerary";
import TourRoute from "./TourRoute";
import BookingCard from "./BookingCard";
import TourExclusions from "./TourExclusions";
import RelatedTours from "./RelatedTours";
import TourFAQS from "./TourFAQS";
import TourHighlights from "./TourHighlights";
import Accommodations from "./Accommodations";
import TourPricingTable from "./TourPricingTable";
import ContactCard from "../ContactCard";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { T } from "../T";


export default function TourLayout({ tour, mainImage, relatedTours, accommodations }: any) {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [bookingCardVisible, setBookingCardVisible] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false); // NEW
  const bookingCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(true);

    const handleScroll = () => {
      const sections = menuItems.map((item) => {
        const element = document.getElementById(item.id);
        if (!element) return null;
        return { id: item.id, offsetTop: element.offsetTop };
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setBookingCardVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (bookingCardRef.current) observer.observe(bookingCardRef.current);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (bookingModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [bookingModalOpen]);

  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "highlights", label: "Highlights" },
    { id: "inclusions", label: "Inclusions" },
    { id: "exclusions", label: "Exclusions" },
    { id: "itinerary", label: "Itinerary" },
    { id: "route", label: "Route" },
    { id: "gallery", label: "Gallery" },
    { id: "accommodations", label: "Accommodations" },
    { id: "pricing", label: "Pricing" },
    { id: "why-choose", label: "Why Choose" },
    { id: "faq", label: "FAQs" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[70vh] w-full flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <Image src={mainImage} alt={tour.title} fill priority sizes="100vw" className="object-cover scale-105" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-[#d4a54b] font-medium mb-4"
          >
            <Link href="/" className="hover:text-[#d4a54b] transition cursor-pointer"><T text="Home" /></Link>
            &nbsp;/&nbsp;
            <Link href="/tours" className="hover:text-[#d4a54b] transition cursor-pointer"><T text="All Tours" /></Link>
            &nbsp;/&nbsp; {tour.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg"
          >
            {tour.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="flex gap-2 flex-wrap text-lg text-white mt-4"
          >
            {tour.tour_holiday_types?.map((type: any) => (
              <span key={type.holiday_types.id} className="px-3 py-1 bg-[#041f0e]/70 text-[#b77e24] rounded-full text-sm">
                {type.holiday_types.name}
              </span>
            ))}
          </motion.div>
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
                className={`relative whitespace-nowrap font-medium transition duration-300 pb-2 cursor-pointer 
                  ${activeSection === item.id ? "text-[#b77e24]" : "text-gray-600 hover:text-[#b77e24]"}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div layoutId="activeNav" className="absolute left-0 bottom-0 w-full h-[3px] bg-[#b77e24] rounded-full" />
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
            <section id="overview" data-section="overview"><TourHeader tour={tour} /></section>
            <section id="highlights" data-section="highlights"><TourHighlights items={tour.tour_highlights} /></section>
            <section id="inclusions" data-section="inclusions"><TourInclusions items={tour.tour_inclusions} /></section>
            <section id="exclusions" data-section="exclusions"><TourExclusions items={tour.tour_exclusions} /></section>
            <section id="itinerary" data-section="itinerary"><TourItinerary items={tour.tour_itinerary} /></section>
            <section id="route" data-section="route"><TourRoute routes={tour.tour_route_maps} /></section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="relative" ref={bookingCardRef}>
            <div className="sticky top-28">
              <BookingCard tour={tour} />
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <section id="gallery" data-section="gallery" className="scroll-mt-32">
          <TourGallery images={tour.tour_images} />
        </section>

        {/* ACCOMMODATIONS */}
        <section className="mb-10 mt-22 max-w-4xl mx-auto px-6" id="accommodations" data-section="accommodations">
          <Accommodations accommodations={accommodations} />
        </section>

        {/* PRICING */}
        <section className="mb-10 mt-22 max-w-4xl mx-auto px-6" id="pricing" data-section="pricing">
          <TourPricingTable items={tour.tour_pricing} />
        </section>

        {/* Why choose this safari */}
        <section className="mb-10 mt-20 max-w-4xl mx-auto px-6" id="why-choose" data-section="why-choose">
          <h2 className="text-2xl font-semibold mb-3"><T text="Why Choose This Safari" /></h2>
          <p className="text-gray-600"><T text={tour.why_choose_safari || "No description provided."} /></p>
        </section>

        {/* FAQs */}
        <section id="faq" data-section="faqs" className="scroll-mt-32">
          <TourFAQS items={tour.tour_faqs} />
        </section>
      </div>

      <RelatedTours tours={relatedTours} />

      {/* FLOATING BOOKING CTA */}
      <AnimatePresence>
        {!bookingCardVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => setBookingModalOpen(true)}
              className="group flex items-center gap-3 bg-[#041f0e] hover:bg-[#062b12] text-white pl-5 pr-4 py-3.5 rounded-full shadow-2xl shadow-black/40 border border-[#b77e24]/30 transition-all duration-300 hover:border-[#b77e24]/60"
            >
              {tour.price && (
                <>
                  <span className="text-[#b77e24] font-bold text-base tracking-tight">
                    <T text={`From ${tour.price.toLocaleString()}`} />
                  </span>
                  <span className="w-px h-4 bg-white/20 rounded-full" />
                </>
              )}
              <span className="font-semibold text-sm uppercase tracking-wider cursor-pointer"><T text="Book This Tour" /></span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#b77e24] group-hover:bg-[#a06d1f] transition-colors duration-200 shrink-0 cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {bookingModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setBookingModalOpen(false)}
            />

            {/* Modal panel — slides up from bottom on mobile, centers on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed z-[70] bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
            >
              <div className="bg-neutral-900 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#041f0e]">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#b77e24] font-semibold"><T text="Reserve Your Spot" /></p>
                    <h3 className="text-white font-bold text-lg leading-tight mt-0.5 line-clamp-1"><T text={tour.title} /></h3>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 shrink-0 ml-4 cursor-pointer"
                    aria-label="Close booking modal"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* BookingCard rendered inside — max height with scroll for small screens */}
                <div className="overflow-y-auto max-h-[75vh] md:max-h-[70vh]">
                  <BookingCard tour={tour} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ContactCard />
    </>
  );
}