import { supabase } from "@/lib/supabase";
import TourLayout from "@/components/tour/TourLayout";

export default async function TourPage({ params }: any) {
  const { id } = params;

  const { data, error } = await supabase
    .from("tours")
    .select(`
        *,
        tour_images (*),
        tour_itinerary (*),
        tour_inclusions (*),
        tour_route_maps (*)
    `)
    .eq("id", id)
    .single();

    if (error || !data) {
    console.log(error);
    return <div className="text-white p-10">Tour not found</div>;
    }

    return <TourLayout tour={data} />;
}