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
import { useTranslations } from "next-intl";

export default function TourLayout({ tour, mainImage, relatedTours, accommodations }: any) {
  const t = useTranslations("tourLayout");
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [bookingCardVisible, setBookingCardVisible] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const bookingCardRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: "overview", label: t("menu.overview") },
    { id: "highlights", label: t("menu.highlights") },
    { id: "inclusions", label: t("menu.inclusions") },
    { id: "exclusions", label: t("menu.exclusions") },
    { id: "itinerary", label: t("menu.itinerary") },
    { id: "route", label: t("menu.route") },
    { id: "gallery", label: t("menu.gallery") },
    { id: "accommodations", label: t("menu.accommodations") },
    { id: "pricing", label: t("menu.pricing") },
    { id: "why-choose", label: t("menu.whyChoose") },
    { id: "faq", label: t("menu.faq") },
  ];

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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (bookingModalOpen) {
      html.style.overflowX = "hidden";
      body.style.overflowX = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      html.style.overflowX = "";
      body.style.overflowX = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    }

    return () => {
      html.style.overflowX = "";
      body.style.overflowX = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [bookingModalOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 120, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <Image src={mainImage} alt={tour.title} fill priority sizes="100vw" className="object-cover scale-105" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/5" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] text-[#d4a54b] font-medium mb-2 sm:mb-4 line-clamp-1"
          >
            <Link href="/" className="hover:text-[#d4a54b] transition cursor-pointer">{t("home")}</Link>
            &nbsp;/&nbsp;
            <Link href="/tours" className="hover:text-[#d4a54b] transition cursor-pointer">{t("allTours")}</Link>
            &nbsp;/&nbsp; {tour.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg"
          >
            {tour.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mt-1 sm:mt-2 drop-shadow-md px-2"
          >
            {tour.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="flex gap-1.5 sm:gap-2 flex-wrap justify-center text-white mt-3 sm:mt-4"
          >
            {tour.tour_holiday_types?.map((type: any) => (
              <span key={type.holiday_types.id} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#041f0e]/70 text-[#b77e24] rounded-full text-[10px] sm:text-xs md:text-sm">
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
          <h2 className="text-2xl font-semibold mb-3">{t("whyChooseTitle")}</h2>
          <p className="text-gray-600">{tour.why_choose_safari || t("noDescription")}</p>
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
            className="fixed bottom-2 left-4 sm:left-1/2 sm:-translate-x-1/2 z-50"
          >
            <button
              onClick={() => setBookingModalOpen(true)}
              className="group flex items-center gap-3 bg-[#041f0e] hover:bg-[#062b12] text-white pl-5 pr-4 py-3.5 rounded-full shadow-2xl shadow-black/40 border border-[#b77e24]/30 transition-all duration-300 hover:border-[#b77e24]/60"
            >
              {tour.price ? (
                <>
                  <span className="text-[#b77e24] font-bold text-base tracking-tight">
                    {t("from")} ${tour.price.toLocaleString()}
                  </span>
                  <span className="w-px h-4 bg-white/20 rounded-full" />
                </>
              ) : null}
              <span className="font-semibold text-sm uppercase tracking-wider cursor-pointer">
                {tour.price === 0 ? t("getQuote") : t("bookThisTour")}
              </span>
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
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm overflow-hidden"
              onClick={() => setBookingModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
              className="
                fixed
                inset-x-0
                bottom-0
                z-[70]
                flex
                justify-center
                px-3
                pb-[env(safe-area-inset-bottom)]
                overflow-hidden

                md:inset-0
                md:items-center
                md:px-4
              "
            >
              <div
                className="
                  w-full
                  max-w-lg
                  overflow-hidden
                  rounded-t-3xl
                  md:rounded-3xl
                  bg-neutral-900
                  shadow-2xl
                "
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#041f0e] px-6 py-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#b77e24]">
                      {t("reserveYourSpot")}
                    </p>

                    <h3 className="mt-1 line-clamp-1 text-lg font-bold text-white">
                      {tour.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setBookingModalOpen(false)}
                    aria-label={t("closeBookingModal")}
                    className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div
                  className="
                    w-full
                    overflow-x-hidden
                    overflow-y-auto
                    max-h-[80dvh]
                    md:max-h-[70vh]
                  "
                >
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