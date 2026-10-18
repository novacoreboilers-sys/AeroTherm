import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  FlameKindling,
  Gauge,
  Hammer,
  HardHat,
  Landmark,
  Settings,
  ShieldCheck,
  Snowflake,
  Sun,
} from "lucide-react";

const services = [
  {
    title: "Boiler Manufacturing",
    text: "Design, fabrication, testing, and commissioning of industrial boilers built to recognized standards.",
    icon: FlameKindling,
    image: "/assets/service1.png",
  },
  {
    title: "Boiler Inspection & Certification",
    text: "Professional inspection, compliance verification, and certification services for industrial boilers.",
    icon: BadgeCheck,
    image: "/assets/service2.png",
  },
  {
    title: "Pressure Vessel Manufacturing",
    text: "Custom engineered pressure vessels designed and manufactured for demanding industrial applications.",
    icon: Gauge,
    image: "/assets/service3.png",
  },
  {
    title: "Heat Exchanger Manufacturing",
    text: "High performance exchangers for process industries, utilities, and energy applications.",
    icon: Settings,
    image: "/assets/service4.png",
  },
  {
    title: "Industrial Fabrication",
    text: "Structural fabrication, piping, skids, tanks, and customized fabrication solutions.",
    icon: Hammer,
    image: "/assets/service5.png",
  },
  {
    title: "EPC Solutions",
    text: "End-to-end engineering & procurement solutions from concept to commissioning.",
    icon: Landmark,
    image: "/assets/service6.png",
  },
  {
    title: "Engineering Consultancy",
    text: "Technical consulting for reliability, safety, design review, and operational improvement.",
    icon: Building2,
    image: "/assets/service7.png",
  },
  {
    title: "Industrial Shutdown Services",
    text: "Planned shutdown support, maintenance coordination, inspection, and restart readiness.",
    icon: HardHat,
    image: "/assets/service8.png",
  },
  {
    title: "Third-Party Inspection",
    text: "Independent inspection services for manufacturers, owners, contractors, and operators.",
    icon: ShieldCheck,
    image: "/assets/service9.png",
  },
  {
    title: "HVAC Solutions",
    text: "Complete HVAC design, installation, commissioning, ventilation, air distribution, maintenance, and energy optimization.",
    icon: Snowflake,
    image: "/assets/service11.png",
  },
  {
    title: "Solar Installation Services",
    text: "Reliable solar installation solutions tailored to commercial and industrial energy requirements.",
    icon: Sun,
    image: "/assets/service_10.png",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-pad bg-white">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="eyebrow">What We Do</p>
          <h2 className="heading-lg mt-2 text-navy">Our Core Services</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="light-card group overflow-hidden rounded-[4px] border border-bordercol bg-white shadow-card transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative h-58 overflow-hidden bg-navy">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/38 to-transparent" />
              </div>
              <div className="relative px-6 pt-8">
                <div className="absolute -top-6 left-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-navy text-white">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-extrabold uppercase leading-tight text-navy">
                  {service.title}
                </h3>
                <p className="mt-4 mb-4 min-h-[54px] text-[13px] leading-relaxed text-steel">{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
