import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const links = ["Home", "About Us", "Services", "Solutions", "Coal Trading", "Industries", "Contact Us"];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_1fr]">
        <div>
          <Image
            src="/assets/logo-dark.png"
            alt="AeroTherm Engineering"
            width={1610}
            height={412}
            sizes="(min-width: 768px) 270px, 230px"
            className="h-auto w-[230px] md:w-[270px]"
          />
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/68">
            AeroTherm Engineering delivers integrated engineering, automation,
            industrial chemical and biomass energy solutions with a commitment to
            quality, safety and dependable service.
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-extrabold uppercase">Navigation</h3>
          <div className="mt-5 grid gap-3 text-[13px] text-white/70">
            {links.map((link) => (
              <a key={link} href={link === "Home" ? "#" : `#${link.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-white">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-extrabold uppercase">Contact</h3>
          <div className="mt-5 grid gap-4 text-[13px] text-white/70">
            <a href="mailto:info@aerothermengineering.com" className="flex items-center gap-3 hover:text-white">
              <Mail className="h-4 w-4 text-white" />
              info@aerothermengineering.com
            </a>
            <a href="tel:+923434101295" className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 text-white" />
              +92 343 4101295
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-white" />
              Pakistan - Serving Industries Worldwide
            </span>
          </div>
          <div className="mt-6 flex gap-4 text-white">
            <FaLinkedinIn className="h-4 w-4" />
            <FaFacebookF className="h-4 w-4" />
            <FaInstagram className="h-4 w-4" />
            <FaYoutube className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container flex flex-col gap-2 text-center text-[12px] text-white/52 md:flex-row md:justify-between md:text-left">
          <span>Copyright 2026. AeroTherm Engineering.</span>
          <span>Industrial Solutions. Engineered for Performance.</span>
        </div>
      </div>
    </footer>
  );
}
