import Image from "next/image";
import { ArrowRight, Award, Clock3, Cog, ShieldCheck, UsersRound } from "lucide-react";

const strengths = [
  {
    icon: Cog,
    title: "Engineering",
    titleSecondLine: "Excellence",
    text: "Delivering solutions with precision",
  },
  {
    icon: ShieldCheck,
    title: "Commitment to",
    titleSecondLine: "Safety",
    text: "Safety is our priority in every project",
  },
  {
    icon: UsersRound,
    title: "Experienced",
    titleSecondLine: "Team",
    text: "Skilled professionals with industry expertise",
  },
  {
    icon: Award,
    title: "Quality",
    titleSecondLine: "Assurance",
    text: "International standards and reliable delivery",
  },
  {
    icon: Clock3,
    title: "Timely",
    titleSecondLine: "Delivery",
    text: "On-time project execution, every time",
  },
];

export default function Hero() {
  return (
    <section className="bg-navy text-white">
      <div className="relative overflow-hidden">
        <Image
          src="/assets/hero_1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/90 to-transparent md:via-navy/30" />

        <div className="container relative z-10 flex min-h-[400px] items-center py-14 lg:min-h-[410px]">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3 text-white">AeroTherm Engineering</p>
            <h1 className="heading-xl max-w-3xl uppercase text-white">
              Engineering Beyond Standards
            </h1>
            <p className="body-lg mt-6 max-w-xl text-white/84">
              Engineering, automation, industrial chemical supply and sustainable biomass
              energy solutions—delivered with quality, safety and dependable support.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#services" className="navy-button">
                Our Services
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="outline-button">
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-navy">
        <div className="container grid grid-cols-1 divide-y divide-white/14 py-6 text-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          {strengths.map((item) => (
            <div key={item.title} className="flex items-start gap-4 px-2 py-4 lg:px-6">
              <item.icon className="mt-1 h-10 w-10 shrink-0 stroke-[1.6]" />
              <div>
                <h3 className="text-[13px] font-extrabold uppercase leading-tight">
                  {item.title}
                  <br className="hidden lg:block" />
                  <span className="lg:hidden"> </span>
                  {item.titleSecondLine}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-white/72">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
