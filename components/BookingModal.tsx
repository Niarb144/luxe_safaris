"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";

export default function BookingModal({
  open,
  onClose,
  tourId,
  tourTitle,
}: {
  open: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const t = useTranslations("bookingModal");

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

    if (!executeRecaptcha) {
      alert(t("errors.recaptchaUnavailable"));
      return;
    }

    setLoading(true);

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const recaptchaToken = await executeRecaptcha("booking_submit");

    const booking = {
      tour_id: tourId,
      full_name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      adults: Number(form.get("adults")),
      children_under_3: Number(form.get("children_under_3")),
      children_4_11: Number(form.get("children_4_11")),
      children_12_17: Number(form.get("children_12_17")),
      travel_date: form.get("travel_date"),
      special_requests: form.get("requests"),
      recaptchaToken,
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
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

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#041f0e] rounded-t-3xl sm:rounded-t-3xl shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#b77e24] font-semibold">
              {t("reserveYourSpot")}
            </p>
            <h2 className="text-white font-bold text-lg leading-tight mt-0.5">
              {t("bookSafari", { title: tourTitle })}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeForm")}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex-1">

          {submitted ? (
            // Success state
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#041f0e] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#b77e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{t("success.title")}</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                {t("success.message")}
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#b77e24] hover:bg-[#a06d1f] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer"
              >
                {t("success.done")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t("form.fullName")}
                </label>
                <input
                  name="name"
                  required
                  placeholder={t("form.fullNamePlaceholder")}
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t("form.email")}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={t("form.emailPlaceholder")}
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t("form.phone")}
                </label>
                <input
                  name="phone"
                  placeholder={t("form.phonePlaceholder")}
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Adults */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t("form.adults")}
                </label>
                <input
                  type="number"
                  name="adults"
                  min={1}
                  defaultValue={1}
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200"
                />
              </div>

              {/* Children — age-group breakdown */}
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  {t("form.children")}
                </legend>

                <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">

                  {/* Under 3 — Free */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {t("form.childrenUnder3.label")}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                        {t("form.childrenUnder3.pricing")}
                      </p>
                    </div>
                    <input
                      type="number"
                      name="children_under_3"
                      min={0}
                      defaultValue={0}
                      className="w-20 border border-gray-200 bg-white focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-2.5 rounded-xl text-gray-800 text-sm text-center transition-all duration-200 shrink-0"
                    />
                  </div>

                  {/* Ages 4–11 — 40% off */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {t("form.children4to11.label")}
                      </p>
                      <p className="text-xs text-[#b77e24] font-semibold mt-0.5">
                        {t("form.children4to11.pricing")}
                      </p>
                    </div>
                    <input
                      type="number"
                      name="children_4_11"
                      min={0}
                      defaultValue={0}
                      className="w-20 border border-gray-200 bg-white focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-2.5 rounded-xl text-gray-800 text-sm text-center transition-all duration-200 shrink-0"
                    />
                  </div>

                  {/* Ages 12–17 — 17% off */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {t("form.children12to17.label")}
                      </p>
                      <p className="text-xs text-[#b77e24] font-semibold mt-0.5">
                        {t("form.children12to17.pricing")}
                      </p>
                    </div>
                    <input
                      type="number"
                      name="children_12_17"
                      min={0}
                      defaultValue={0}
                      className="w-20 border border-gray-200 bg-white focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-2.5 rounded-xl text-gray-800 text-sm text-center transition-all duration-200 shrink-0"
                    />
                  </div>

                </div>
              </fieldset>

              {/* Travel Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {t("form.travelDate")}
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
                  {t("form.specialRequests")}
                </label>
                <textarea
                  name="requests"
                  rows={3}
                  placeholder={t("form.specialRequestsPlaceholder")}
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b77e24] focus:ring-2 focus:ring-[#b77e24]/20 outline-none p-3 rounded-xl text-gray-800 text-sm transition-all duration-200 resize-none"
                />
              </div>

              {/* Actions */}
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
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.confirmBooking")
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-semibold text-sm transition-colors duration-200 cursor-pointer"
                >
                  {t("form.cancel")}
                </button>
              </div>

              <p className="text-gray-500 text-xs text-center">
                Protected by reCAPTCHA &mdash;{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                &amp;{" "}
                <Link
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                apply.
              </p>

            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}