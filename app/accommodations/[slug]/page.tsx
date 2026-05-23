import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function AccommodationPage({
    params,
}:{
    params:Promise<{
        slug:string
    }>
}){

const { slug } = await params;


const { data: accommodation, error} = await supabase

    .from("accommodations")

    .select(`

    *,

    destinations(
        id,
        name
    )

    `)

    .eq(
    "slug",
    slug
    )

    .single();





if(error || !accommodation){

return(

<div className="
max-w-5xl
mx-auto
p-10
">

Accommodation not found

</div>

)

}


return(
    <div className = "min-h-screen bg-[#faf8f5] text-gray-900">
        {/* HERO */}
      <section className="relative h-[85vh] min-h-[620px] overflow-hidden">
        <img
          src={
            accommodation.images?.[0] ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          }
          alt={accommodation.hotel_name}
          className="w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* content */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="max-w-3xl">
              {accommodation.destinations?.name && (
                <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                  {accommodation.destinations?.name}
                </p>
              )}

              {accommodation.hotel_name && (
                <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight">
                  {accommodation.hotel_name}
                </h1>
              )}

              {accommodation.description && (
                <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl">
                  {accommodation.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

        <div className="max-w-7xl mx-auto px-6 py-10">


            <div className="mb-10">


            <div className="
            mt-4
            inline-block
            px-4
            py-2
            rounded-full
            bg-amber-100
            text-amber-700
            font-medium
            ">

            {accommodation.classification}

            </div>

            </div>



            {/* IMAGE GALLERY */}

            {accommodation.images?.length > 0 && (

            <div className="
            grid
            md:grid-cols-2
            gap-4
            mb-10
            ">

            {accommodation.images.map(
            (image:string,index:number)=>(

            <Image

            key={index}

            src={image}

            alt={
            accommodation.hotel_name
            }

            width={800}
            height={500}

            className="
            rounded-xl
            w-full
            h-72
            object-cover
            "

            />

            ))

            }

            </div>

            )}


            {/* AMENITIES */}

            <section className="mb-10">

            <h2 className="
            text-2xl
            font-semibold
            mb-4
            ">

            Amenities

            </h2>


            <div className="
            flex
            flex-wrap
            gap-3
            ">

            {accommodation.amenities?.map(
            (amenity:string)=>(

            <div

            key={amenity}

            className="
            px-4
            py-2
            bg-gray-100
            rounded-full
            "

            >

            {amenity}

            </div>

            ))

            }

            </div>

            </section>



            {/* LOCATION */}

            {accommodation.map_url && (

            <section className="mb-10">

            <h2 className="
            text-2xl
            font-semibold
            mb-4
            ">

            Location

            </h2>

            <iframe
                src={
                accommodation.map_url
                }
                className="w-full h-[400px] rounded-xl"
                loading="lazy"
            />

            </section>

            )}

        </div>
    </div>

)

}

