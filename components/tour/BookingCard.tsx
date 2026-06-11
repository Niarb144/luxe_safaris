"use client";

import { useState } from "react";
import BookingModal from "../BookingModal";

export default function BookingCard({ tour }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-20 h-fit pt-10">

      <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg space-y-4">

        <h2 className="text-2xl font-bold text-[#b77e24]">
          <span className="text-lg font-normal text-gray-400">
            From {" "}
          </span>
           ${tour.price}
          <span className="text-sm text-gray-400">
            {" "} / person
          </span>
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="
            bg-[#b77e24]
            text-white
            px-6 py-3
            rounded-full
            w-full
            cursor-pointer
            hover:bg-[#b77e24]/80
            transition
          "
        >
          Book Now
        </button>

        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          tourId={tour.id}
          tourTitle={tour.title}
        />

        <a
          href={`https://wa.me/254XXXXXXXXX?text=I want to book ${tour.title}`}
          target="_blank"
          className="
            block
            text-center
            border
            border-[#b77e24]
            text-[#b77e24]
            py-3
            rounded-xl
          "
        >
          WhatsApp Inquiry
        </a>

      </div>

    </div>
  );
}