
import "./globals.css";
import "lenis/dist/lenis.css";
import { body_font, heading_font, dm_mono } from "./lib/fonts"
import { BASE_URL, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, seoMetadata } from "./lib/config";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/Motion/SmoothScroll";

export const metadata = seoMetadata;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/assets/logo.png`,
  image: `${BASE_URL}${OG_IMAGE}`,
  description: SITE_DESCRIPTION,
  email: "info@aerothermengineering.com",
  telephone: "+92-303-5693012",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-303-5693012",
    contactType: "customer service",
    email: "info@aerothermengineering.com",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(body_font.variable, heading_font.variable, dm_mono.variable)}>
      <body className={`${body_font.variable} ${heading_font.variable} ${dm_mono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
