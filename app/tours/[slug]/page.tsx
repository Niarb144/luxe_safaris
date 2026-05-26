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
    tour_destinations(
        destination_id,

        destinations(
            id,
            name
        )
    ),

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

  // ACCOMMODATIONS
  const destinationIds =
    data.tour_destinations?.map(
    (d:any)=>
    d.destination_id
    ) || [];


    let accommodations = [];

    if(destinationIds.length){

    const { data: accommodationData } = await supabase
      .from("accommodations")
      .select(`
          *,
          destinations(
            id,
            name
          )
      `)
      .in(
          "destination_id",
          destinationIds
      );

    accommodations = accommodationData || [];

    }


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
      accommodations={accommodations}
    />);
}