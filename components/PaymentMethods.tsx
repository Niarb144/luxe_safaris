'use client';

/**
 * Payment Methods
 * ----------------
 * Explains the three ways a Luxe Plains Africa Safaris guest can pay:
 * M-Pesa Paybill, bank transfer to Stanbic Bank, and card payment.
 *
 * Visual system matches components/booking-confidence/BookingConfidence.tsx
 * (same savanna-dusk palette + serif/mono pairing) so the two trust-adjacent
 * pages feel like one family. If you build a third page like this, it's
 * worth pulling INK/BG/PANEL/IVORY out into a shared lib/theme.ts.
 *
 * Static UI copy lives in next-intl under the "PaymentMethods" namespace
 * (see messages/payment-methods.en.json — merge into your en.json, then
 * run your existing translate-messages.mjs to backfill the other locales).
 *
 * ACTION REQUIRED before shipping — edit PAYMENT_DETAILS below:
 *  - M-Pesa Paybill number
 *  - Stanbic Bank account name, account number, branch and SWIFT/BIC code
 *  - Confirm which card brands and currencies you actually accept
 * These are real financial details, so deliberately left as placeholders
 * rather than guessed — wrong digits here send a client's money astray.
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Smartphone,
  Landmark,
  CreditCard,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

const INK = '#B98A3E';
const BG = '#14201A';
const PANEL = '#1C2A20';
const IVORY = '#F2EDE3';

/* ----------------------------------------------------------------------- */
/* EDIT ME: real payment details                                           */
/* ----------------------------------------------------------------------- */

const PAYMENT_DETAILS = {
  mpesa: {
    paybill: '400xxxx', // e.g. "400200"
    accountHint: 'Your booking reference, e.g. LPA-2306', 
    logo: '/images/mpesa.png'
  },
  bank: {
    bankName: 'Stanbic Bank Kenya',
    accountName: 'ACOUNT NAMEXXXX', // e.g. "Luxe Plains Africa Safaris Ltd"
    accountNumber: 'ACCOUNT NUMBERXXXX',
    branch: 'BRANCHXXXX',
    swiftCode: 'SWIFT BIC XXXX', // Stanbic Bank Kenya's SWIFT/BIC — confirm with your relationship manager
    currency: 'ACCEPTED CURRENCIES', // e.g. "USD and KES"
    logo: '/images/stanbic.jpg',
  },
  card_logo: {
    visa: '/images/visa.png',
    mastercard: '/images/mastecard.jpg'
  },
  cards: ['Visa', 'Mastercard'], // edit to match what your gateway actually supports
};

/* ----------------------------------------------------------------------- */
/* Motion helper                                                           */
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
/* Copy-to-clipboard field — the signature interaction on this page        */
/* ----------------------------------------------------------------------- */

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fall back to manual select, no-op here.
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
      style={{ borderColor: `${IVORY}1A`, backgroundColor: BG }}
    >
      <div className="min-w-0">
        <p
          className="font-[family-name:var(--font-mono,monospace)] text-[10px] uppercase tracking-[0.18em]"
          style={{ color: `${IVORY}66` }}
        >
          {label}
        </p>
        <p
          className="truncate font-[family-name:var(--font-mono,monospace)] text-sm sm:text-base"
          style={{ color: IVORY }}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        className="flex-shrink-0 rounded-full p-2 transition-colors duration-200 hover:bg-white/5"
      >
        {copied ? (
          <Check className="h-4 w-4" style={{ color: INK }} />
        ) : (
          <Copy className="h-4 w-4" style={{ color: `${IVORY}99` }} />
        )}
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Payment method card                                                     */
/* ----------------------------------------------------------------------- */

function PaymentMethodCard({
  icon: Icon,
  title,
  body,
  delay,
  children,
}: {
  icon: typeof Smartphone;
  title: string;
  body: string;
  delay: number;
  children: React.ReactNode;
}) {
  const fade = useFadeUp(delay);
  return (
    <motion.div
      {...fade}
      className="flex flex-col rounded-2xl border p-7 sm:p-8"
      style={{ backgroundColor: PANEL, borderColor: `${IVORY}1A` }}
    >
      <div
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-dashed"
        style={{ borderColor: `${INK}80` }}
      >
        <Icon className="h-5 w-5" style={{ color: INK }} />
      </div>
      <h3
        className="mb-2 font-[family-name:var(--font-serif,serif)] text-xl leading-snug sm:text-2xl"
        style={{ color: IVORY }}
      >
        {title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed sm:text-base" style={{ color: `${IVORY}B3` }}>
        {body}
      </p>
      <div className="mt-auto flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/* FAQ accordion item (same pattern as Booking With Confidence)            */
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

export default function PaymentMethods() {
  const t = useTranslations('PaymentMethods');
  const heroFade = useFadeUp(0.1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const mpesaSteps = ['step1', 'step2', 'step3', 'step4', 'step5'] as const;
  const faqs = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6'] as const;

  const comparisonRows = [
    {
      method: t('compare.mpesa.method'),
      time: t('compare.mpesa.time'),
      currency: t('compare.mpesa.currency'),
      bestFor: t('compare.mpesa.bestFor'),
    },
    {
      method: t('compare.bank.method'),
      time: t('compare.bank.time'),
      currency: t('compare.bank.currency'),
      bestFor: t('compare.bank.bestFor'),
    },
    {
      method: t('compare.card.method'),
      time: t('compare.card.time'),
      currency: t('compare.card.currency'),
      bestFor: t('compare.card.bestFor'),
    },
  ];

  return (
    <main style={{ backgroundColor: BG }} className="overflow-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-6 pb-16 pt-24 sm:pb-20 sm:pt-32 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(${IVORY} 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-6 sm:items-center sm:text-center">
          <motion.span
            {...heroFade}
            className="font-[family-name:var(--font-mono,monospace)] text-xs uppercase tracking-[0.3em]"
            style={{ color: INK }}
          >
            {t('hero.eyebrow')}
          </motion.span>

          <motion.h1
            {...useFadeUp(0.2)}
            className="font-[family-name:var(--font-serif,serif)] text-4xl leading-[1.05] sm:text-6xl"
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

          <motion.div {...useFadeUp(0.4)}>
            <Link
              href="/booking-with-confidence"
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
              style={{ color: INK }}
            >
              <ShieldCheck className="h-4 w-4" />
              {t('hero.securityLink')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Payment method cards                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-20 sm:pb-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* M-Pesa */}
          <PaymentMethodCard icon={Smartphone} title={t('mpesa.title')} body={t('mpesa.body')} delay={0}>
           <div className="inline-block rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-green-400/40 hover:shadow-lg hover:scale-[1.03]">
                <Image
                    src={PAYMENT_DETAILS.mpesa.logo}
                    alt="MPesa Logo"
                    width={320}
                    height={200}
                />
            </div>
            <CopyField label={t('mpesa.paybillLabel')} value={PAYMENT_DETAILS.mpesa.paybill} />
            <p className="text-xs leading-relaxed" style={{ color: `${IVORY}80` }}>
              {t('mpesa.accountHintLabel')}:{' '}
              <span style={{ color: `${IVORY}B3` }}>{PAYMENT_DETAILS.mpesa.accountHint}</span>
            </p>
            <ol className="mt-2 flex flex-col gap-2">
              {mpesaSteps.map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-xs sm:text-sm" style={{ color: `${IVORY}99` }}>
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-mono,monospace)] text-[10px]"
                    style={{ border: `1px solid ${INK}80`, color: IVORY }}
                  >
                    {i + 1}
                  </span>
                  {t(`mpesa.${s}`)}
                </li>
              ))}
            </ol>
          </PaymentMethodCard>

          {/* Bank transfer */}
          <PaymentMethodCard icon={Landmark} title={t('bank.title')} body={t('bank.body')} delay={0.12}>
            <div className="inline-block rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-blue-400/40 hover:shadow-lg hover:scale-[1.03]">
                <Image
                    src={PAYMENT_DETAILS.bank.logo}
                    alt="Stanbic Logo"
                    width={320}
                    height={200}
                />
            </div>
            <CopyField label={t('bank.bankNameLabel')} value={PAYMENT_DETAILS.bank.bankName} />
            <CopyField label={t('bank.accountNameLabel')} value={PAYMENT_DETAILS.bank.accountName} />
            <CopyField label={t('bank.accountNumberLabel')} value={PAYMENT_DETAILS.bank.accountNumber} />
            <CopyField label={t('bank.branchLabel')} value={PAYMENT_DETAILS.bank.branch} />
            <CopyField label={t('bank.swiftLabel')} value={PAYMENT_DETAILS.bank.swiftCode} />
            <p className="mt-1 text-xs leading-relaxed" style={{ color: `${IVORY}80` }}>
              {t('bank.note', { currency: PAYMENT_DETAILS.bank.currency })}
            </p>
          </PaymentMethodCard>

          {/* Card */}
          <PaymentMethodCard icon={CreditCard} title={t('card.title')} body={t('card.body')} delay={0.24}>
            <div className="flex items-center gap-6">
                <div className="inline-block rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-red-400/40 hover:shadow-lg hover:scale-[1.03]">
                    <Image
                    src={PAYMENT_DETAILS.card_logo.mastercard}
                    alt="Mastercard Logo"
                    width={100}
                    height={100}
                    />
                </div>

                <div className="inline-block rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-blue-400/40 hover:shadow-lg hover:scale-[1.03]">
                    <Image
                    src={PAYMENT_DETAILS.card_logo.visa}
                    alt="Visa Logo"
                    width={100}
                    height={100}
                    />
                </div>
                </div>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_DETAILS.cards.map((card) => (
                <span
                  key={card}
                  className="rounded-md border px-3 py-1.5 font-[family-name:var(--font-mono,monospace)] text-[11px] uppercase tracking-[0.1em]"
                  style={{ borderColor: `${IVORY}26`, color: `${IVORY}CC` }}
                >
                  {card}
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: `${IVORY}80` }}>
              {t('card.note')}
            </p>
          </PaymentMethodCard>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Comparison table                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 pb-20 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            {...useFadeUp(0)}
            className="mb-8 font-[family-name:var(--font-serif,serif)] text-2xl sm:text-3xl"
            style={{ color: IVORY }}
          >
            {t('compare.title')}
          </motion.h2>
          <motion.div
            {...useFadeUp(0.1)}
            className="overflow-x-auto rounded-2xl border"
            style={{ borderColor: `${IVORY}1A` }}
          >
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr style={{ backgroundColor: PANEL }}>
                  {[
                    t('compare.headMethod'),
                    t('compare.headTime'),
                    t('compare.headCurrency'),
                    t('compare.headBestFor'),
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-[family-name:var(--font-mono,monospace)] text-[11px] font-normal uppercase tracking-[0.15em]"
                      style={{ color: `${IVORY}80` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.method} className="border-t" style={{ borderColor: `${IVORY}14` }}>
                    <td className="px-5 py-4 font-medium" style={{ color: IVORY }}>
                      {row.method}
                    </td>
                    <td className="px-5 py-4" style={{ color: `${IVORY}B3` }}>
                      {row.time}
                    </td>
                    <td className="px-5 py-4" style={{ color: `${IVORY}B3` }}>
                      {row.currency}
                    </td>
                    <td className="px-5 py-4" style={{ color: `${IVORY}B3` }}>
                      {row.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
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
            href="/contact"
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: INK, color: BG }}
          >
            <MessageCircle className="h-4 w-4" />
            {t('cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}