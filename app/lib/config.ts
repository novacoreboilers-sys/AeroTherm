import type { Metadata } from "next";

export const BASE_URL = "https://aerothermengineering.com";

export const seoMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AeroTherm Engineering | Industrial Engineering & Energy Solutions",
    template: "%s | AeroTherm Engineering",
  },
  description:
    "AeroTherm Engineering delivers industrial engineering, boiler solutions, automation, instrumentation, industrial chemicals, biomass fuel, coal trading, EPC services, and inspection across Pakistan.",
  keywords: [
    "AeroTherm Engineering",
    "boiler inspection",
    "boiler manufacturing",
    "turbine inspection",
    "pressure vessel manufacturing",
    "industrial fabrication",
    "EPC solutions",
    "engineering consultancy",
    "industrial chemicals Pakistan",
    "PLC SCADA automation Pakistan",
    "biomass fuel supply Pakistan",
    "imported coal supplier Pakistan",
    "local coal bulk supply",
  ],
  authors: [{ name: "AeroTherm Engineering" }],
  creator: "AeroTherm Engineering",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "AeroTherm Engineering",
    title: "AeroTherm Engineering | Industrial Engineering & Energy Solutions",
    description:
      "Engineering, automation, industrial chemical supply and sustainable biomass energy solutions for industry.",
    images: [
      {
        url: "/assets/hero_1.png",
        width: 1200,
        height: 630,
        alt: "AeroTherm Engineering industrial solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTherm Engineering | Industrial Engineering & Energy Solutions",
    description:
      "Engineering, automation, industrial chemical supply and sustainable biomass energy solutions for industry.",
    images: ["/assets/hero_1.png"],
  },
};
