import { z } from "zod";
import { sendResendEmail } from "@/chatbot/server/integrations/resend-client";

export const contactServices = [
  "Boiler & Pressure Equipment",
  "Automation, PLC & Instrumentation",
  "Industrial Chemicals",
  "Biomass Fuel Supply",
  "Coal Trading",
  "Inspection, EPC or Fabrication",
] as const;

const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export const contactSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(80),
  company: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().max(160).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phone: z.string().trim().max(20).regex(phonePattern).refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }),
  service: z.enum(contactServices),
  details: z.string().trim().min(20).max(1500),
  faxNumber: z.string().max(0).optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function syncContactToGoogleSheets(contact: ContactSubmission) {
  const endpoint = process.env.CONTACT_GOOGLE_APPS_SCRIPT_URL?.trim();
  if (!endpoint) throw new Error("CONTACT_GOOGLE_APPS_SCRIPT_URL is not configured.");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      submittedAt: new Date().toISOString(),
      submissionId: contact.submissionId,
      fullName: contact.fullName,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      service: contact.service,
      details: contact.details,
      source: "AeroTherm Engineering Contact Form",
    }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`Contact Google Sheets request failed (${response.status}): ${body.slice(0, 180)}`);
  if (!body) return;

  try {
    const result = JSON.parse(body) as { ok?: boolean; error?: string };
    if (result.ok === false) throw new Error(result.error || "Google Sheets rejected the contact submission.");
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
  }
}

async function sendContactEmails(contact: ContactSubmission) {
  const from = process.env.CHATBOT_EMAIL_FROM;
  const teamEmail = process.env.CHATBOT_TEAM_EMAIL;
  if (!from || !teamEmail) throw new Error("Contact email delivery is not configured.");

  const safe = {
    fullName: escapeHtml(contact.fullName),
    company: escapeHtml(contact.company),
    email: escapeHtml(contact.email),
    phone: escapeHtml(contact.phone),
    service: escapeHtml(contact.service),
    details: escapeHtml(contact.details).replaceAll("\n", "<br>"),
  };

  const teamHtml = `<div style="font-family:Arial,sans-serif;color:#07152c;line-height:1.6;max-width:640px;margin:auto;border:1px solid #dbe5ec;">
    <div style="background:#07152c;color:#fff;padding:24px 28px;"><div style="font-size:12px;color:#8fd2f0;text-transform:uppercase;letter-spacing:1px;">New project inquiry</div><h1 style="margin:6px 0 0;font-size:25px;">${safe.fullName} contacted AeroTherm</h1></div>
    <div style="padding:26px 28px;background:#fff;">
      <p><strong>Company:</strong> ${safe.company}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Service:</strong> ${safe.service}</p>
      <div style="margin-top:20px;padding:18px;background:#eef4f8;border-left:4px solid #0a4d8f;"><strong>Project details</strong><br>${safe.details}</div>
    </div></div>`;
  const teamText = `New AeroTherm project inquiry\n\nName: ${contact.fullName}\nCompany: ${contact.company}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nService: ${contact.service}\n\nProject details:\n${contact.details}`;

  const clientHtml = `<div style="font-family:Arial,sans-serif;color:#07152c;line-height:1.6;max-width:640px;margin:auto;border:1px solid #dbe5ec;">
    <div style="background:#07152c;color:#fff;padding:24px 28px;"><div style="font-size:12px;color:#8fd2f0;text-transform:uppercase;letter-spacing:1px;">Inquiry received</div><h1 style="margin:6px 0 0;font-size:25px;">Thank you, ${safe.fullName}.</h1></div>
    <div style="padding:26px 28px;background:#fff;"><p>We’ve received your inquiry regarding <strong>${safe.service}</strong>. Our engineering team will review your requirements and contact you using the details provided.</p><p style="margin-top:20px;padding:16px;background:#eef4f8;">Company: ${safe.company}<br>Phone: ${safe.phone}<br>Email: ${safe.email}</p><p>Regards,<br><strong>AeroTherm Engineering</strong></p></div>
    </div>`;
  const clientText = `Hello ${contact.fullName},\n\nWe received your AeroTherm Engineering inquiry regarding ${contact.service}. Our engineering team will review it and contact you using the details provided.\n\nRegards,\nAeroTherm Engineering`;

  await Promise.all([
    sendResendEmail({
      from,
      to: teamEmail,
      replyTo: contact.email,
      subject: `New project inquiry: ${contact.service} — ${contact.company}`,
      html: teamHtml,
      text: teamText,
      idempotencyKey: `contact-${contact.submissionId}-team-v1`,
    }),
    sendResendEmail({
      from,
      to: contact.email,
      subject: "We received your AeroTherm Engineering inquiry",
      html: clientHtml,
      text: clientText,
      idempotencyKey: `contact-${contact.submissionId}-client-v1`,
    }),
  ]);
}

export async function deliverContactSubmission(contact: ContactSubmission) {
  await Promise.all([
    syncContactToGoogleSheets(contact),
    sendContactEmails(contact),
  ]);
}
