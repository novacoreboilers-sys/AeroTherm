import { chatbotConfig } from "../../config";
import type { LeadRecord } from "../database";

export async function syncLeadToGoogleSheets(lead: LeadRecord) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  if (!endpoint) throw new Error("GOOGLE_APPS_SCRIPT_URL is not configured.");

  const payload = {
    submittedAt: lead.createdAt,
    submissionId: lead.id,
    name: lead.answers[chatbotConfig.fieldIds.name],
    phone: lead.answers[chatbotConfig.fieldIds.phone],
    email: lead.answers[chatbotConfig.fieldIds.email],
    service: lead.answers[chatbotConfig.fieldIds.service],
    source: "AeroTherm Engineering Website Chatbot",
    page: lead.source.page || "",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets request failed (${response.status}): ${body.slice(0, 180)}`);
  }

  const body = await response.text();
  if (body) {
    try {
      const result = JSON.parse(body) as { ok?: boolean; error?: string };
      if (result.ok === false) throw new Error(result.error || "Google Sheets rejected the submission.");
    } catch (error) {
      if (error instanceof SyntaxError) return;
      throw error;
    }
  }
}
