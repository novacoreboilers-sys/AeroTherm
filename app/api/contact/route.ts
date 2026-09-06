import { NextRequest, NextResponse } from "next/server";
import { contactSubmissionSchema, deliverContactSubmission } from "@/contact/server";
import { checkMemoryRateLimit, getRequestFingerprint, hasValidJsonRequest } from "@/chatbot/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!hasValidJsonRequest(request)) {
    return NextResponse.json({ error: "Invalid contact request." }, { status: 400 });
  }
  if (!checkMemoryRateLimit(getRequestFingerprint(request, "contact"), 6, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  try {
    const parsed = contactSubmissionSchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.faxNumber) {
      const validationMessages: Record<string, string> = {
        fullName: "Please enter your full name.",
        company: "Please enter your company or organization.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone or WhatsApp number using digits only.",
        service: "Please select the service you need.",
        details: "Please provide at least 20 characters of project detail.",
      };
      const fieldErrors = parsed.success ? undefined : Object.fromEntries(
        Object.keys(parsed.error.flatten().fieldErrors)
          .filter((field) => field in validationMessages)
          .map((field) => [field, [validationMessages[field]]]),
      );
      const firstValidationError = fieldErrors ? Object.values(fieldErrors)[0]?.[0] : undefined;
      return NextResponse.json({ error: firstValidationError || "Please check the highlighted fields.", fieldErrors }, { status: 400 });
    }

    await deliverContactSubmission(parsed.data);
    return NextResponse.json({ ok: true, message: "Thank you. Your request has been submitted successfully." });
  } catch (error) {
    console.error("Contact form delivery failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "We couldn’t submit your request right now. Please try again or contact us directly." }, { status: 503 });
  }
}
