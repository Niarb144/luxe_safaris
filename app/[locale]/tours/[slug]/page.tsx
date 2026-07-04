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
    translatedHolidayTypes,
  ] = await Promise.all([
    applySubRecordTranslations(data.tour_itinerary ?? [], 'tour_itinerary', ['title', 'description'], locale),
    applySubRecordTranslations(data.tour_highlights ?? [], 'tour_highlights', ['title', 'description'], locale),
    applySubRecordTranslations(data.tour_inclusions ?? [], 'tour_inclusions', ['item'], locale),
    applySubRecordTranslations(data.tour_exclusions ?? [], 'tour_exclusions', ['item'], locale),
    applySubRecordTranslations(data.tour_faqs ?? [], 'tour_faqs', ['question', 'answer'], locale),
    applySubRecordTranslations(data.tour_pricing ?? [], 'tour_pricing', ['classification', 'season'], locale),
    applySubRecordTranslations(
    data.tour_holiday_types?.map((t: any) => t.holiday_types).filter(Boolean) ?? [],
      'holiday_types',
      ['name'],
      locale
    ),
  ])

  // Re-attach translated holiday_types back into the join shape
  const translatedTourHolidayTypes = (data.tour_holiday_types ?? []).map(
    (join: any) => ({
      ...join,
      holiday_types: translatedHolidayTypes.find(
        (ht: any) => ht.id === join.holiday_types?.id
      ) ?? join.holiday_types,
    })
  );

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
  const { data: relatedToursData, error: relatedToursError } = await supabase
    .from("tour_destinations")
    .select(`
      tours (
        id,
        title,
        slug,
        price,
        tagline,
        tour_images (
          image_url,
          is_main
        )
      )
    `)
    .in("destination_id", destinationIds)
    .neq("tour_id", data.id)
    .limit(3);

  if (relatedToursError) {
    console.error("Failed to load related tours:", relatedToursError);
  }

  const rawRelatedTours =
    relatedToursData?.map((item) => item.tours).filter(Boolean) || [];

  // Dedupe by tour id — guards against duplicate rows in the
  // tour_destinations junction table (e.g. from a delete-then-insert
  // save that silently only inserted due to a missing DELETE RLS policy).
  const dedupedRelatedTours = Array.from(
    new Map(rawRelatedTours.map((tour: any) => [tour.id, tour])).values()
  );

  // Translate related tour titles/taglines, consistent with the rest of the page
  const relatedTours = await applySubRecordTranslations(
    dedupedRelatedTours,
    "tours",
    ["title", "tagline"],
    locale
  );

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
        tour_holiday_types: translatedTourHolidayTypes,
      }}
      mainImage={mainImage}
      relatedTours={relatedTours}
      accommodations={accommodations}
      pricing={translatedPricing}
    />
  );
}