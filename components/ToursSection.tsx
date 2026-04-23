"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TourCard } from "./TourCard";

const categories = [
  "All",
  "Kenya",
  "Tanzania",
  "Uganda",
];

const tours = [
  {
    id: "1",
    title: "Safari in Tanzania & beach holiday in Zanzibar",
    description:
      "A Tanzanian safari, a must for your safari wish list. An amazing safari experience including Serengeti & Ngorongoro.",
    image: "/images/tanzania.jpg",
    location: "Tanzania",
    duration: "10 Days",
    price: "From £3539",
    tag: "Tanzania",
  },
  {
    id: "2",
    title: "Safari in Kenya Nairobi National Park",
    description:
      "Explore Kenya's nature and wildlife on your safari tour then relax in sandy beaches of Mombasa.",
    image: "/images/kenya.jpg",
    location: "Kenya",
    duration: "15 Days",
    price: "From £3969",
    tag: "Kenya",
  },
  {
    id: "3",
    title: "Visit the gorillas of Rwanda & Uganda",
    description:
      "Classic tour from Kampala to the highlands of Uganda.",
    image: "/images/uganda2.jpg",
    location: "Uganda",
    duration: "12 Days",
    price: "From £2119",
    tag: "Uganda",
  },
  {
    id: "4",
    title: "Witness the wildebeest migration in Maasai Mara",
    description:
      "Experience the Great Migration in Kenya's Maasai Mara, where millions of wildebeest and zebras traverse the plains in search of greener pastures.",
    image: "/images/img4.jpg",
    location: "Kenya",
    duration: "16 Days",
    price: "From £2109",
    tag: "Kenya",
  },
];

export function ToursSection() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? tours : tours.filter((t) => t.tag === active);

  return (
    <section className="py-20 bg-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm tracking-widest text-gray-500 uppercase">
            Popular Tours
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mt-2">
            Others travel here
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2 rounded-full border transition ${
                active === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}