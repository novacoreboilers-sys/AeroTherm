import type { Metadata } from "next";

export const BASE_URL = "https://aerothermengineering.com";
export const SITE_NAME = "AeroTherm Engineering";
export const SITE_DESCRIPTION =
  "AeroTherm Engineering delivers industrial engineering, boiler solutions, automation, instrumentation, industrial chemicals, biomass fuel, coal trading, EPC services, and inspection across Pakistan.";
export const OG_IMAGE = "/assets/ogimage.png";
export const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@Aerothermengineering",
  x: "https://x.com/aerothermeng?s=11",
  linkedin: "https://www.linkedin.com/in/aerotherm-engineering-146b55434",
  instagram: "https://www.instagram.com/aerothermengineeringpvt.ltd",
  facebook: "https://www.facebook.com/share/1Bq3p3Knr3/?mibextid=wwXIfr",
} as const;

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const seoMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "AeroTherm Engineering | Industrial Engineering & Energy Solutions",
    template: "%s | AeroTherm Engineering",
  },
  description: SITE_DESCRIPTION,
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
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Industrial Engineering",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: googleSiteVerification
    ? { google: googleSiteVerification }
    : undefined,
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
        url: OG_IMAGE,
        width: 1905,
        height: 877,
        alt: "AeroTherm Engineering industrial solutions",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroTherm Engineering | Industrial Engineering & Energy Solutions",
    description:
      "Engineering, automation, industrial chemical supply and sustainable biomass energy solutions for industry.",
    images: [OG_IMAGE],
  },
};
