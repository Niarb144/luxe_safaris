"use client";

import { useTranslations } from "next-intl";

export default function TourRoute({ routes }: any) {
  const t = useTranslations("tourDetails");

  if (!routes?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("route")}</h2>

      {routes.map((route: any) => (
        <div key={route.id}>
          {route.map_url.includes("google.com") ? (
            <iframe
              src={route.map_url}
              className="w-full h-80 rounded-xl"
            />
          ) : (
            <img
              src={route.map_url}
              className="w-full h-80 object-cover rounded-xl"
            />
          )}
        </div>
      ))}
    </div>
  );
}