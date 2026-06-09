"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SafariQuizModal from "./QuizModal";
import TourSearch from "./TourSearch";
import { T } from "./T";

export default function SafariCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#b77e24] hover:bg-[#c99034] transition-all duration-300 shadow-lg shadow-[#b77e24]/30 text-white px-4 py-2 rounded-full cursor-pointer"
      >
        <h2 className="text-lg"><T text="Find Your Safari" /></h2>
      </button>

      <TourSearch open={open} onClose={() => setOpen(false)} />

    </>
  );
}