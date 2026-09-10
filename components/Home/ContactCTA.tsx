"use client";

import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";

type FieldName = "fullName" | "company" | "email" | "phone" | "service" | "details";
type FormErrors = Partial<Record<FieldName, string>>;

const labelClass = "text-[10px] font-medium uppercase tracking-[0.08em] text-white/62";
const baseFieldClass = "mt-2 h-11 w-full rounded-[3px] border bg-white/[0.06] px-3 text-[13px] font-normal normal-case tracking-normal text-white outline-none transition placeholder:text-white/28 focus:bg-white/[0.09] focus:ring-2 focus:ring-accent/12";

function fieldClass(hasError: boolean) {
  return `${baseFieldClass} ${hasError ? "border-red-400/80 focus:border-red-400" : "border-white/12 focus:border-accent/80"}`;
}

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: FieldName) {
    setSubmitted(false);
    setSubmitError("");
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries()) as Record<string, string>;
    const nextErrors: FormErrors = {};

    if (!values.fullName?.trim() || values.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }
    if (!values.company?.trim() || values.company.trim().length < 2) {
      nextErrors.company = "Please enter your company or organization.";
    }
    if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid work email address.";
    }
    if (!values.phone?.trim() || !/^\+?[0-9\s().-]{7,20}$/.test(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone or WhatsApp number.";
    }
    if (!values.service) {
      nextErrors.service = "Please select the service you need.";
    }
    if (!values.details?.trim() || values.details.trim().length < 20) {
      nextErrors.details = "Please provide at least 20 characters of project detail.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0] as FieldName;
      form.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    setErrors({});
    setSubmitted(false);
    setSubmitError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          fullName: values.fullName,
          company: values.company,
          email: values.email,
          phone: values.phone,
          service: values.service,
          details: values.details,
          faxNumber: values.faxNumber || "",
        }),
      });
      const result = await response.json() as { error?: string; fieldErrors?: Partial<Record<FieldName, string[]>> };
      if (!response.ok) {
        if (result.fieldErrors) {
          const serverErrors: FormErrors = {};
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) serverErrors[field as FieldName] = messages[0];
          }
          setErrors(serverErrors);
        }
        throw new Error(result.error || "Unable to submit your request.");
      }

      setSubmitted(true);
      setSubmissionId(crypto.randomUUID());
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-pad bg-[#eef3ff]">
      <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.08fr] lg:items-stretch">
        <div className="flex flex-col">
          <p className="eyebrow">Start a Project</p>
          <h2 className="heading-lg mt-3 max-w-md text-navy">Let&apos;s Engineer Your Next Project.</h2>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-steel">
            Share your industrial requirement and our engineering team will respond
            with the right technical direction and a focused proposal.
          </p>

          <div className="mt-8 grid gap-3">
            <a href="mailto:info@aerothermengineering.com" className="flex items-center gap-4 border border-white bg-white p-4 transition hover:border-primary-2/24 hover:shadow-card">
              <Mail className="h-5 w-5 text-primary-2" />
              <span><span className="block text-[10px] font-extrabold uppercase tracking-[0.08em] text-steel">Direct proposal desk</span><span className="mt-1 block text-[12px] font-bold text-navy">info@aerothermengineering.com</span></span>
            </a>
<a href="tel:+923035693012" className="flex items-center gap-4 border border-white bg-white p-4 transition hover:border-primary-2/24 hover:shadow-card">
              <Phone className="h-5 w-5 text-primary-2" />
<span><span className="block text-[10px] font-extrabold uppercase tracking-[0.08em] text-steel">Engineering hotline</span><span className="mt-1 block text-[12px] font-bold text-navy">+92 3035639012</span></span>
            </a>
            <div className="flex items-center gap-4 border border-white bg-white p-4">
              <MapPin className="h-5 w-5 text-primary-2" />
              <span><span className="block text-[10px] font-extrabold uppercase tracking-[0.08em] text-steel">Operations headquarters</span><span className="mt-1 block text-[12px] font-bold text-navy">Lahore, Pakistan</span></span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 border border-white/80 bg-white/58 p-4 lg:mt-auto">
            <Clock3 className="h-5 w-5 text-primary-2" />
            <p className="text-[11px] leading-relaxed text-steel"><span className="font-extrabold uppercase tracking-[0.08em] text-navy">Response SLA guarantee</span><br />Typical enquiry response within four business hours.</p>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="relative border border-navy bg-gradient-to-br from-navy to-[#123364] p-6 text-white shadow-lift md:p-8 lg:p-10 rounded-sm">
          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>Fax number<input name="faxNumber" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <h3 className="text-[20px] font-semibold text-white">Project Parameter Submission</h3>
          <p className="mt-2 text-[12px] font-normal leading-relaxed text-white/48">Tell us what you need and our technical team will review the details.</p>
          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className={labelClass}>Full name *
              <input name="fullName" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} onChange={() => clearError("fullName")} className={fieldClass(Boolean(errors.fullName))} placeholder="e.g. Tariq Mehmood" />
              {errors.fullName && <span id="fullName-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.fullName}</span>}
            </label>
            <label className={labelClass}>Company / Organization *
              <input name="company" autoComplete="organization" required minLength={2} maxLength={120} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "company-error" : undefined} onChange={() => clearError("company")} className={fieldClass(Boolean(errors.company))} placeholder="e.g. National Fertilizer Corp" />
              {errors.company && <span id="company-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.company}</span>}
            </label>
            <label className={labelClass}>Work email address *
              <input name="email" autoComplete="email" required type="email" maxLength={160} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clearError("email")} className={fieldClass(Boolean(errors.email))} placeholder="t.mehmood@plant.com" />
              {errors.email && <span id="email-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.email}</span>}
            </label>
            <label className={labelClass}>Phone / WhatsApp *
              <input name="phone" autoComplete="tel" required type="tel" inputMode="tel" minLength={7} maxLength={20} pattern="\+?[0-9\s().-]{7,20}" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} onChange={() => clearError("phone")} className={fieldClass(Boolean(errors.phone))} placeholder="+92 300 1234567" />
              {errors.phone && <span id="phone-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.phone}</span>}
            </label>
          </div>

          <label className={`${labelClass} mt-4 block`}>Service required *
            <select name="service" required defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} onChange={() => clearError("service")} className={`${fieldClass(Boolean(errors.service))} appearance-none bg-[#0b2344] text-white [color-scheme:dark] [&>option]:bg-[#0b2344] [&>option]:text-white`}>
              <option value="" disabled>Select an engineering discipline...</option>
              <option>Boiler & Pressure Equipment</option>
              <option>Automation, PLC & Instrumentation</option>
              <option>Industrial Chemicals</option>
              <option>Biomass Fuel Supply</option>
              <option>Coal Trading</option>
              <option>Inspection, EPC or Fabrication</option>
            </select>
            {errors.service && <span id="service-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.service}</span>}
          </label>

          <label className={`${labelClass} mt-4 block`}>Project parameters &amp; details *
            <textarea name="details" required minLength={20} maxLength={1500} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "details-error" : "details-hint"} onChange={() => clearError("details")} className={`${fieldClass(Boolean(errors.details))} min-h-28 resize-y py-3`} placeholder="Provide capacity, medium, process requirements, delivery volume or estimated turnaround dates..." />
            {errors.details ? <span id="details-error" className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-300">{errors.details}</span> : <span id="details-hint" className="mt-1.5 block text-[10px] font-normal normal-case tracking-normal text-white/34">Minimum 20 characters.</span>}
          </label>

          <button type="submit" disabled={submitting} className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-[3px] bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.04em] text-navy transition hover:bg-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-65">
            {submitting ? "Submitting request..." : submitted ? "Request received — we'll be in touch" : "Submit engineering request"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <p aria-live="polite" className={`mt-3 text-center text-[10px] font-normal leading-relaxed ${submitError ? "text-red-300" : submitted ? "text-emerald-300" : "text-white/38"}`}>
            {submitError || (submitted ? "Thank you. Your request has been submitted and a confirmation email is on its way." : "Your project information is reviewed confidentially by our technical team.")}
          </p>
        </form>
      </div>
    </section>
  );
}
