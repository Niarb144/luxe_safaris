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
      <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white min-h-screen p-4">
        <Hero />
        <CountryCards data={countries} />
        <Numbers />
        <ToursSection />
        <div className="mt-10 w-full max-w-4xl">
          <Image
            src="/images/img2.webp"
            alt="Luxe Plains Africa Safaris"
            width={1200}
            height={800}
            className="rounded-lg shadow-lg"
          />
        </div>
        <Map />
      </div>
    </>
  );
}