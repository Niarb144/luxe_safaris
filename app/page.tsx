"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import Image from "next/image";
import Map from "@/components/Map";

export default function Home() {

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white min-h-screen p-4">
        <Hero />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Welcome to the Luxe Plains Africa Safaris
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center">
          Experience the ultimate in luxury and adventure with Luxe Plains Africa
          Safaris. Explore the breathtaking landscapes of Africa, encounter 
          majestic wildlife, and immerse yourself in the rich culture of the
          continent. Whether you're seeking a romantic getaway, a family vacation,
          or an unforgettable adventure, we have the perfect safari experience
          waiting for you.
        </p>
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