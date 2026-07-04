import { supabase } from "@/lib/supabase";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";
import ContactCard from "@/components/ContactCard";
import DestinationGallery from "@/components/DestinationGallery";
import SafeImage from "@/components/SafeImage";
import { getTranslations } from "next-intl/server";
import { applyTranslation, applySubRecordTranslations } from "@/lib/translations";

const FALLBACK_HERO_IMAGE = "/images/img4.jpg";
const FALLBACK_TOUR_IMAGE = "/images/img4.jpg";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("destinationDetail");

  const { data: destinationData, error: destinationError } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (destinationError || !destinationData) {
    console.error("Destination not found:", destinationError);
    return null;
  }

  // Translate the destination record itself
  const destination = await applyTranslation(
    "destinations",
    destinationData,
    ["name", "description", "country"],
    locale
  );

  const destinationId = destinationData.id;

  // ── Related tours (with main image resolution) ─────────────────────────────
  const { data: relatedToursRaw, error: relatedToursError } = await supabase
    .from("tour_destinations")
    .select(
      `
      tours (
        id,
        title,
        tagline,
        slug,
        price,
        tour_images (
          image_url,
          is_main
        )
      )
    `
    )
    .eq("destination_id", destinationId);

  if (relatedToursError) {
    console.error("Failed to load related tours:", relatedToursError);
  }

  const rawRelatedTours =
    relatedToursRaw?.map((item) => item.tours).filter(Boolean) ?? [];

  // Dedupe by tour id — guards against duplicate rows in the
  // tour_destinations junction table (e.g. from a delete-then-insert
  // save that silently only inserted due to a missing DELETE RLS policy).
  const dedupedRelatedTours = Array.from(
    new Map(rawRelatedTours.map((tour: any) => [tour.id, tour])).values()
  );

  // Translate related tour titles
  const translatedRelatedTours = await applySubRecordTranslations(
    dedupedRelatedTours,
    "tours",
    ["title"],
    locale
  );

  // Resolve a single main image per tour — mirrors the pattern used in TourPage
  const relatedTours = translatedRelatedTours.map((tour: any) => {
    const mainImage =
      tour.tour_images?.find((img: any) => img.is_main === true)
        ?.image_url || FALLBACK_TOUR_IMAGE;

    return { ...tour, mainImage };
  });

  // ── Facts / Highlights / Images ─────────────────────────────────────────────
  const [
    { data: rawFacts, error: factsError },
    { data: rawHighlights, error: highlightsError },
    { data: images, error: imagesError },
  ] = await Promise.all([
    supabase
      .from("destination_facts")
      .select("*")
      .eq("destination_id", destinationId),
    supabase
      .from("destination_highlights")
      .select("*")
      .eq("destination_id", destinationId),
    supabase
      .from("destination_images")
      .select("*")
      .eq("destination_id", destinationId)
      .order("id", { ascending: true }),
  ]);

  if (factsError) console.error("Failed to load destination facts:", factsError);
  if (highlightsError)
    console.error("Failed to load destination highlights:", highlightsError);
  if (imagesError)
    console.error("Failed to load destination images:", imagesError);

  // Translate facts and highlights
  const [facts, highlights] = await Promise.all([
    applySubRecordTranslations(
      rawFacts ?? [],
      "destination_facts",
      ["fact"],
      locale
    ),
    applySubRecordTranslations(
      rawHighlights ?? [],
      "destination_highlights",
      ["highlight"],
      locale
    ),
  ]);

  // ── Hero image resolution ────────────────────────────────────────────────
  // NOTE: destination_images currently has no `is_main` column, so this falls
  // back to array order (first row = hero). Once `is_main` is added to
  // destination_images, swap this for the same `.find(is_main)` pattern used
  // for tours below, for consistency and to remove the ordering dependency.
  const heroImage = images?.[0]?.image_url || FALLBACK_HERO_IMAGE;

  // Remaining images (excluding hero) feed the gallery
  const galleryImages = images && images.length > 1 ? images.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900">
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[620px] overflow-hidden">
        <SafeImage
          src={heroImage}
          fallbackSrc={FALLBACK_HERO_IMAGE}
          alt={destination.name || ""}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="max-w-3xl">
              {destination.country && (
                <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                  {destination.country}
                </p>
              )}

              {destination.name && (
                <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight">
                  {destination.name}
                </h1>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Description */}
        {destination.description && (
          <section className="prose max-w-none">
            <h2 className="text-4xl font-semibold leading-tight mb-6">
              {t("about")}{" "}
              <span className="text-[#b77e24]">{destination.name}</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {destination.description}
            </p>
          </section>
        )}

        {/* GALLERY */}
        {galleryImages.length > 0 && (
          <section>
            <DestinationGallery
              images={galleryImages}
              alt={destination.name || "Destination photo"}
            />
          </section>
        )}

        {/* HIGHLIGHTS */}
        {highlights && highlights.length > 0 && (
          <section className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                {t("experience")}
              </p>

              <h2 className="text-4xl font-semibold leading-tight">
                {t("destinationHighlights")}
              </h2>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
              {highlights.map((item: any, index: number) => (
                <div key={item.id} className="space-y-4">
                  <span className="text-4xl text-gray-300 font-light">
                    0{index + 1}
                  </span>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {item.highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FACTS */}
        {facts && facts.length > 0 && (
          <section className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                {t("information")}
              </p>

              <h2 className="text-4xl font-semibold">{t("quickFacts")}</h2>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {facts.map((fact: any) => (
                <div key={fact.id} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-black mt-3" />
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {fact.fact}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MAP */}
        {destination.map_url && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                {t("explore")}
              </p>

              <h2 className="text-4xl font-semibold">{t("location")}</h2>
            </div>

            <div className="overflow-hidden rounded-[32px] shadow-xl">
              <iframe
                src={destination.map_url}
                className="w-full h-[500px]"
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* RELATED TOURS */}
        {relatedTours.length > 0 && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                {t("safaris")}
              </p>

              <h2 className="text-4xl font-semibold">
                {t("toursIn", { name: destination.name })}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedTours.map((tour: any) => (
                <a
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group relative overflow-hidden rounded-[28px] h-[380px] shadow-sm hover:shadow-xl transition duration-300"
                >
                  <SafeImage
                    src={tour.mainImage}
                    fallbackSrc={FALLBACK_TOUR_IMAGE}
                    alt={tour.title || ""}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="relative h-full flex flex-col justify-end p-6 space-y-2">
                    <h3 className="text-2xl font-semibold text-white group-hover:opacity-90 transition">
                      {tour.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-snug line-clamp-2">
                      {tour.tagline}
                    </p>

                    {tour.price ? (
                      <p className="text-lg font-medium text-white/90">
                        {t("from")} ${tour.price}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-[#e8c98a]">
                        {t("getQuote")}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <WhyChooseLuxeSafaris />
      <ContactCard />
    </div>
  );
}