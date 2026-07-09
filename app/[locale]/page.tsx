"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import Map from "@/components/Map";
import Numbers from "@/components/Numbers";
import CountryCards from "@/components/CountriesCard";
import { countries } from "@/data/countries";
import ToursList from "@/components/Tours"; 
import Destinations from "@/components/Destinations";
import ReviewsSection from "@/components/ReviewSection";
import AccreditationSection from "@/components/Acrreditation";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";
import ContactCard from "@/components/ContactCard";

export default function Home() {

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white min-h-screen">
        <Hero />
        <CountryCards />
        <Numbers />
        <ToursList limit={4}/>
        <Destinations limit={4} />
        {/* <ReviewsSection /> */}
        {/* <AccreditationSection /> */}
        <WhyChooseLuxeSafaris />
        <ContactCard />
      </div>
    </>
  );
}