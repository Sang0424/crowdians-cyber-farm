import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crowdians.com";
const locales = ["en", "ko", "ja"];
const routes = ["", "/b2b"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const alternates = locales.reduce(
      (acc, locale) => {
        acc[locale] = `${BASE_URL}/${locale}${route}`;
        return acc;
      },
      {} as Record<string, string>,
    );

    return {
      url: `${BASE_URL}/en${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: alternates,
      },
    };
  });
}
