'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  FaShieldAlt,
  FaFileInvoice,
  FaCompass,
  FaLock,
  FaGlobeAfrica,
  FaCertificate,
  FaHandsHelping,
  FaFileContract,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';
import WhyChooseLuxeSafaris from '@/components/WhyChooseUs';

const ACCENT = '#B98A3E';

/* ----------------------------------------------------------------------- */
/* FAQ accordion item                                                      */
/* ----------------------------------------------------------------------- */

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base sm:text-lg text-gray-800">{question}</span>
        <FaChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: ACCENT }}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed sm:text-base text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Page                                                                     */
/* ----------------------------------------------------------------------- */

export default function BookingConfidence() {
  const t = useTranslations('BookingConfidence');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pillars = [
    { key: 'secure', icon: FaShieldAlt },
    { key: 'transparent', icon: FaFileInvoice },
    { key: 'unforgettable', icon: FaCompass },
  ] as const;

  const steps = ['step1', 'step2', 'step3', 'step4'] as const;
  const stepNumbers = ['01', '02', '03', '04'];

  const badges = [
    { key: 'encrypted', icon: FaLock },
    { key: 'gdpr', icon: FaGlobeAfrica },
    { key: 'licensed', icon: FaCertificate },
    { key: 'support', icon: FaHandsHelping },
    { key: 'refund', icon: FaFileContract },
  ] as const;

  const faqs = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const;

  return (
    <main className="bg-neutral-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[60vh] bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/images/img1.webp')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 text-center max-w-4xl px-6 py-12">
          {/* <span
            className="inline-block mb-4 text-xs uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            {t('hero.eyebrow')}
          </span> */}

          <h1 className="text-5xl mb-4 mt-8">{t('hero.title')}</h1>

          <p className="text-lg text-gray-200 mb-8">{t('hero.subtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              {t('hero.ctaPrimary')}
              <FaArrowRight className="h-4 w-4" />
            </Link>
            
             <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.key}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-7"
              >
                <div className="text-3xl mb-4" style={{ color: ACCENT }}>
                  <Icon />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {t(`pillars.${p.key}.title`)}
                </h3>
                <p className="text-gray-600 leading-7">{t(`pillars.${p.key}.body`)}</p>
              </div>
            );
          })}
        </div>

        {/* HOW IT WORKS */}
        <div id="how-it-works" className="bg-white rounded-3xl shadow p-8 mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">{t('process.title')}</h2>
          <p className="text-gray-600 mb-10">{t('process.subtitle')}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-start gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  {stepNumbers[i]}
                </div>
                <h4 className="font-bold text-lg text-gray-800">{t(`process.${s}.title`)}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{t(`process.${s}.body`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROTECTION BADGES */}
        <div className="bg-white rounded-3xl shadow p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t('badges.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.key} className="flex flex-col items-center gap-3 text-center">
                  <Icon className="h-6 w-6" style={{ color: ACCENT }} />
                  <span className="text-xs sm:text-sm text-gray-600 leading-snug">
                    {t(`badges.${b.key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('faq.title')}</h2>
          <div>
            {faqs.map((f, i) => (
              <FaqItem
                key={f}
                question={t(`faq.${f}.q`)}
                answer={t(`faq.${f}.a`)}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* CLOSING CTA */}
        <div
          className="rounded-3xl shadow p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: '#14201A' }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{t('cta.title')}</h2>
            <p className="text-gray-300 max-w-md">{t('cta.body')}</p>
          </div>
          <Link
            href="/custom-safari"
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            {t('cta.button')}
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <WhyChooseLuxeSafaris />

    </main>
  );
}