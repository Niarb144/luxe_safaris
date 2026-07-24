// app/sitemap.ts
import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl = "https://www.luxeplainsafricasafaris.com";

const locales = [
  "en", "fr", "de", "es", "it", "ja",
  "ar", "zh", "ru", "pt", "nl", "pl",
];

const staticPages = ["", "/tours", "/destinations", "/about", "/contact"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages
  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    });
  });

  // Dynamic tour pages
  const { data: tours } = await supabase
    .from("tours")
    .select("slug, updated_at");

  (tours ?? []).forEach((tour) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/tours/${tour.slug}`,
        lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });
  });

  // Dynamic destination pages
  const { data: destinations } = await supabase
    .from("destinations")
    .select("slug, updated_at");

  (destinations ?? []).forEach((dest) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
        lastModified: dest.updated_at ? new Date(dest.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });
  });

  return sitemapEntries;
}