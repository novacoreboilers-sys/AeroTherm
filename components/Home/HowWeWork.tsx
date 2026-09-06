import {
  ArrowUpRight,
  Leaf,
  Medal,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

const whyItems = [
  "Engineering Excellence",
  "Quality Assurance",
  "Industrial Safety",
  "Modern Technology",
  "International Standards",
  "Customer Satisfaction",
];

const industries = [
  {
    name: "Power Plants",
    image: "/assets/industries/power-plants.jpg",
    alt: "High-capacity thermal power generation plant with cooling towers and steam systems",
  },
  {
    name: "Oil & Gas",
    image: "/assets/industries/oil-and-gas.jpg",
    alt: "Oil and gas refinery towers and steel process piping at sunset",
  },
  {
    name: "Chemical",
    image: "/assets/industries/chemical.jpg",
    alt: "Chemical manufacturing facility with stainless steel vessels and process ducts",
  },
  {
    name: "Textile Mills",
    image: "/assets/industries/textile-mills.jpg",
    alt: "Large-scale textile processing factory with dyeing and finishing lines",
  },
  {
    name: "Sugar Mills",
    image: "/assets/industries/sugar-mills.jpg",
    alt: "Industrial sugar mill with evaporation vessels and steam boilers",
  },
  {
    name: "Pharmaceutical",
    image: "/assets/industries/pharmaceutical.jpg",
    alt: "Pharmaceutical clean room with sanitary stainless steel process systems",
  },
  {
    name: "Food Processing",
    image: "/assets/industries/food-processing.jpg",
    alt: "Automated food processing plant with stainless steel production systems",
  },
  {
    name: "Paper & Pulp",
    image: "/assets/industries/paper-and-pulp.jpg",
    alt: "High-speed paper mill machinery and industrial drying cylinders",
  },
  {
    name: "Cement Plants",
    image: "/assets/industries/cement-plants.jpg",
    alt: "Cement kiln and preheater tower with industrial exhaust systems",
  },
  {
    name: "Steel & Metals",
    image: "/assets/industries/steel-and-metals.jpg",
    alt: "Steel mill production area with heavy thermal processing equipment",
  },
  {
    name: "Heavy Manufacturing",
    image: "/assets/industries/heavy-manufacturing.jpg",
    alt: "Heavy manufacturing assembly line with cranes and industrial machinery",
  },
  {
    name: "Industrial Fabrication",
    image: "/assets/industries/industrial-fabrication.jpg",
    alt: "Industrial fabrication yard with welded steel modules ready for transport",
  },
];

export default function HowWeWork() {
  return (
    <section id="about-us" className="bg-panel py-4 lg:py-28">
      <div className="container">
        <div className="grid gap-10 rounded-[8px] border border-white/10 bg-linear-to-br from-navy via-navy-2 to-[#082c58] p-7 text-white shadow-lift lg:grid-cols-[1fr_1.55fr_0.9fr] lg:p-10">
          <div>
            <p className="eyebrow text-white">Why Choose AeroTherm?</p>
            <h2 className="mt-2 text-[23px] font-extrabold uppercase leading-tight text-white">
              Industrial partner for safe, reliable engineering
            </h2>
            <p className="mt-5 text-[13px] leading-relaxed text-white/72">
              We combine engineering expertise, advanced technology, and a
              customer-focused approach to deliver reliable and efficient solutions.
            </p>
          </div>

          <div className="grid my-auto grid-cols-1 md:gap-x-12  gap-y-3 md:gap-y-16 border-white/18 sm:grid-cols-2 lg:grid-cols-3 lg:border-x lg:px-10">
            {whyItems.map((item, index) => (
              <div key={item} className="flex gap-3 max-md:items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/9 text-accent">
                  {index % 3 === 0 ? <Medal className="h-4 w-4" /> : index % 3 === 1 ? <ShieldCheck className="h-4 w-4" /> : <UsersRound className="h-4 w-4" />}
                </div>
                <div className="text-[12px] font-bold leading-snug text-white">{item}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[6px] bg-white p-5 text-center text-navy shadow-[0_18px_42px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center gap-1">
            <p className="text-[12px] font-extrabold uppercase text-primary-2 font-heading">Our Certifications</p>
            <div className= "">
            <Image src="/assets/certificates.png" alt="Our Certifications" className="mx-auto my-4 align-middle" width={400} height={200} />
            </div>
            <a href="#contact" className="navy-button  min-h-9 px-4 text-[11px]">
              Request a Quote
            </a>
          </div>
        </div>

       

        <div id="industries" className="py-4 lg:py-4 lg-pt-8">
          <div className="mb-10 mt-10 max-w-3xl">
            <p className="eyebrow">Cross-Sector Applications</p>
            <h3 className="heading-lg mt-3 text-navy">Built for Diverse Industrial Environments.</h3>
            <p className="body-lg mt-4 max-w-2xl text-steel">
              Our engineering and supply capabilities support critical operations across
              power, process, manufacturing and energy-intensive industries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <article
                key={industry.name}
                className="group relative flex h-52 overflow-hidden rounded-[6px]  bg-navy p-4 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift sm:h-60 sm:p-5"
              >
                <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.035]">
                  <Image
                    src={industry.image}
                    alt={industry.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/55 to-navy/5" />
                <div className="relative z-10 mt-auto">
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-white/66">
                    {String(index + 1).padStart(2, "0")} 
                  </span>
                  <h4 className="mt-1 text-[15px] font-bold leading-tight text-white sm:text-[18px]">
                    {industry.name}
                  </h4>
                  <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent transition-colors group-hover:text-white">
                    Explore sector
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* <div className="grid gap-8 pt-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { label: "Vision", icon: Target, text: "To become one of the world's most trusted engineering companies delivering innovative manufacturing, inspection, industrial services, and engineering solutions." },
              { label: "Mission", icon: ShieldCheck, text: "To deliver reliable, safe, and cost-effective engineering solutions through technical expertise, innovation, quality management, and continuous improvement." },
            ].map((item) => (
              <article key={item.label} className="light-card group rounded-[8px] border border-bordercol bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary-2/35 hover:shadow-lift">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-[#020815] via-navy to-primary-1 text-white shadow-[0_12px_24px_rgba(7,21,44,0.28)]">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-[20px] font-extrabold uppercase text-navy">{item.label}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-steel">{item.text}</p>
              </article>
            ))}

            <article className="light-card group rounded-[8px] border border-bordercol bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary-2/35 hover:shadow-lift md:col-span-2">
              <div className="flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-[#020815] via-navy to-primary-1 text-white shadow-[0_12px_24px_rgba(7,21,44,0.28)]">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-[20px] font-extrabold uppercase text-navy">Values</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-steel">
                Integrity, quality, innovation, safety, professionalism, customer
                commitment, engineering excellence, and sustainability guide every
                project.
              </p>
            </article>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[8px] shadow-lift">
            <Image
              src="/assets/mission.png"
              alt="AeroTherm industrial engineering team at work"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy/44 via-transparent to-transparent" />
          </div>
        </div> */}
      </div>
    </section>
  );
}
