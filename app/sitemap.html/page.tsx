import type { Metadata } from "next";
import { BASE_URL } from "../lib/config";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse the main pages and sections of the AeroTherm Engineering website.",
  alternates: {
    canonical: `${BASE_URL}/sitemap.html`,
  },
};

const sitemapLinks = [
  { label: "Home", href: "/" },
  { label: "About AeroTherm Engineering", href: "/#about-us" },
  { label: "Engineering Services", href: "/#services" },
  { label: "Industrial Solutions", href: "/#solutions" },
  { label: "Coal Trading", href: "/#coal-trading" },
  { label: "Industries We Serve", href: "/#industries" },
  { label: "Frequently Asked Questions", href: "/#faqs" },
  { label: "Contact and Project Enquiry", href: "/#contact" },
];

export default function HtmlSitemapPage() {
  return (
    <main className="min-h-screen bg-panel py-20 text-navy">
      <div className="container max-w-4xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">
          Website directory
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          AeroTherm Engineering Sitemap
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
          Use these links to reach the main information and enquiry sections on our website.
        </p>

        <nav aria-label="Website sitemap" className="mt-10 grid gap-3 sm:grid-cols-2">
          {sitemapLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[3px] border border-bordercol bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="/" className="navy-button mt-10">
          Return to homepage
        </a>
      </div>
    </main>
  );
}
