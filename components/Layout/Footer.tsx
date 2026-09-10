import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/app/lib/config";

const links = ["Home", "About Us", "Services", "Solutions", "Coal Trading", "Industries", "Contact Us"];

const socialItems = [
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: FaLinkedinIn },
  { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: FaFacebookF },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: FaInstagram },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: FaYoutube },
  { label: "X", href: SOCIAL_LINKS.x, icon: FaXTwitter },
];

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
<a href="tel:+923035693012" className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 text-white" />
+92 3035639012
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-white" />
              Pakistan - Serving Industries Worldwide
            </span>
          </div>
          <div className="mt-6 flex gap-4 text-white">
            {socialItems.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open AeroTherm Engineering on ${label}`}
                className="transition-colors hover:text-white/70"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
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
