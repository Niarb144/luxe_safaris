import { supabase } from "@/lib/supabase";
import TourLayout from "@/components/tour/TourLayout";

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    console.error("Invalid slug:", slug);
    return <div>Invalid tour slug</div>;
  }

  const { data, error } = await supabase
    .from("tours")
    .select(`
        *,
        tour_images(*),
        tour_itinerary(*),
        tour_highlights(*),
        tour_inclusions(*),
        tour_exclusions(*),
        tour_route_maps(*),
        tour_faqs(*),

        tour_holiday_types(
            holiday_types(
                id,
                name
            )
        )
    `)
    .eq("slug", slug)
    .single();

     // RELATED TOURS
  const { data: relatedTours } = await supabase
    .from("tours")
    .select(`
      *,
      id,
      title,
      location,
      tour_images(image_url),
      slug
    `)
    .eq("location", data.location)
    .neq("id", data.id)
    .limit(3);

  const mainImage =
    data?.tour_images?.find((img: any) => img.is_main === true)
      ?.image_url || "/images/img4.jpg";

    if (error || !data) {
      console.error(error);
      return <div>Tour not found</div>;
    }

  return (
    <TourLayout 
      tour={data} 
      mainImage={mainImage}
      relatedTours={relatedTours} 
    />);
}