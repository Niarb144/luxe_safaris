"use client";

import { useState } from "react";
import SafariQuizModal from "./QuizModal";

export default function SafariCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-orange-500 text-white px-6 py-3 rounded-full cursor-pointer"
      >
        Find Your Safari
      </button>

      <SafariQuizModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}