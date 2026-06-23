"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-[#8A6830]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 h-3 text-[#8A6830] group-hover:text-[#B98A3E] transition-colors flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// All sections in order for the TOC and rendering
const tocSections = [
  "informationWeCollect",
  "whyWeCollect",
  "cookies",
  "thirdParties",
  "userRights",
];

const listSections: [string, number][] = [
  ["informationWeCollect", 7],
  ["whyWeCollect", 5],
];

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicy");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionStyle = (i: number): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(12px)",
    transition: "opacity 0.45s ease, transform 0.45s ease",
    transitionDelay: `${i * 40}ms`,
  });

  return (
    <main className="min-h-screen bg-[#14201A] text-[#F2EDE3]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        {/* ── Hero ── */}
        <header className="border-b border-[#B98A3E]/20 pb-10 mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#B98A3E] bg-[#B98A3E]/10 border border-[#B98A3E]/30 px-4 py-1.5 rounded-full mb-6">
            <ShieldIcon />
            {t("eyebrow", { defaultValue: "Privacy" })}
          </div>

          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 tracking-tight">
            {t("titlePrefix", { defaultValue: "Privacy" })}{" "}
            <span className="text-[#B98A3E]">
              {t("titleAccent", { defaultValue: "Policy" })}
            </span>
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#C8C2B5]">
            <CalendarIcon />
            {t("lastUpdated")}
          </div>
        </header>

        {/* ── Table of contents ── */}
        <nav
          aria-label="Table of contents"
          className="bg-[#1C2E25] border border-[#B98A3E]/20 rounded-xl p-6 mb-14"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-widest uppercase text-[#8A6830] mb-4">
            <ListIcon />
            {t("contentsLabel", { defaultValue: "Contents" })}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {tocSections.map((key) => (
              <li key={key}>
                <button
                  onClick={() => scrollTo(`section-${key}`)}
                  className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#C8C2B5] hover:text-[#B98A3E] hover:bg-[#B98A3E]/[0.07] transition-colors duration-150 group"
                >
                  <ChevronIcon />
                  {t(`${key}.title`)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Sections ── */}
        <div className="divide-y divide-[#B98A3E]/15">

          {/* List sections */}
          {listSections.map(([key, count], i) => (
            <section
              key={key}
              id={`section-${key}`}
              ref={(el) => { sectionRefs.current[i] = el; }}
              className="py-8"
              style={sectionStyle(i)}
            >
              <div className="flex items-start gap-4">
                <div
                  aria-hidden="true"
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B98A3E]/12 border border-[#B98A3E]/25 flex items-center justify-center text-xs font-medium text-[#B98A3E] mt-0.5"
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-medium text-[#F2EDE3] mb-3">
                    {t(`${key}.title`)}
                  </h2>
                  <ul className="space-y-2.5">
                    {Array.from({ length: count }).map((_, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[15px] text-[#C8C2B5] leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#B98A3E] mt-2.5"
                        />
                        {t(`${key}.items.${idx}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}

          {/* Cookies */}
          <section
            id="section-cookies"
            ref={(el) => { sectionRefs.current[2] = el; }}
            className="py-8"
            style={sectionStyle(2)}
          >
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B98A3E]/12 border border-[#B98A3E]/25 flex items-center justify-center text-xs font-medium text-[#B98A3E] mt-0.5"
              >
                3
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium text-[#F2EDE3] mb-3">
                  {t("cookies.title")}
                </h2>
                <p className="text-[15px] text-[#C8C2B5] leading-relaxed">
                  {t("cookies.text")}
                </p>
              </div>
            </div>
          </section>

          {/* Third parties */}
          <section
            id="section-thirdParties"
            ref={(el) => { sectionRefs.current[3] = el; }}
            className="py-8"
            style={sectionStyle(3)}
          >
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B98A3E]/12 border border-[#B98A3E]/25 flex items-center justify-center text-xs font-medium text-[#B98A3E] mt-0.5"
              >
                4
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium text-[#F2EDE3] mb-3">
                  {t("thirdParties.title")}
                </h2>
                <p className="text-[15px] text-[#C8C2B5] leading-relaxed">
                  {t("thirdParties.text")}
                </p>
              </div>
            </div>
          </section>

          {/* User rights */}
          <section
            id="section-userRights"
            ref={(el) => { sectionRefs.current[4] = el; }}
            className="py-8"
            style={sectionStyle(4)}
          >
            <div className="flex items-start gap-4">
              <div
                aria-hidden="true"
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B98A3E]/12 border border-[#B98A3E]/25 flex items-center justify-center text-xs font-medium text-[#B98A3E] mt-0.5"
              >
                5
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium text-[#F2EDE3] mb-3">
                  {t("userRights.title")}
                </h2>
                <ul className="space-y-2.5">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[15px] text-[#C8C2B5] leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#B98A3E] mt-2.5"
                      />
                      {t(`userRights.items.${idx}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* ── Footer note ── */}
        <div className="mt-16 pt-10 border-t border-[#B98A3E]/20 text-center">
          <p className="text-sm text-[#8A6830]">
            {t("footerNote", {
              defaultValue:
                "Your data is handled with care. For any privacy concerns, please contact us directly.",
            })}
          </p>
        </div>

      </div>
    </main>
  );
}