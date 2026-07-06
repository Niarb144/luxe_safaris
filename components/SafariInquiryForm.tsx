"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Globe,
  MapPin,
  Users,
  Star,
  Send,
  ChevronDown,
  X,
  Check,
  Loader2,
} from "lucide-react";
import {
  COUNTRY_DIAL_CODES,
  DESTINATION_OPTIONS,
  HOLIDAY_TYPES,
  ACCOMMODATION_CLASSIFICATIONS,
  COUNTRIES,
} from "@/lib/country-codes";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
interface FormState {
  full_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  destinations: string[];
  country: string;
  holiday_type: string;
  adults: number;
  children_0_3: number;
  children_4_11: number;
  children_12_17: number;
  classification: string;
}

const INITIAL: FormState = {
  full_name:      "",
  email:          "",
  country_code:   "+44",
  mobile_number:  "",
  destinations:   [],
  country:        "",
  holiday_type:   "",
  adults:         2,
  children_0_3:   0,
  children_4_11:  0,
  children_12_17: 0,
  classification: "",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sub-components (defined outside main to avoid re-creating on each render)  */
/* ─────────────────────────────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#B98A3E] mb-2">
      {children}
      {required && <span className="ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-500">{msg}</p>;
}

function inputClass(hasError?: boolean) {
  return [
    "w-full bg-white border rounded-lg px-4 py-3 text-[#14201A] placeholder:text-[#14201A]/30",
    "focus:outline-none focus:ring-2 focus:ring-[#B98A3E]/40 focus:border-[#B98A3E] transition-all duration-200 text-sm",
    hasError ? "border-red-400" : "border-[#e8e2d9] hover:border-[#B98A3E]/50",
  ].join(" ");
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#e8e2d9]">
      <div className="w-7 h-7 rounded-full bg-[#14201A] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#B98A3E]" />
      </div>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#14201A]/50">
        {title}
      </h3>
    </div>
  );
}

function GuestStepper({
  label, sublabel, value, onChange, min = 0, max = 20,
}: {
  label: string; sublabel?: string; value: number;
  onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#e8e2d9] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#14201A]">{label}</p>
        {sublabel && <p className="text-xs text-[#6b7a6e] mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-[#e8e2d9] flex items-center justify-center
                     text-[#B98A3E] hover:border-[#B98A3E] hover:bg-[#B98A3E]/5
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-lg leading-none"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold text-[#14201A]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-[#e8e2d9] flex items-center justify-center
                     text-[#B98A3E] hover:border-[#B98A3E] hover:bg-[#B98A3E]/5
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main component                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function SafariInquiryForm() {
  const t = useTranslations("safariInquiry");
  const s = useTranslations("shared");

  const [form, setForm]         = useState<FormState>(INITIAL);
  const [errors, setErrors]     = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [apiError, setApiError] = useState("");

  const [dialOpen, setDialOpen]     = useState(false);
  const [dialSearch, setDialSearch] = useState("");
  const [destOpen, setDestOpen]     = useState(false);
  const [destSearch, setDestSearch] = useState("");

  const dialRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) setDialOpen(false);
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const clearError = (key: keyof FormState) =>
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.full_name.trim())                              e.full_name      = t("errors.fullNameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))    e.email          = t("errors.emailInvalid");
    if (!form.mobile_number.trim())                          e.mobile_number  = t("errors.mobileRequired");
    if (form.destinations.length === 0)                      e.destinations   = t("errors.destinationsRequired");
    if (!form.country)                                       e.country        = t("errors.countryRequired");
    if (!form.holiday_type)                                  e.holiday_type   = t("errors.holidayTypeRequired");
    if (!form.classification)                                e.classification = t("errors.classificationRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    setApiError("");
    try {
      const res  = await fetch("/api/safari-inquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err: any) {
      setApiError(err.message ?? "Unexpected error. Please try again.");
      setStatus("error");
    }
  }

  const filteredDial = COUNTRY_DIAL_CODES.filter((c) =>
    `${c.name} ${c.dial}`.toLowerCase().includes(dialSearch.toLowerCase())
  );
  const selectedDial = COUNTRY_DIAL_CODES.find((c) => c.dial === form.country_code);
  const filteredDest = DESTINATION_OPTIONS.filter((d) =>
    d.toLowerCase().includes(destSearch.toLowerCase())
  );

  const totalGuests = form.adults + form.children_0_3 + form.children_4_11 + form.children_12_17;
  const destCount   = form.destinations.length;

  /* ── Success ─────────────────────────────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-full bg-[#14201A] flex items-center justify-center mb-6">
          <Check className="w-7 h-7 text-[#B98A3E]" />
        </div>
        <h2 className="text-2xl font-serif text-[#14201A] mb-3">
          {t("success.title")}
        </h2>
        <p className="text-[#6b7a6e] max-w-sm text-sm leading-relaxed">
          {t("success.message", { firstName: form.full_name.split(" ")[0] })}
        </p>
        <button
          type="button"
          onClick={() => { setForm(INITIAL); setStatus("idle"); }}
          className="mt-8 px-6 py-2.5 border border-[#14201A]/20 text-[#14201A] text-sm rounded-lg
                     hover:bg-[#14201A]/5 transition-colors duration-200"
        >
          {t("success.reset")}
        </button>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-10">

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={User} title={t("sections.yourDetails")} />
          <div className="space-y-4">

            {/* Full name */}
            <div>
              <FieldLabel required>{t("fields.fullName.label")}</FieldLabel>
              <input
                type="text"
                placeholder={t("fields.fullName.placeholder")}
                value={form.full_name}
                onChange={(e) => { set("full_name", e.target.value); clearError("full_name"); }}
                className={inputClass(!!errors.full_name)}
              />
              <FieldError msg={errors.full_name} />
            </div>

            {/* Email */}
            <div>
              <FieldLabel required>{t("fields.email.label")}</FieldLabel>
              <input
                type="email"
                placeholder={t("fields.email.placeholder")}
                value={form.email}
                onChange={(e) => { set("email", e.target.value); clearError("email"); }}
                className={inputClass(!!errors.email)}
              />
              <FieldError msg={errors.email} />
            </div>

            {/* Mobile with dial code */}
            <div>
              <FieldLabel required>{t("fields.mobile.label")}</FieldLabel>
              <div className="flex gap-2">
                {/* Dial code picker */}
                <div className="relative flex-shrink-0" ref={dialRef}>
                  <button
                    type="button"
                    onClick={() => setDialOpen((o) => !o)}
                    className={[
                      "flex items-center gap-2 h-full px-3 py-3 rounded-lg border text-sm",
                      "bg-white text-[#14201A] hover:border-[#B98A3E]/50 transition-colors duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-[#B98A3E]/40 focus:border-[#B98A3E]",
                      errors.mobile_number ? "border-red-400" : "border-[#e8e2d9]",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none">{selectedDial?.flag}</span>
                    <span className="text-[#14201A]/60 text-xs">{form.country_code}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#14201A]/30 transition-transform ${dialOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dialOpen && (
                    <div className="absolute z-50 mt-1 left-0 w-64 bg-white border border-[#e8e2d9] rounded-xl shadow-xl overflow-hidden">
                      <div className="p-2 border-b border-[#e8e2d9]">
                        <input
                          type="text"
                          placeholder={t("dialCode.searchPlaceholder")}
                          value={dialSearch}
                          onChange={(e) => setDialSearch(e.target.value)}
                          className="w-full bg-[#f9f7f4] border border-[#e8e2d9] rounded-lg px-3 py-2 text-xs
                                     text-[#14201A] placeholder:text-[#14201A]/30 focus:outline-none
                                     focus:ring-1 focus:ring-[#B98A3E]/40"
                        />
                      </div>
                      <ul className="max-h-52 overflow-y-auto">
                        {filteredDial.map((c) => (
                          <li key={c.code}>
                            <button
                              type="button"
                              onClick={() => { set("country_code", c.dial); setDialOpen(false); setDialSearch(""); }}
                              className={[
                                "w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors duration-100",
                                form.country_code === c.dial
                                  ? "bg-[#B98A3E]/10 text-[#B98A3E]"
                                  : "text-[#14201A]/70 hover:bg-[#f9f7f4]",
                              ].join(" ")}
                            >
                              <span className="text-base">{c.flag}</span>
                              <span className="flex-1 truncate">{c.name}</span>
                              <span className="text-[#14201A]/35">{c.dial}</span>
                            </button>
                          </li>
                        ))}
                        {filteredDial.length === 0 && (
                          <li className="px-4 py-3 text-xs text-[#14201A]/35 text-center">
                            {t("dialCode.noResults")}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  placeholder={t("fields.mobile.placeholder")}
                  value={form.mobile_number}
                  onChange={(e) => { set("mobile_number", e.target.value); clearError("mobile_number"); }}
                  className={`${inputClass(!!errors.mobile_number)} flex-1`}
                />
              </div>
              <FieldError msg={errors.mobile_number} />
            </div>

            {/* Country */}
            <div>
              <FieldLabel required>{t("fields.country.label")}</FieldLabel>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#14201A]/25 pointer-events-none" />
                <select
                  value={form.country}
                  onChange={(e) => { set("country", e.target.value); clearError("country"); }}
                  className={`${inputClass(!!errors.country)} pl-10 appearance-none cursor-pointer`}
                >
                  <option value="" disabled>{t("fields.country.placeholder")}</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#14201A]/25 pointer-events-none" />
              </div>
              <FieldError msg={errors.country} />
            </div>
          </div>
        </section>

        {/* ── Trip Preferences ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={MapPin} title={t("sections.tripPreferences")} />
          <div className="space-y-4">

            {/* Destinations */}
            <div>
              <FieldLabel required>{t("fields.destinations.label")}</FieldLabel>
              <div className="relative" ref={destRef}>
                <button
                  type="button"
                  onClick={() => setDestOpen((o) => !o)}
                  className={[
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm bg-white text-left",
                    "focus:outline-none focus:ring-2 focus:ring-[#B98A3E]/40 focus:border-[#B98A3E] transition-all duration-150",
                    errors.destinations ? "border-red-400" : "border-[#e8e2d9] hover:border-[#B98A3E]/50 cursor-pointer",
                  ].join(" ")}
                >
                  <span className={destCount ? "text-[#14201A]" : "text-[#14201A]/30"}>
                    {destCount
                      ? t(
                          destCount === 1
                            ? "fields.destinations.selectedSingular"
                            : "fields.destinations.selectedPlural",
                          { count: destCount }
                        )
                      : t("fields.destinations.placeholder")}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#14201A]/30 transition-transform flex-shrink-0 ${destOpen ? "rotate-180" : ""}`} />
                </button>

                {destOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-[#e8e2d9] rounded-xl shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-[#e8e2d9]">
                      <input
                        type="text"
                        placeholder={t("fields.destinations.searchPlaceholder")}
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                        className="w-full bg-[#f9f7f4] border border-[#e8e2d9] rounded-lg px-3 py-2 text-xs
                                   text-[#14201A] placeholder:text-[#14201A]/30 focus:outline-none
                                   focus:ring-1 focus:ring-[#B98A3E]/40"
                      />
                    </div>
                    <ul className="max-h-52 overflow-y-auto">
                      {filteredDest.map((dest) => {
                        const selected = form.destinations.includes(dest);
                        return (
                          <li key={dest}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = selected
                                  ? form.destinations.filter((d) => d !== dest)
                                  : [...form.destinations, dest];
                                set("destinations", next);
                                clearError("destinations");
                              }}
                              className={[
                                "w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left transition-colors duration-100",
                                selected ? "text-[#B98A3E] bg-[#B98A3E]/5" : "text-[#14201A]/70 hover:bg-[#f9f7f4]",
                              ].join(" ")}
                            >
                              <span className={[
                                "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                                selected ? "bg-[#B98A3E] border-[#B98A3E]" : "border-[#e8e2d9]",
                              ].join(" ")}>
                                {selected && <Check className="w-2.5 h-2.5 text-white" />}
                              </span>
                              {dest}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {destCount > 0 && (
                      <div className="p-2 border-t border-[#e8e2d9]">
                        <button
                          type="button"
                          onClick={() => setDestOpen(false)}
                          className="w-full py-2 text-xs text-center text-[#B98A3E] hover:bg-[#B98A3E]/5 rounded-lg transition-colors cursor-pointer"
                        >
                          {t("fields.destinations.done", { count: destCount })}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {destCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.destinations.map((d) => (
                    <span
                      key={d}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                 bg-[#14201A]/5 border border-[#14201A]/10 text-xs text-[#14201A]/70"
                    >
                      {d}
                      <button
                        type="button"
                        onClick={() => set("destinations", form.destinations.filter((x) => x !== d))}
                        className="hover:text-[#B98A3E] transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <FieldError msg={errors.destinations} />
            </div>

            {/* Holiday type */}
            <div>
              <FieldLabel required>{t("fields.holidayType.label")}</FieldLabel>
              <div className="relative">
                <select
                  value={form.holiday_type}
                  onChange={(e) => { set("holiday_type", e.target.value); clearError("holiday_type"); }}
                  className={`${inputClass(!!errors.holiday_type)} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>{t("fields.holidayType.placeholder")}</option>
                  {HOLIDAY_TYPES.map((h) => 
                    <option key={h} value={h}>
                      {s(`holidayTypes.${h}`)}
                    </option>
                  )}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#14201A]/25 pointer-events-none" />
              </div>
              <FieldError msg={errors.holiday_type} />
            </div>
          </div>
        </section>

        {/* ── Guests ───────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={Users} title={t("sections.numberOfGuests")} />
          <div className="bg-[#f9f7f4] border border-[#e8e2d9] rounded-xl px-5 py-1">
            <GuestStepper
              label={t("guests.adults.label")}
              sublabel={t("guests.adults.sublabel")}
              value={form.adults}
              onChange={(v) => set("adults", v)}
              min={1}
            />
            <GuestStepper
              label={t("guests.infants.label")}
              sublabel={t("guests.infants.sublabel")}
              value={form.children_0_3}
              onChange={(v) => set("children_0_3", v)}
            />
            <GuestStepper
              label={t("guests.children.label")}
              sublabel={t("guests.children.sublabel")}
              value={form.children_4_11}
              onChange={(v) => set("children_4_11", v)}
            />
            <GuestStepper
              label={t("guests.juniors.label")}
              sublabel={t("guests.juniors.sublabel")}
              value={form.children_12_17}
              onChange={(v) => set("children_12_17", v)}
            />
          </div>
          <p className="mt-2 text-xs text-[#6b7a6e] text-right">
            {t("guests.total", { count: totalGuests })}
          </p>
        </section>

        {/* ── Accommodation ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={Star} title={t("sections.accommodation")} />
          <div className="grid grid-cols-2 gap-3">
            {ACCOMMODATION_CLASSIFICATIONS.map((ac) => {
              const active = form.classification === ac.value;
              return (
                <button
                  key={ac.value}
                  type="button"
                  onClick={() => { set("classification", ac.value); clearError("classification"); }}
                  className={[
                    "relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                    active
                      ? "border-[#B98A3E] bg-[#B98A3E]/5 shadow-[0_0_0_1px_rgba(185,138,62,0.25)]"
                      : "border-[#e8e2d9] bg-white hover:border-[#B98A3E]/40 hover:bg-[#f9f7f4]",
                  ].join(" ")}
                >
                  {active && (
                    <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#B98A3E] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  <span className={`text-sm font-semibold mb-1 ${active ? "text-[#B98A3E]" : "text-[#14201A]"}`}>
                    {s(`accommodationClassifications.${ac.value}.label`)}
                  </span>
                  <span className="text-[11px] leading-relaxed text-[#6b7a6e]">
                    {s(`accommodationClassifications.${ac.value}.description`)}
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError msg={errors.classification} />
        </section>

        {/* ── Submit ───────────────────────────────────────────────────────── */}
        {apiError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
            {apiError}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className={[
            "w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold cursor-pointer",
            "tracking-wide uppercase transition-all duration-200",
            status === "loading"
              ? "bg-[#14201A]/40 text-white/60 cursor-not-allowed"
              : "bg-[#14201A] text-white hover:bg-[#1e3024] hover:shadow-[0_4px_20px_rgba(20,32,26,0.2)]",
          ].join(" ")}
        >
          {status === "loading" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t("submit.loading")}</>
          ) : (
            <> {t("submit.label")}</>
          )}
        </button>

        <p className="text-center text-[11px] text-[#6b7a6e]">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}