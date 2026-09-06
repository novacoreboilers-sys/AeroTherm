import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Droplets,
  Leaf,
} from "lucide-react";

const solutions = [
  {
    number: "01",
    title: "Industrial Chemicals",
    subtitle: "Reliable Industrial Chemical Supply",
    text: "Quality-assured chemicals and raw materials supplied at competitive prices, with dependable bulk availability, nationwide delivery, and practical product support.",
    image: "/assets/industry-chemicals.png",
    imageAlt: "Industrial process plant supported by AeroTherm chemical supply",
    icon: Droplets,
    offerings: [
      "Water & boiler treatment chemicals",
      "Process and cleaning chemicals",
      "Solvents, raw materials & specialties",
    ],
    sectors: "Textile, food, paper, pharma, power, oil & gas, water treatment and steel",
    accent: "bg-primary-2",
  },
  {
    number: "02",
    title: "Automation, PLC & Instrumentation",
    subtitle: "Smart Automation for Industrial Efficiency",
    text: "Integrated PLC, SCADA, HMI, boiler control and instrumentation solutions that strengthen process safety, reduce downtime and improve energy performance.",
    image: "/assets/automations.png",
    imageAlt: "Engineer inspecting an automated industrial boiler system",
    icon: Cpu,
    offerings: [
      "PLC, SCADA and HMI engineering",
      "Boiler automation, BMS and control panels",
      "Instrumentation, VFDs, upgrades & support",
    ],
    sectors: "Textile, food, chemical, pharma, paper, sugar, cement, power and manufacturing",
    accent: "bg-accent",
  },
  {
    number: "03",
    title: "Biomass Fuel Supply",
    subtitle: "Sustainable & Renewable Energy Solutions",
    text: "Consistent, cost-effective biomass fuels for industrial boilers and steam plants, helping customers lower fuel costs and move toward more responsible operations.",
    image: "/assets/biogass.png",
    imageAlt: "Industrial boiler compatible with AeroTherm biomass energy solutions",
    icon: Leaf,
    offerings: [
      "Wood pellets, chips and sawdust",
      "Rice husk, bagasse and briquettes",
      "Reliable bulk supply and nationwide delivery",
    ],
    sectors: "Textile, food processing, paper, cement, chemicals, power and steam generation",
    accent: "bg-[#1e9364]",
  },
];

export default function IndustrialSolutions() {
  return (
    <section id="solutions" className="section-pad overflow-hidden bg-gradient-to-br from-navy to-[#123364] text-white">
      <div className="container">
        <div className="grid gap-6 border-b border-white/12 pb-2 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow text-white!">Expanded Capabilities</p>
            <h2 className="heading-lg mt-3 text-white">Supply. Automate. Sustain.</h2>
          </div>
          <p className="body-lg max-w-2xl text-white/68 lg:justify-self-end">
            Three connected solutions that keep industrial operations productive,
            efficient and ready for sustainable growth.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.title}
              className="group overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.06] transition duration-300 hover:-translate-y-1 hover:border-white/24 hover:bg-white/[0.09]"
            >
              <div className="relative h-58 overflow-hidden">
                <Image
                  src={solution.image}
                  alt={solution.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/18 to-transparent" />
                <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4">
                
                  <span className="font-mono text-[12px] font-bold tracking-[0.16em] text-white/72">
                    {solution.number}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-white">
                  {solution.subtitle}
                </p>
                <h3 className="mt-2 text-[22px] font-extrabold leading-tight text-white">
                  {solution.title}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-white/68">{solution.text}</p>

                <div className="mt-6 space-y-3 border-t border-white/12 pt-5">
                  {solution.offerings.map((item) => (
                    <div key={item} className="flex gap-3 text-[13px] leading-snug text-white/86">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-[12px] leading-relaxed text-white/52">
                  <span className="font-extrabold uppercase tracking-wide text-white/76">Serving: </span>
                  {solution.sectors}
                </p>
                <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase text-white transition-colors hover:text-accent">
                  Discuss your requirement
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[6px] border border-white/12 bg-white/[0.05] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[14px] font-semibold text-white/82">
            Quality products, reliable delivery, technical support and customer-focused service across Pakistan.
          </p>
          <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
            Built for industrial performance
          </span>
        </div>
      </div>
    </section>
  );
}
