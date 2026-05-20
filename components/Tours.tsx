"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ToursList() {
  const [tours, setTours] = useState<any[]>([]);
  const [active, setActive] = useState("All");

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const destination = searchParams.get("destination") || "";
  const duration = searchParams.get("duration") || "";
  const holidayType = searchParams.get("type") || "";

  useEffect(() => {
    async function fetchTours() {
      let query = supabase
        .from("tours")
        .select(`
          *,
          tour_images (
            image_url,
            is_main
          ),
          tour_holiday_types (
            holiday_types (
              id,
              name
            )
          ),
          tour_destinations (
            destinations (
              id,
              name
            )
          )
        `);

      const { data, error } = await query;

      if (error) {
        console.error(error);
        return;
      }

      const formatted = data.map((tour) => {
        const mainImage = tour.tour_images?.find(
          (img: any) => img.is_main
        );

        return {
          ...tour,

          coverImage:
            mainImage?.image_url ||
            "/images/logo.svg",

          holidayTypes:
            tour.tour_holiday_types?.map(
              (t: any) =>
                t.holiday_types?.name
            ) || [],

          destinations:
            tour.tour_destinations?.map(
              (d: any) =>
                d.destinations?.name
            ) || [],
        };
      });

      setTours(formatted);
    }

    fetchTours();
  }, []);



  // Existing location categories
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        tours.map(
          (tour) =>
            tour.location || "Other"
        )
      )
    );

    return ["All", ...unique];
  }, [tours]);



  const filteredTours = tours.filter((tour) => {

    // Existing location filter buttons
    const locationMatch =
      active === "All"
        ? true
        : tour.location === active;

    // Search by title
    const searchMatch =
      !search ||
      tour.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    // Destination filter
    const destinationMatch =
      !destination ||
      tour.destinations?.includes(
        destination
      );

    // Duration filter
    const durationMatch =
      !duration ||
      String(
        tour.duration
      ) === duration;

    // Holiday type filter
    const holidayMatch =
      !holidayType ||
      tour.holidayTypes?.includes(
        holidayType
      );

    return (
      locationMatch &&
      searchMatch &&
      destinationMatch &&
      durationMatch &&
      holidayMatch
    );
  });



  return (
    <section className="py-20 bg-[#f5f1ea] w-full min-h-screen">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#3b2a1d]">
            Explore Our Tours
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover unforgettable safari experiences
            across East Africa.
          </p>
        </div>


        {/* Existing category filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2 rounded-full border transition cursor-pointer ${
                active === cat
                  ? "bg-[#b77e24] text-white border-[#b77e24]"
                  : "border-[#b77e24] text-[#b77e24] hover:bg-[#b77e24] hover:text-white"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>



        {/* Cards */}
        <motion.div
          layout
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-8
          mt-14
          "
        >

          {filteredTours.map((tour) => (

            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="
              group
              relative
              overflow-hidden
              rounded-[32px]
              h-[400px]
              shadow-xl
              "
            >

              <div className="absolute inset-0">

                <Image
                  src={tour.coverImage}
                  alt={tour.title}
                  fill
                  className="
                  object-cover
                  group-hover:scale-110
                  transition
                  duration-700
                  "
                />

              </div>

              <div className="
              absolute inset-0
              bg-gradient-to-t
              from-[#041f0e]/80
              via-[#041f0e]/30
              to-[#041f0e]/10
              " />

              <div className="
              relative h-full
              flex flex-col
              justify-between
              p-7
              ">

                <div>

                  <span className="
                  text-white
                  uppercase
                  font-bold
                  text-sm
                  ">
                    {tour.location || "Safari"}
                  </span>

                </div>


                <div>

                  <h3 className="
                  text-white
                  text-2xl
                  font-extrabold
                  ">
                    {tour.title}
                  </h3>

                  <p className="
                  text-white/80
                  mt-4
                  line-clamp-2
                  text-sm
                  ">
                    {tour.description}
                  </p>

                  <div className="
                  flex
                  gap-4
                  mt-8
                  flex-wrap
                  ">

                    <div className="
                    rounded-2xl
                    px-5 py-2
                    backdrop-blur-md
                    bg-white/10
                    ">
                      <span className="
                      text-white
                      font-bold
                      ">
                        {tour.duration}
                      </span>
                    </div>

                    <div className="
                    bg-[#b77e24]
                    rounded-2xl
                    px-5 py-2
                    ">
                      <span className="
                      text-white
                      font-bold
                      ">
                        From ${tour.price}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </motion.div>


        {filteredTours.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No tours found matching your filters.
          </p>
        )}

      </div>

    </section>
  );
}