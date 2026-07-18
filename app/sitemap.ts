import { MetadataRoute } from "next";

const baseUrl = "https://www.luxeplainsafricasafaris.com";

const locales = [
  "en",
  "fr",
  "de",
  "es",
  "it",
  "ja",
  "ar",
  "zh",
  "ru",
  "pt",
  "nl",
  "pl",
];

const pages = [
  "",
  "/tours",
  "/destinations",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}