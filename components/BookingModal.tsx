"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export default function BookingModal({
  open,
  onClose,
  tourId,
}: {
  open: boolean;
  onClose: () => void;
  tourId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const booking = {
      tour_id: tourId,
      full_name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      adults: Number(form.get("adults")),
      children: Number(form.get("children")),
      travel_date: form.get("travel_date"),
      special_requests: form.get("requests"),
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSubmitted(true);

      // reset form
      e.currentTarget.reset();
    } catch (error: any) {
      alert(error.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || !open) return null;

  return createPortal(
    // Backdrop — clicking outside the panel fires onClose
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Modal panel */}
      <div
        ref={panelRef}
        className="relative bg-white w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
      >

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#041f0e] rounded-t-3xl sm:rounded-t-3xl shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#b77e24] font-semibold">
              Reserve Your Spot
            </p>
            <h2 className="text-white font-bold text-lg leading-tight mt-0.5">
              Book This Tour
            </h2>
          </div>

          {/* ── Close button ── */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking form"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-6 flex-1">

          {submitted ? (
            // Success state
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#041f0e] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#b77e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Booking Submitted!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Thank you for your request. Our team will be in touch shortly to confirm your safari.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#b77e24] hover:bg-[#a06d1f] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="+254 700 000 000"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Adults / Children */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="adults"
                    min={1}
                    defaultValue={1}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Children
                  </label>
                  <input
                    type="number"
                    name="children"
                    min={0}
                    defaultValue={0}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Travel Date
                </label>
                <input
                  type="date"
                  name="travel_date"
                  required
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Special Requests
                </label>
                <textarea
                  name="requests"
                  rows={3}
                  placeholder="Dietary needs, accessibility requirements, preferred activities..."
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200 resize-none"
                />
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#b77e24] hover:bg-[#a06d1f] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-semibold text-sm transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}