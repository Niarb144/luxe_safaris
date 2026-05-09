"use client";

import { useState } from "react";
import SafariQuizModal from "./QuizModal";

export default function SafariCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#b77e24] hover:bg-[#a06d1f] transition text-white px-6 py-3 rounded-full cursor-pointer"
      >
        Find Your Safari
      </button>

      <SafariQuizModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}