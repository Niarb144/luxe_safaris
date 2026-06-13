"use client";

import { useTranslations } from "next-intl";

export default function TourItinerary({ items }: any) {
  const t = useTranslations("tourDetails");

  if (!items?.length) return null;

  const sorted = [...items].sort((a, b) => a.day - b.day);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {t("itinerary")}
      </h2>

      <div className="space-y-10">
        {Object.values(
          sorted.reduce((acc: any, item: any) => {
            if (!acc[item.day_number]) {
              acc[item.day_number] = {
                day: item.day,
                day_number: item.day_number,
                activities: [],
              };
            }

            acc[item.day_number].activities.push(item);

            return acc;
          }, {})
        ).map((group: any) => (
          <div key={group.day_number} className="flex gap-5 items-start">
            {/* Day Circle */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                {group.day}
              </div>
              <div className="w-px flex-1 bg-gray-300 mt-2"></div>
            </div>

            {/* Day Content */}
            <div className="flex-1">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("day", { number: group.day_number })}
                </h3>
              </div>

              <div className="space-y-4">
                {group.activities.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Time */}
                    <div className="mb-2">
                      <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                        {activity.start_time} - {activity.end_time}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-semibold text-gray-900">
                      {activity.title}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}