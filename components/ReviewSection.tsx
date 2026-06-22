"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ExternalLink, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "google" | "tripadvisor";

interface PlatformReview {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
  country?: string;
  platform: Platform;
  profileUrl?: string;
}

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  google: {
    label: "Google",
    color: "#4285F4",
    bgClass: "from-[#4285F4]/10",
    borderClass: "border-[#4285F4]/30",
    activeClass: "bg-[#4285F4] text-white",
    reviewUrl: "https://g.page/r/YOUR_GOOGLE_PLACE_ID/review", // ← replace
    profileUrl: "https://maps.google.com/?cid=YOUR_CID",       // ← replace
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  tripadvisor: {
    label: "Tripadvisor",
    color: "#34E0A1",
    bgClass: "from-[#34E0A1]/10",
    borderClass: "border-[#34E0A1]/30",
    activeClass: "bg-[#00AA6C] text-white",
    reviewUrl: "https://www.tripadvisor.com/YOUR_LISTING_URL#REVIEWS", // ← replace
    profileUrl: "https://www.tripadvisor.com/YOUR_LISTING_URL",        // ← replace
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <path
          fill="#34E0A1"
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c1.93 0 3.714.584 5.193 1.583A6.484 6.484 0 0 0 12 4.5zm0 0a6.484 6.484 0 0 0-5.193 1.583A9.456 9.456 0 0 1 12 4.5zm6.75 9a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-9 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"
        />
        <circle cx="15.75" cy="13.5" r="1.25" fill="#00AA6C" />
        <circle cx="8.25" cy="13.5" r="1.25" fill="#00AA6C" />
      </svg>
    ),
  },
} as const;

// ─── Fallback static reviews (shown while loading or on error) ────────────────

const STATIC_REVIEWS: Record<Platform, PlatformReview[]> = {
  google: [
    {
      id: "g1",
      // key: "review1",
      name: "Emily Carter",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "An extraordinary safari experience! The guides were incredibly knowledgeable and we saw the Big Five within the first two days. Luxe Plains truly delivers on its promise of luxury in the wild.",
      date: "March 2024",
      country: "United Kingdom",
      platform: "google",
    },
    {
      id: "g2",
      name: "David Mwangi",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "Absolutely world-class. From the moment we arrived, every detail was taken care of. The private game drives at sunrise were magical — something we will never forget.",
      date: "January 2024",
      country: "Kenya",
      platform: "google",
    },
    {
      id: "g3",
      name: "Sophia Martinez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "I've been on safaris across Africa, but Luxe Plains set a new standard. The attention to detail, the cuisine, and above all the wildlife encounters made this truly unforgettable.",
      date: "November 2023",
      country: "Spain",
      platform: "google",
    },
  ],
  tripadvisor: [
    {
      id: "t1",
      name: "James Whitfield",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "Rated #1 by us and our family! Luxe Plains arranged everything perfectly — flights, transfers, camp accommodation. The wildebeest migration was breathtaking. Cannot recommend highly enough.",
      date: "August 2024",
      country: "Australia",
      platform: "tripadvisor",
    },
    {
      id: "t2",
      name: "Marie Dupont",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "A truly five-star experience in every sense. Our ranger Thomas was exceptional — his tracking skills and passion for conservation made every game drive feel like a National Geographic special.",
      date: "June 2024",
      country: "France",
      platform: "tripadvisor",
    },
    {
      id: "t3",
      name: "Pieter van der Berg",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      text: "We celebrated our anniversary here and it exceeded every expectation. The staff prepared a surprise bush dinner under the stars — an evening we will cherish for the rest of our lives.",
      date: "April 2024",
      country: "Netherlands",
      platform: "tripadvisor",
    },
  ],
};

// ─── Star renderer ────────────────────────────────────────────────────────────

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          style={{ color: i <= rating ? color : "transparent" }}
          className={i <= rating ? "fill-current" : "fill-white/10 text-white/10"}
        />
      ))}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  index,
  platform,
}: {
  review: PlatformReview;
  index: number;
  platform: Platform;
}) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8
        hover:${config.borderClass} transition-all duration-500 flex flex-col`}
    >
      {/* Platform badge */}
      <div className="flex items-center justify-between mb-5">
        <StarRating rating={review.rating} color={config.color} />
        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          {config.icon}
          <span className="text-xs text-gray-400">{config.label}</span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-300 leading-relaxed mb-6 flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.image}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border-2"
            style={{ borderColor: `${config.color}40` }}
          />
          <div>
            <h4 className="text-white font-semibold leading-tight">{review.name}</h4>
            <p className="text-gray-400 text-sm">
              {review.country && `${review.country} · `}
              {review.date}
            </p>
          </div>
        </div>

        {review.profileUrl && (
          <a
            href={review.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={`View on ${config.label}`}
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      {/* Hover glow */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500
          bg-gradient-to-br ${config.bgClass} to-transparent pointer-events-none`}
      />
    </motion.div>
  );
}

// ─── Platform Toggle ──────────────────────────────────────────────────────────

function PlatformToggle({
  active,
  onChange,
}: {
  active: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1">
      {(["google", "tripadvisor"] as Platform[]).map((p) => {
        const config = PLATFORM_CONFIG[p];
        const isActive = active === p;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? config.activeClass + " shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {config.icon}
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Aggregate Rating Badge ───────────────────────────────────────────────────

function AggregateRating({
  platform,
  rating,
  count,
}: {
  platform: Platform;
  rating: string;
  count: string;
}) {
  const config = PLATFORM_CONFIG[platform];
  return (
    <a
      href={config.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border
        ${config.borderClass} bg-white/5 hover:bg-white/10 transition-all group`}
    >
      {config.icon}
      <span className="text-white font-semibold">{rating}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={12} style={{ color: config.color }} className="fill-current" />
        ))}
      </div>
      <span className="text-gray-400 text-sm">({count} reviews)</span>
      <ExternalLink size={12} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReviewsSection() {
  const t = useTranslations("reviews");
  const [platform, setPlatform] = useState<Platform>("google");
  const [reviews, setReviews] = useState<PlatformReview[]>(STATIC_REVIEWS.google);
  const [loading, setLoading] = useState(false);
  const [liveDataAvailable, setLiveDataAvailable] = useState(false);

  /**
   * Fetch reviews from your API route.
   *
   * Create `app/api/reviews/route.ts`:
   *
   *   export async function GET(req: Request) {
   *     const { searchParams } = new URL(req.url);
   *     const platform = searchParams.get("platform");
   *
   *     if (platform === "google") {
   *       // Google Places API
   *       const res = await fetch(
   *         `https://maps.googleapis.com/maps/api/place/details/json` +
   *         `?place_id=${process.env.GOOGLE_PLACE_ID}` +
   *         `&fields=reviews,rating,user_ratings_total` +
   *         `&key=${process.env.GOOGLE_PLACES_API_KEY}`
   *       );
   *       const data = await res.json();
   *       return Response.json(data.result);
   *     }
   *
   *     if (platform === "tripadvisor") {
   *       // Tripadvisor Content API
   *       const res = await fetch(
   *         `https://api.content.tripadvisor.com/api/v1/location/${process.env.TRIPADVISOR_LOCATION_ID}/reviews` +
   *         `?key=${process.env.TRIPADVISOR_API_KEY}&language=en`
   *       );
   *       const data = await res.json();
   *       return Response.json(data);
   *     }
   *
   *     return Response.json({ error: "Unknown platform" }, { status: 400 });
   *   }
   */
  const fetchReviews = useCallback(async (p: Platform) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?platform=${p}`);
      if (!res.ok) throw new Error("API not configured");
      const data = await res.json();

      // Normalise Google response
      if (p === "google" && data.reviews) {
        const mapped: PlatformReview[] = data.reviews
          .filter((r: any) => r.rating >= 4)
          .slice(0, 6)
          .map((r: any, i: number) => ({
            id: `g-live-${i}`,
            name: r.author_name,
            image: r.profile_photo_url || STATIC_REVIEWS.google[i % 3]?.image,
            rating: r.rating,
            text: r.text,
            date: new Date(r.time * 1000).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            }),
            platform: "google",
            profileUrl: r.author_url,
          }));
        setReviews(mapped);
        setLiveDataAvailable(true);
        return;
      }

      // Normalise Tripadvisor response
      if (p === "tripadvisor" && data.data) {
        const mapped: PlatformReview[] = data.data
          .slice(0, 6)
          .map((r: any, i: number) => ({
            id: `ta-live-${i}`,
            name: r.user?.username || "Traveller",
            image: r.user?.avatar?.thumbnail || STATIC_REVIEWS.tripadvisor[i % 3]?.image,
            rating: r.rating,
            text: r.text,
            date: new Date(r.published_date).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            }),
            platform: "tripadvisor",
            profileUrl: r.url,
          }));
        setReviews(mapped);
        setLiveDataAvailable(true);
        return;
      }

      throw new Error("Unexpected response shape");
    } catch {
      // Fall back gracefully to curated static reviews
      setReviews(STATIC_REVIEWS[p]);
      setLiveDataAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(platform);
  }, [platform, fetchReviews]);

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
  };

  const config = PLATFORM_CONFIG[platform];

  return (
    <section className="relative w-full py-24 px-6 bg-[#041f0e] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.4),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="uppercase tracking-[0.3em] text-amber-400 text-sm mb-3">
            {t("tagline")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* ── Aggregate ratings + write-a-review links ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <AggregateRating platform="google" rating="4.9" count="128" />
          <AggregateRating platform="tripadvisor" rating="5.0" count="84" />
        </motion.div>

        {/* ── Platform toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <PlatformToggle active={platform} onChange={handlePlatformChange} />

          {/* Refresh button (only once live data is available) */}
          {liveDataAvailable && (
            <button
              onClick={() => fetchReviews(platform)}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          )}

          {/* Write a review CTA */}
          <a
            href={config.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Star size={14} className="fill-amber-400" />
            Write a review
            <ExternalLink size={12} />
          </a>
        </motion.div>

        {/* ── Reviews grid ── */}
        <div className="relative min-h-[420px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={platform}
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0.3 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {reviews.slice(0, 3).map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                  platform={platform}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer: see all reviews link ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href={config.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10
              text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all"
          >
            {config.icon}
            See all reviews on {config.label}
            <ExternalLink size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}