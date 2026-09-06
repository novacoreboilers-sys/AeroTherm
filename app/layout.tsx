
import "./globals.css";
import "lenis/dist/lenis.css";
import { body_font, heading_font, dm_mono } from "./lib/fonts"
import { seoMetadata } from "./lib/config";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/Motion/SmoothScroll";

export const metadata = seoMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(body_font.variable, heading_font.variable, dm_mono.variable)}>
      <body className={`${body_font.variable} ${heading_font.variable} ${dm_mono.variable} antialiased`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
