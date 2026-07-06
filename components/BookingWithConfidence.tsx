'use client';

/**
 * Booking With Confidence
 * ------------------------
 * Trust/conversion page for Luxe Plains Africa Safaris explaining that a
 * booking is secure, transparent and built to deliver an unforgettable trip.
 *
 * Visual direction: a "field permit" — the visual language of a travel
 * document / ranger permit / ink stamp, since the page's whole job is to
 * make a booking feel official and protected. Deep savanna-dusk palette
 * instead of the usual cream+terracotta safari default.
 *
 * Static UI copy lives in next-intl under the "BookingConfidence" namespace
 * (see messages/booking-confidence.en.json — merge into your en.json, then
 * run your existing translate-messages.mjs to backfill the other locales).
 *
 * TODO before shipping:
 *  - Swap the deposit %, balance-due window and any operator licence/
 *    association details in messages/booking-confidence.en.json for your
 *    real figures (search "TODO" in that file).
 *  - Optional: wire the hero background to a real Cloudinary image.
 *  - Optional: add Fraunces / Inter / JetBrains Mono via next/font/google
 *    in app/layout.tsx for the full type pairing — the page degrades
 *    gracefully to system serif/sans/mono without it.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Compass,
  ChevronDown,
  Globe2,
  HeartHandshake,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';

const INK = '#B98A3E'; // brass/ink accent
const BG = '#14201A'; // dusk savanna ground
const PANEL = '#1C2A20'; // slightly raised panel
const IVORY = '#F2EDE3';

/* ----------------------------------------------------------------------- */
/* Motion helpers                                                          */
/* ----------------------------------------------------------------------- */

function useFadeUp(delay = 0) {
  const reduceMotion = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return {
    initial: 'hidden',
    whileInView: 'show',
    viewport: { once: true, margin: '-80px' },
    variants,
  } as const;
}

/* ----------------------------------------------------------------------- */
/* Signature element: the ink stamp                                       */
/* ----------------------------------------------------------------------- */

function Stamp({
  line1,
  line2,
  size = 152,
  className = '',
}: {
  line1: string;
  line2: string;
  size?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8, rotate: -22 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
      className={`relative flex flex-shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full border-[3px] border-dashed"
        style={{ borderColor: `${INK}99` }}
      />
      <div
        className="absolute inset-[10px] rounded-full border"
        style={{ borderColor: `${INK}66` }}
      />
      <div className="flex flex-col items-center justify-center gap-1 px-3 text-center">
        <ShieldCheck className="h-5 w-5" style={{ color: INK }} />
        <span
          className="font-[family-name:var(--font-mono,monospace)] text-[10px] font-semibold uppercase tracking-[0.25em]"
          style={{ color: IVORY }}
        >
          {line1}
        </span>
        <span
          className="font-[family-name:var(--font-mono,monospace)] text-[9px] uppercase tracking-[0.18em]"
          style={{ color: `${IVORY}99` }}
        >
          {line2}
        </span>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* Trust pillar ("manifest entry") card                                    */
/* ----------------------------------------------------------------------- */

function TrustPillar({
  icon: Icon,
  tag,
  title,
  body,
  delay,
}: {
  icon: typeof ShieldCheck;
  tag: string;
  title: string;
  body: string;
  delay: number;
}) {
  const fade = useFadeUp(delay);
  return (
    <motion.div
      {...fade}
      className="group relative rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[0.4deg] sm:p-8"
      style={{ backgroundColor: PANEL, borderColor: `${IVORY}1A` }}
    >
      <div
        className="absolute left-7 top-0 h-px w-10 -translate-y-px sm:left-8"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${INK}, ${INK} 4px, transparent 4px, transparent 8px)`,
        }}
      />
      <div className="mb-6 flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed"
          style={{ borderColor: `${INK}80` }}
        >
          <Icon className="h-5 w-5" style={{ color: INK }} />
        </div>
        <span
          className="font-[family-name:var(--font-mono,monospace)] text-xs tracking-[0.2em]"
          style={{ color: `${IVORY}66` }}
        >
          {tag}
        </span>
      </div>
      <h3
        className="mb-3 font-[family-name:var(--font-serif,serif)] text-xl leading-snug sm:text-2xl"
        style={{ color: IVORY }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed sm:text-base" style={{ color: `${IVORY}B3` }}>
        {body}
      </p>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* Process step                                                            */
/* ----------------------------------------------------------------------- */

function ProcessStep({
  index,
  title,
  body,
  delay,
  isLast,
}: {
  index: string;
  title: string;
  body: string;
  delay: number;
  isLast: boolean;
}) {
  const fade = useFadeUp(delay);
  return (
    <motion.div {...fade} className="relative flex flex-1 flex-col items-start gap-4 sm:items-center sm:text-center">
      <div className="flex items-center gap-4 sm:w-full sm:flex-col sm:gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 font-[family-name:var(--font-mono,monospace)] text-sm"
          style={{ borderColor: INK, color: IVORY }}
        >
          {index}
        </div>
        {!isLast && (
          <div
            className="h-px w-full flex-1 sm:absolute sm:left-1/2 sm:top-6 sm:-z-10 sm:w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${INK}80, ${INK}80 4px, transparent 4px, transparent 9px)`,
            }}
          />
        )}
      </div>
      <div className="sm:px-2">
        <h4 className="mb-1 font-[family-name:var(--font-serif,serif)] text-lg" style={{ color: IVORY }}>
          {title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: `${IVORY}99` }}>
          {body}
        </p>
      </div>
    </motion.div>
  );
}

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
    <div className="border-b" style={{ borderColor: `${IVORY}1A` }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base sm:text-lg" style={{ color: IVORY }}>
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: INK }}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed sm:text-base" style={{ color: `${IVORY}99` }}>
            {answer}
          </p>
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
  const heroFade = useFadeUp(0.1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pillars = [
    { key: 'secure', icon: ShieldCheck, tag: 'SEC' },
    { key: 'transparent', icon: FileCheck2, tag: 'TRN' },
    { key: 'unforgettable', icon: Compass, tag: 'EXP' },
  ] as const;

  const steps = ['step1', 'step2', 'step3', 'step4'] as const;
  const stepNumbers = ['01', '02', '03', '04'];

  const badges = [
    { key: 'encrypted', icon: Lock },
    { key: 'gdpr', icon: Globe2 },
    { key: 'licensed', icon: BadgeCheck },
    { key: 'support', icon: HeartHandshake },
    { key: 'refund', icon: FileCheck2 },
  ] as const;

  const faqs = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const;

  return (
    <main style={{ backgroundColor: BG }} className="overflow-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-6 pb-20 pt-24 sm:pb-28 sm:pt-32 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(${IVORY} 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-10 sm:items-center sm:text-center">
          <motion.span
            {...heroFade}
            className="font-[family-name:var(--font-mono,monospace)] text-xs uppercase tracking-[0.3em]"
            style={{ color: INK }}
          >
            {t('hero.eyebrow')}
          </motion.span>

          <motion.h1
            {...useFadeUp(0.2)}
            className="font-[family-name:var(--font-serif,serif)] text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
            style={{ color: IVORY }}
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            {...useFadeUp(0.3)}
            className="max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: `${IVORY}B3` }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div {...useFadeUp(0.4)} className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ backgroundColor: INK, color: BG }}
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3 text-sm font-medium transition-colors duration-200 hover:bg-white/5"
              style={{ borderColor: `${IVORY}40`, color: IVORY }}
            >
              {t('hero.ctaSecondary')}
            </a>
          </motion.div>

          <Stamp line1={t('hero.stampLine1')} line2={t('hero.stampLine2')} className="mt-4" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Trust pillars                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-20 sm:pb-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <TrustPillar
              key={p.key}
              icon={p.icon}
              tag={p.tag}
              title={t(`pillars.${p.key}.title`)}
              body={t(`pillars.${p.key}.body`)}
              delay={i * 0.12}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How booking works                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section id="how-it-works" className="scroll-mt-24 px-6 pb-20 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div {...useFadeUp(0)} className="mb-14 max-w-2xl sm:mb-16">
            <h2
              className="mb-3 font-[family-name:var(--font-serif,serif)] text-3xl sm:text-4xl"
              style={{ color: IVORY }}
            >
              {t('process.title')}
            </h2>
            <p className="text-sm sm:text-base" style={{ color: `${IVORY}99` }}>
              {t('process.subtitle')}
            </p>
          </motion.div>
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-4">
            {steps.map((s, i) => (
              <ProcessStep
                key={s}
                index={stepNumbers[i]}
                title={t(`process.${s}.title`)}
                body={t(`process.${s}.body`)}
                delay={i * 0.12}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Protection badges                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-20 sm:pb-28 lg:px-8">
        <div
          className="mx-auto max-w-6xl rounded-2xl border px-6 py-10 sm:px-10 sm:py-12"
          style={{ backgroundColor: PANEL, borderColor: `${IVORY}1A` }}
        >
          <motion.h2
            {...useFadeUp(0)}
            className="mb-8 text-center font-[family-name:var(--font-serif,serif)] text-2xl sm:text-3xl"
            style={{ color: IVORY }}
          >
            {t('badges.title')}
          </motion.h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
            {badges.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.key}
                  {...useFadeUp(i * 0.08)}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <Icon className="h-6 w-6" style={{ color: INK }} />
                  <span className="text-xs leading-snug sm:text-sm" style={{ color: `${IVORY}B3` }}>
                    {t(`badges.${b.key}`)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-20 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            {...useFadeUp(0)}
            className="mb-8 font-[family-name:var(--font-serif,serif)] text-2xl sm:text-3xl"
            style={{ color: IVORY }}
          >
            {t('faq.title')}
          </motion.h2>
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
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-28 lg:px-8">
        <motion.div
          {...useFadeUp(0)}
          className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border px-8 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12"
          style={{ backgroundColor: PANEL, borderColor: `${IVORY}1A` }}
        >
          <div>
            <h2
              className="mb-2 font-[family-name:var(--font-serif,serif)] text-2xl sm:text-3xl"
              style={{ color: IVORY }}
            >
              {t('cta.title')}
            </h2>
            <p className="max-w-md text-sm sm:text-base" style={{ color: `${IVORY}99` }}>
              {t('cta.body')}
            </p>
          </div>
          <Link
            href="/custom-safari"
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: INK, color: BG }}
          >
            {t('cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}