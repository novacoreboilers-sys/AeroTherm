import Image from "next/image";
import { ArrowRight, CheckCircle2, Flame, Truck } from "lucide-react";

const products = ["Imported Coal", "Local Coal", "Industrial Grade Coal", "Bulk Coal Supply"];
const benefits = [
  "Premium, quality-checked fuel",
  "Competitive commercial pricing",
  "Reliable bulk supply chain",
  "Timely nationwide delivery",
];

export default function CoalTrading() {
  return (
    <section id="coal-trading" className="section-pad bg-white">
      <div className="container">
        <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-navy to-[#123364] text-white shadow-lift">
          <div className="grid min-h-[570px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 flex flex-col justify-center p-7 md:p-12 lg:p-14">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/8">
                  <Flame className="h-6 w-6 text-white" />
                </span>
                <p className="eyebrow text-white!">Highlighted Service</p>
              </div>

              <h2 className="heading-lg text-white">Coal Trading</h2>
              <p className="mt-3 text-[16px] font-extrabold uppercase tracking-[0.04em] text-white/84">
                Reliable Imported &amp; Local Coal Supply
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-white/66">
                Premium imported and local coal supplied to industries across Pakistan,
                with dependable quality, competitive pricing and delivery planned around
                uninterrupted operations.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {products.map((product) => (
                  <span key={product} className="rounded-full border border-white/14 bg-white/7 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white/88">
                    {product}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-[13px] text-white/78">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a href="#contact" className="navy-button border-white bg-white text-navy hover:border-accent hover:bg-accent hover:text-navy">
                  Request Coal Supply
                  <ArrowRight className="h-4 w-4" />
                </a>
                <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-white/64">
                  <Truck className="h-4 w-4 text-white" />
                  Nationwide logistics
                </span>
              </div>
            </div>

            <div className="relative min-h-[380px] overflow-hidden lg:min-h-full">
              <Image
                src="/assets/coal-trading-1.png"
                alt="Coal stockpile and bulk handling facility for AeroTherm coal trading"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              {/* <div className="absolute inset-0 bg-linear-to-r from-[#050d19] via-[#050d19]/18 to-transparent max-lg:bg-linear-to-t max-lg:from-[#050d19] max-lg:via-transparent" /> */}
              <div className="absolute bottom-6 right-6 max-w-xs rounded-[5px] border border-white/16 bg-[#050d19]/28 p-5 backdrop-blur-md">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-white">Our commitment</p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/72">
                  Powering industries with reliable imported and local coal supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
