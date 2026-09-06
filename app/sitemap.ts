import type { MetadataRoute } from "next";
import { BASE_URL, OG_IMAGE } from "./lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${BASE_URL}${OG_IMAGE}`],
    },
    {
      url: `${BASE_URL}/sitemap.html`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];
}
