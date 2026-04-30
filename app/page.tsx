"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import Map from "@/components/Map";
import Numbers from "@/components/Numbers";
import CountryCards from "@/components/CountriesCard";
import { countries } from "@/data/countries";
import { ToursSection } from "@/components/ToursSection";

export default function Home() {

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white min-h-screen">
        <Hero />
        <CountryCards data={countries} />
        <Numbers />
        <ToursSection />
      </div>
    </>
  );
}