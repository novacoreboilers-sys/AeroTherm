import { CheckCircle2, Factory, GraduationCap, Landmark, RadioTower, ShieldAlert, Wrench, Zap } from "lucide-react";

const divisions = [
  { name: "Manufacturing", icon: Factory },
  { name: "Inspection", icon: CheckCircle2 },
  { name: "Industrial Services", icon: Wrench },
  { name: "EPC Solutions", icon: Landmark },
  { name: "Energy Solutions", icon: Zap },
  { name: "Technical Training", icon: GraduationCap },
  { name: "Automation", icon: RadioTower },
  { name: "Chemical Supply", icon: ShieldAlert },
];

export default function Testimonials() {
  return (
    <section id="resources" className=" bg-white">
      <div className="container">
       

        <div className="mb-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="eyebrow">Integrated Capabilities</p>
            <h2 className="heading-lg mt-2 text-navy">One Industrial Partner. <br className="hidden md:block" /> Multiple Disciplines.</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {divisions.map((division) => (
              <article key={division.name} className="light-card rounded-[6px] border border-bordercol bg-panel p-4 transition-colors hover:border-primary-2 hover:bg-white sm:p-6">
                <division.icon className="h-7 w-7 text-primary-2 sm:h-8 sm:w-8" />
                <h3 className="mt-4 text-[14px] font-extrabold leading-tight text-navy sm:mt-5 sm:text-[17px]">{division.name}</h3>
              </article>
            ))}
          </div>
        </div>

         <div className="grid gap-8 lg:grid-cols-2">
          <article className="light-card rounded-[6px] border border-bordercol bg-white p-8 shadow-card">
            <p className="eyebrow">Quality Policy</p>
            <h2 className="heading-md mt-3 text-navy">Consistency, compliance, and continuous improvement</h2>
            <p className="body-lg mt-5 text-steel">
              AeroTherm Engineering is committed to providing engineering
              solutions that consistently meet customer requirements, applicable
              regulations, and recognized engineering standards while continuously
              improving quality, safety, and operational excellence.
            </p>
          </article>

          <article className="light-card rounded-[6px] bg-navy p-8 text-white shadow-soft">
            <p className="eyebrow text-white">Health, Safety & Environment</p>
            <h2 className="heading-md mt-3 text-white">Safety remains our highest priority</h2>
            <p className="body-lg mt-5 text-white/76">
              We are committed to protecting people, equipment, property, and the
              environment by promoting safe engineering practices, continuous
              training, hazard prevention, and compliance with applicable regulations.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
