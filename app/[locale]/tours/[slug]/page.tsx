import { supabase } from "@/lib/supabase";
import TourLayout from "@/components/tour/TourLayout";
import { applyTranslation, applySubRecordTranslations } from "@/lib/translations";

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;

  if (!slug || slug === "undefined") {
    console.error("Invalid slug:", slug);
    return <div>Invalid tour slug</div>;
  }

  const { data, error } = await supabase
    .from("tours")
    .select(`
      *,
      tour_destinations(
          destination_id,
          destinations(id, name)
      ),
      tour_images(*),
      tour_itinerary(*),
      tour_highlights(*),
      tour_inclusions(*),
      tour_exclusions(*),
      tour_route_maps(*),
      tour_faqs(*),
      tour_holiday_types(
          holiday_types(id, name)
      ),
      tour_pricing(
          id,
          season,
          persons,
          price,
          currency,
          classification
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(error);
    return <div>Tour not found</div>;
  }

  // ── Translate the main tour record ──────────────────────────────────────────
  const translatedTour = await applyTranslation(
    'tours',
    data,
    ['title', 'description', 'duration', 'why_choose_safari'],
    locale
  )

  // ── Translate sub-records in parallel ───────────────────────────────────────
  const [
    translatedItinerary,
    translatedHighlights,
    translatedInclusions,
    translatedExclusions,
    translatedFaqs,
    translatedPricing,
  ] = await Promise.all([
    applySubRecordTranslations(data.tour_itinerary ?? [], 'tour_itinerary', ['title', 'description'], locale),
    applySubRecordTranslations(data.tour_highlights ?? [], 'tour_highlights', ['title', 'description'], locale),
    applySubRecordTranslations(data.tour_inclusions ?? [], 'tour_inclusions', ['item'], locale),
    applySubRecordTranslations(data.tour_exclusions ?? [], 'tour_exclusions', ['item'], locale),
    applySubRecordTranslations(data.tour_faqs ?? [], 'tour_faqs', ['question', 'answer'], locale),
    applySubRecordTranslations(data.tour_pricing ?? [], 'tour_pricing', ['classification', 'season'], locale),
  ])

  // ── Accommodations ───────────────────────────────────────────────────────────
  const destinationIds =
    data.tour_destinations?.map((d: any) => d.destination_id) || [];

  let accommodations: any[] = [];

  if (destinationIds.length) {
    const { data: accommodationData } = await supabase
      .from("accommodations")
      .select(`*, destinations(id, name)`)
      .in("destination_id", destinationIds);

    // Translate accommodations
    accommodations = await applySubRecordTranslations(
      accommodationData ?? [],
      'accommodations',
      ['accommodation_type', 'classification', 'description', 'hotel_name', 'location'],
      locale
    )
  }

  // ── Related Tours ─────────────────────────────────────────────────────────
  const { data: relatedToursData } = await supabase
    .from("tour_destinations")
    .select(`tours(id, title, slug, tour_images(image_url))`)
    .in("destination_id", destinationIds)
    .neq("tour_id", data.id)
    .limit(3);

  const relatedTours =
    relatedToursData?.map((item) => item.tours).filter(Boolean) || [];

  // Main Image
  const mainImage =
    data?.tour_images?.find((img: any) => img.is_main === true)?.image_url ||
    "/images/img4.jpg";

  return (
    <TourLayout
      tour={{
        ...translatedTour,
        tour_itinerary: translatedItinerary,
        tour_highlights: translatedHighlights,
        tour_inclusions: translatedInclusions,
        tour_exclusions: translatedExclusions,
        tour_faqs: translatedFaqs,
        tour_pricing: translatedPricing,
      }}
      mainImage={mainImage}
      relatedTours={relatedTours}
      accommodations={accommodations}
      pricing={translatedPricing}
    />
  );
}