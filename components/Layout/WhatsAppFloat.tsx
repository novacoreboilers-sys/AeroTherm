import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppFloat() {
  return (
    <a
href="https://wa.link/0ztklz"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float"
    >
      <span className="whatsapp-wave" />
      <span className="whatsapp-wave whatsapp-wave-delay" />
      <FaWhatsapp className="relative z-10 h-6 w-6 text-white md:h-7 md:w-7" />
    </a>
  );
}
