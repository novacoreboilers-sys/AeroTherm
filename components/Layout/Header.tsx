import {
  ChevronDown,
  Factory,
  Mail,
  Menu,
  MapPin,
  Phone,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  "Home",
  "About Us",
  "Services",
  "Solutions",
  "Coal Trading",
  "Industries",
  "Contact Us",
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
              +92 343 4101295
            </span>
            <span className="hidden items-center gap-2 lg:flex">
              <MapPin className="h-3.5 w-3.5" />
              Lahore, Pakistan
            </span>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <FaLinkedinIn className="h-3.5 w-3.5" />
            <FaFacebookF className="h-3.5 w-3.5" />
            <FaInstagram className="h-3.5 w-3.5" />
            <FaYoutube className="h-3.5 w-3.5" />
            <a href="#contact" className="navy-button min-h-8 px-4 text-[11px]">
              Request a Quote
            </a>
          </div>
        </div>
      </div>

      <div className="container flex min-h-14 items-center justify-between gap-4 lg:min-h-16">
        <a href="#" className="flex items-center gap-3" aria-label="AeroTherm Engineering home">
          <div className="flex h-8 w-10 items-center justify-center rounded-[3px] bg-navy lg:h-10 lg:w-12">
            <Factory className="h-5 w-5 text-white lg:h-6 lg:w-6" strokeWidth={2.2} />
          </div>
          <div className="leading-none">
            <div className="font-heading text-[17px] font-extrabold tracking-[0.02em] text-navy lg:text-[20px]">
              AEROTHERM
            </div>
            <div className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-steel lg:text-[10px] lg:tracking-[0.18em]">
              Engineering
            </div>
          </div>
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
            <div className="mt-2 flex items-center gap-3 border-b border-bordercol pb-5">
              <div className="relative h-8 w-10 overflow-hidden rounded-[3px] bg-navy">
                <div className="flex h-full w-full items-center justify-center">
                  <Factory className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
              </div>
              <div className="leading-none">
                <div className="font-heading text-[17px] font-extrabold tracking-[0.02em] text-navy">
                  AEROTHERM
                </div>
                <div className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-steel">
                  Engineering
                </div>
              </div>
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
