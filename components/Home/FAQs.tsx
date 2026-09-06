"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Which engineering services does AeroTherm provide?",
    a: "AeroTherm provides boiler and pressure equipment solutions, inspection, industrial fabrication, EPC support, automation, PLC and SCADA systems, instrumentation, industrial chemicals, biomass fuels, maintenance, and shutdown support.",
  },
  {
    q: "Do you support boiler and turbine inspection work?",
    a: "Yes. Inspection services are central to AeroTherm's offering, including boiler compliance verification, certification support, condition assessment, and inspection planning for critical rotating and pressure equipment.",
  },
  {
    q: "Which industries can work with AeroTherm?",
    a: "We serve power plants, textile, sugar, chemical, paper, food processing, pharmaceutical, oil and gas, cement, steel, and broader manufacturing industries.",
  },
  {
    q: "Can AeroTherm handle EPC and shutdown projects?",
    a: "Yes. AeroTherm supports end-to-end EPC execution and planned industrial shutdown services, including engineering, procurement, fabrication, inspection, maintenance, and commissioning support.",
  },
  {
    q: "Do you supply both imported and local coal?",
    a: "Yes. AeroTherm supplies imported coal, local coal and industrial-grade coal in bulk, with delivery planning for customers across Pakistan.",
  },
  {
    q: "Which biomass fuels are available?",
    a: "Our range includes wood pellets, wood chips, rice husk, bagasse, sawdust, biomass briquettes and selected agricultural biomass fuels.",
  },
  {
    q: "Can you support complete PLC and SCADA projects?",
    a: "Yes. We support PLC programming, SCADA development, HMI configuration, boiler automation, BMS, VFDs, control panels, commissioning and upgrades.",
  },
  {
    q: "Which industrial chemicals can you supply?",
    a: "We supply water and boiler treatment chemicals, process and cleaning chemicals, solvents, industrial raw materials and specialty chemicals based on operating requirements.",
  },
  {
    q: "Do you offer bulk supply and nationwide delivery?",
    a: "Yes. Bulk supply and coordinated nationwide delivery are available for industrial chemicals, biomass fuels and coal, subject to product volume and destination planning.",
  },
  {
    q: "How quickly will your team respond to an enquiry?",
    a: "We aim to provide an initial response within four business hours. Detailed proposals may take longer depending on project complexity.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="section-pad bg-white">
      <div className="container grid gap-10 lg:grid-cols-[0.68fr_1.32fr]">
        <div>
          <p className="eyebrow">Frequently Asked Questions</p>
          <h2 className="heading-lg mt-3 text-navy">Clear Answers for Industrial Buyers.</h2>
          <p className="body-lg mt-5 max-w-md text-steel">
            A quick guide to our engineering, automation, chemical and industrial fuel capabilities.
          </p>
          <a href="#contact" className="navy-button mt-7">Ask our technical team</a>
        </div>

        <div className="rounded-[6px] border border-bordercol bg-panel px-5 shadow-card md:px-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="border-b border-bordercol last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 py-6 text-left text-[15px] font-extrabold text-navy transition-colors hover:text-primary-2"
                >
                  {faq.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary-2 shadow-sm">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="overflow-hidden pr-10 text-[14px] leading-relaxed text-steel">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
