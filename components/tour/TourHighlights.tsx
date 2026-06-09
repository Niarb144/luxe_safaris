"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { T } from "../T";

export default function TourHighlights({ items }: any) {
  const [expanded, setExpanded] = useState<number | null>(
    null
  );

  if (!items?.length) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        <T text="Tour Highlights" />
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {items.map((highlight: any, index: number) => {

          const Icon =
            (Icons[
              highlight.icon as keyof typeof Icons
            ] as LucideIcon) || Icons.Star;

          const isExpanded = expanded === index;

          return (
            <div
              key={highlight.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition"
            >

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">

                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#b77e24]" />
                </div>

                <h3 className="text-xl font-semibold text-[#b77e24]">
                  <T text={highlight.title} />
                </h3>

              </div>

              {/* Description */}
              <div className="text-gray-600 leading-relaxed">

                <p
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? ""
                      : "line-clamp-3"
                  }`}
                >
                  <T text={highlight.description} />
                </p>

                {/* Read More */}
                {highlight.description.length > 120 && (
                  <button
                    onClick={() =>
                      setExpanded(
                        isExpanded ? null : index
                      )
                    }
                    className="mt-3 text-[#b77e24] font-medium hover:underline"
                  >
                    {isExpanded
                      ? <T text="Read Less" />
                      : <T text="Read More" />}
                  </button>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}