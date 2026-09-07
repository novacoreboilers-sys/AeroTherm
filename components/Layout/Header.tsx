import {
  ChevronDown,
  Mail,
  Menu,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SOCIAL_LINKS } from "@/app/lib/config";

const navItems = [
  "Home",
  "About Us",
  "Services",
  "Solutions",
  "Coal Trading",
  "Industries",
  "Contact Us",
];

const socialItems = [
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: FaLinkedinIn },
  { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: FaFacebookF },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: FaInstagram },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: FaYoutube },
  { label: "X", href: SOCIAL_LINKS.x, icon: FaXTwitter },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_20px_rgba(7,21,44,0.08)]">
      <div className="bg-navy text-white">
        <div className="container flex min-h-8 flex-wrap items-center justify-center gap-x-8 gap-y-2 py-2 text-[12px] font-medium md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              info@aerothermengineering.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              +92 303 5693012
            </span>
            <span className="hidden items-center gap-2 lg:flex">
              <MapPin className="h-3.5 w-3.5" />
              Lahore, Pakistan
            </span>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            {socialItems.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open AeroTherm Engineering on ${label}`}
                className="transition-colors hover:text-white/70"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
            <a href="#contact" className="navy-button min-h-8 px-4 text-[11px]">
              Request a Quote
            </a>
          </div>
        </div>
      </div>

      <div className="container flex min-h-14 items-center justify-between gap-4 lg:min-h-16">
        <a href="#" className="flex shrink-0 items-center" aria-label="AeroTherm Engineering home">
          <Image
            src="/assets/logo.png"
            alt="AeroTherm Engineering"
            width={1607}
            height={412}
            priority
            sizes="(min-width: 1024px) 190px, 168px"
            className="h-auto w-[168px] lg:w-[190px]"
          />
        </a>

        <nav className="hidden items-center gap-5 text-[11px] font-extrabold uppercase text-navy lg:flex xl:gap-7 xl:text-[12px]">
          {navItems.map((item) => (
            <a
              key={item}
              href={item === "Home" ? "#" : `#${item.toLowerCase().replaceAll(" ", "-")}`}
              className="flex items-center gap-1 py-6 transition-colors hover:text-primary-2"
            >
              {item}
              {["Services", "Products", "Industries", "Resources"].includes(item) && (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </a>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-bordercol text-navy transition-colors hover:bg-panel lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-2 border-b border-bordercol pb-5">
              <Image
                src="/assets/logo.png"
                alt="AeroTherm Engineering"
                width={1607}
                height={412}
                sizes="190px"
                className="h-auto w-[190px]"
              />
            </div>

            <nav className="mt-7 grid gap-2 text-[13px] font-extrabold uppercase text-navy">
              {navItems.map((item) => (
                <SheetClose asChild key={item}>
                  <a
                    href={item === "Home" ? "#" : `#${item.toLowerCase().replaceAll(" ", "-")}`}
                    className="rounded-[3px] px-3 py-3 transition-colors hover:bg-panel hover:text-primary-1"
                  >
                    {item}
                  </a>
                </SheetClose>
              ))}
            </nav>

            <SheetClose asChild>
              <a href="#contact" className="navy-button mt-7 w-full">
                Request a Quote
              </a>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
