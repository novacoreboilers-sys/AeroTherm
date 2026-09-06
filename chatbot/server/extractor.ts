import { generateText, Output } from "ai";
import { chatbotConfig } from "../config";
import { extractionModelOrder, getGroqClient, groqModelOptions, providerErrorSummary } from "./groq";
import { leadExtractionOutputSchema, normalizeAnswer } from "./schemas";
import type { ChatMessage, LeadAnswers, LeadExtractionResponse } from "../types";

function extractionPrompt(answers: LeadAnswers) {
  const fields = chatbotConfig.questions.map((question) => ({
    questionId: question.id,
    label: question.label,
    description: question.description,
    type: question.type,
    choices: "choices" in question ? question.choices : undefined,
  }));

  return `Extract lead facts from the visitor's latest message using the configured fields.

Configured fields: ${JSON.stringify(fields)}
Existing validated answers: ${JSON.stringify(answers)}

Rules:
- Fields may be provided in any order, and one message may contain several fields.
- Return an update only when the visitor explicitly and unambiguously provides a value.
- For every update, evidence must be an exact quote copied from the visitor's latest message that proves the value.
- Never treat a refusal, joke, placeholder, question, or unrelated phrase as a value.
- Exception for choice fields: when "Not sure" is a configured choice and the visitor clearly says they do not know or do not want to choose which option applies, return "Not sure" as the update. This is a valid needs-review value, not a refusal.
- Examples that are NOT names: "I don't want to tell you", "prefer not to say", "why do you need it?", "none of your business".
- Put a field in refusedQuestionIds when the latest visitor message explicitly refuses that field. A refusal is not an update and does not complete the field.
- For a correction such as "actually my name is Ahmad", return only the corrected field. Preserve every other existing answer.
- Put a field in clearQuestionIds only when the visitor explicitly asks to remove or clear that field without replacing it.
- Never infer an email, phone number, or name.
- A phone number is invalid if letters are mixed into its number, such as "738737163b73". Never remove a letter to manufacture a valid phone number.
- Map service intent to the closest configured choice only when the intent is clear.
- Do not repeat unchanged existing answers in updates.
- Output data only through the required schema.`;
}

function getUncertainServiceUpdate(messages: Pick<ChatMessage, "role" | "content">[]) {
  const serviceQuestion = chatbotConfig.questions.find((question) => question.id === chatbotConfig.fieldIds.service);
  if (!serviceQuestion || serviceQuestion.type !== "choice") return null;
  const notSureChoice = serviceQuestion.choices?.find((choice) => choice.toLowerCase().includes("not sure"));
  if (!notSureChoice) return null;

  const latestUserIndex = messages.findLastIndex((message) => message.role === "user");
  if (latestUserIndex < 0) return null;
  const latest = messages[latestUserIndex].content.trim();
  const previousAssistant = messages.slice(0, latestUserIndex).findLast((message) => message.role === "assistant")?.content || "";
  const explicitlyUnsureAboutService = /\b(?:not sure|unsure|do not know|don't know|dont know|no idea)\b.{0,60}\b(?:service|option|package|solution|which one)\b|\b(?:service|option|package|solution|which one)\b.{0,60}\b(?:not sure|unsure|do not know|don't know|dont know|no idea)\b|\b(?:decide|choose)\b.{0,40}\b(?:after|during)\b.{0,30}\b(?:call|consultation)\b/i.test(latest);
  const explicitlyDeclinesService = /\b(?:do not|don't|dont|won't|would rather not)\b.{0,40}\b(?:choose|select|share|say|tell)\b.{0,50}\b(?:service|option|package)\b|\b(?:service|option|package)\b.{0,50}\b(?:do not|don't|dont|won't|would rather not)\b.{0,40}\b(?:choose|select|share|say|tell)\b/i.test(latest);
  const genericUncertainty = /^(?:i(?:'m| am)?\s*)?(?:do not know|don't know|dont know|not sure|unsure|no idea)(?:\s+(?:exactly|yet|right now))?[.!]?$/i.test(latest);
  const genericDecline = /^(?:i\s+)?(?:do not|don't|dont)\s+(?:(?:want|wish)\s+to|wanna)\s+(?:choose|select|share|say|tell)(?:\s+(?:you|it))?[.!]?$/i.test(latest);
  const assistantWasAskingForService = /\b(?:service|boiler|steam|pressure vessel|heat exchanger|fabrication|epc|automation|plc|instrumentation|chemical|biomass|coal|inspection|consultancy|shutdown)\b/i.test(previousAssistant);

  return explicitlyUnsureAboutService || explicitlyDeclinesService || ((genericUncertainty || genericDecline) && assistantWasAskingForService)
    ? { questionId: serviceQuestion.id, value: notSureChoice }
    : null;
}

function applyDeterministicUpdates(latestMessage: string, answers: LeadAnswers, updatedQuestionIds: string[]) {
  const next = { ...answers };

  function apply(questionId: string, rawValue: string | undefined) {
    if (!rawValue) return;
    const question = chatbotConfig.questions.find((candidate) => candidate.id === questionId);
    if (!question) return;
    const normalized = normalizeAnswer(question, rawValue);
    if (!normalized || next[questionId] === normalized) return;
    next[questionId] = normalized;
    if (!updatedQuestionIds.includes(questionId)) updatedQuestionIds.push(questionId);
  }

  const emailMatch = latestMessage.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  apply(chatbotConfig.fieldIds.email, emailMatch?.[0]);

  let validPhone: string | undefined;
  for (const match of latestMessage.matchAll(/\+?\d[\d\s().-]{5,22}\d/g)) {
    const candidate = match[0];
    const start = match.index ?? 0;
    const characterBefore = start > 0 ? latestMessage[start - 1] : "";
    const characterAfter = latestMessage[start + candidate.length] || "";
    if ((/\p{L}/u.test(characterBefore) && /^\d/.test(candidate))
      || (/\d$/.test(candidate) && /\p{L}/u.test(characterAfter))) continue;
    const phoneQuestion = chatbotConfig.questions.find((question) => question.id === chatbotConfig.fieldIds.phone);
    if (phoneQuestion && normalizeAnswer(phoneQuestion, candidate)) {
      validPhone = candidate;
      break;
    }
  }
  apply(chatbotConfig.fieldIds.phone, validPhone);

  const explicitName = latestMessage.match(
    /\b(?:my name is|call me|name\s*[:=-])\s*(.+?)(?=\s+(?:and\s+)?(?:my\s+)?(?:email|phone|number|service)\b|[,;\n]|$)/iu,
  )?.[1];
  apply(chatbotConfig.fieldIds.name, explicitName);

  if (!next[chatbotConfig.fieldIds.name] && emailMatch && validPhone) {
    const ignoredSegments = /^(?:sure|okay|ok|hello|hi|hey|here(?: are|'s| is)?|my details(?: are)?|details)$/i;
    const nameCandidate = latestMessage
      .split(/[,;|\n]+/)
      .map((segment) => segment.replace(/^\s*(?:name\s*[:=-]\s*)?/i, "").trim())
      .find((segment) => !segment.includes("@") && !/\d/.test(segment) && !ignoredSegments.test(segment));
    apply(chatbotConfig.fieldIds.name, nameCandidate);
  }

  const serviceQuestion = chatbotConfig.questions.find((question) => question.id === chatbotConfig.fieldIds.service);
  if (serviceQuestion?.type === "choice") {
    const exactService = serviceQuestion.choices?.find((choice) => latestMessage.toLocaleLowerCase().includes(choice.toLocaleLowerCase()));
    apply(chatbotConfig.fieldIds.service, exactService);
  }

  return next;
}

export async function extractLeadAnswers({ messages, answers }: { messages: Pick<ChatMessage, "role" | "content">[]; answers: LeadAnswers }): Promise<LeadExtractionResponse> {
  const groq = getGroqClient();
  let finalError: unknown = new Error("Every extraction model failed.");
  const uncertainServiceUpdate = getUncertainServiceUpdate(messages);

  for (const modelId of extractionModelOrder) {
    try {
      const result = await generateText({
        model: groq(modelId),
        system: extractionPrompt(answers),
        messages: messages.slice(-6),
        output: Output.object({
          name: "LeadFieldUpdates",
          description: "Only explicit lead-field updates and explicit field removals from the visitor.",
          schema: leadExtractionOutputSchema,
        }),
        temperature: 0,
        maxOutputTokens: chatbotConfig.modelLimits.extractionOutputTokens,
        maxRetries: 0,
        timeout: chatbotConfig.modelLimits.extractionTimeoutMs,
        providerOptions: { groq: groqModelOptions(modelId, true) },
      });

      const next = { ...answers };
      const clearedQuestionIds: string[] = [];
      const updatedQuestionIds: string[] = [];
      const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
      const normalizedLatest = latestUserMessage.normalize("NFKC").toLocaleLowerCase();
      const refusedQuestionIds = result.output.refusedQuestionIds.filter((questionId) =>
        chatbotConfig.questions.some((question) => question.id === questionId),
      );

      for (const questionId of result.output.clearQuestionIds) {
        if (!chatbotConfig.questions.some((question) => question.id === questionId)) continue;
        if (questionId in next) {
          delete next[questionId];
          clearedQuestionIds.push(questionId);
        }
      }

      for (const update of result.output.updates) {
        const question = chatbotConfig.questions.find((candidate) => candidate.id === update.questionId);
        if (!question) continue;
        const evidence = update.evidence.trim();
        if (!evidence || !normalizedLatest.includes(evidence.normalize("NFKC").toLocaleLowerCase())) continue;
        const normalized = normalizeAnswer(question, update.value);
        if (!normalized || next[question.id] === normalized) continue;
        if (question.id === chatbotConfig.fieldIds.phone) {
          if (/(?:\d[\p{L}]|[\p{L}]\d)/u.test(evidence)) continue;
          const normalizedEvidence = evidence.normalize("NFKC").toLocaleLowerCase();
          const evidenceStart = normalizedLatest.indexOf(normalizedEvidence);
          const characterBefore = evidenceStart > 0 ? normalizedLatest[evidenceStart - 1] : "";
          const characterAfter = evidenceStart >= 0 ? normalizedLatest[evidenceStart + normalizedEvidence.length] || "" : "";
          if ((/\p{L}/u.test(characterBefore) && /^\d/.test(normalizedEvidence))
            || (/\d$/.test(normalizedEvidence) && /\p{L}/u.test(characterAfter))) continue;
          const normalizedDigits = normalized.replace(/\D/g, "");
          const evidenceContainsSameNumber = (evidence.match(/[+(\d][+()\d\s.-]{5,23}\d/g) || [])
            .some((candidate) => candidate.replace(/\D/g, "") === normalizedDigits);
          if (!evidenceContainsSameNumber) continue;
        }
        if (question.id === chatbotConfig.fieldIds.name) {
          const escapedName = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const directName = new RegExp(`^(?:${escapedName})[.!]?$`, "iu").test(latestUserMessage.trim());
          const introducedName = new RegExp(`\\b(?:my name is|i am|i'm|this is|call me|you can call me)\\s+${escapedName}\\b`, "iu").test(latestUserMessage);
          const leadingName = new RegExp(`^${escapedName}(?:\\s+here)?[,!.]`, "iu").test(latestUserMessage.trim());
          if (!directName && !introducedName && !leadingName) continue;
        }
        next[question.id] = normalized;
        updatedQuestionIds.push(question.id);
      }

      const deterministicallyUpdated = applyDeterministicUpdates(latestUserMessage, next, updatedQuestionIds);
      for (const [questionId, value] of Object.entries(deterministicallyUpdated)) next[questionId] = value;

      if (uncertainServiceUpdate) {
        if (next[uncertainServiceUpdate.questionId] !== uncertainServiceUpdate.value) {
          next[uncertainServiceUpdate.questionId] = uncertainServiceUpdate.value;
          if (!updatedQuestionIds.includes(uncertainServiceUpdate.questionId)) updatedQuestionIds.push(uncertainServiceUpdate.questionId);
        }
        const refusedServiceIndex = refusedQuestionIds.indexOf(uncertainServiceUpdate.questionId);
        if (refusedServiceIndex >= 0) refusedQuestionIds.splice(refusedServiceIndex, 1);
      }

      return { answers: next, updatedQuestionIds, clearedQuestionIds, refusedQuestionIds };
    } catch (error) {
      finalError = error;
      console.error("Chatbot extraction model failed", { model: modelId, error: providerErrorSummary(error) });
    }
  }

  if (uncertainServiceUpdate) {
    return {
      answers: { ...answers, [uncertainServiceUpdate.questionId]: uncertainServiceUpdate.value },
      updatedQuestionIds: answers[uncertainServiceUpdate.questionId] === uncertainServiceUpdate.value ? [] : [uncertainServiceUpdate.questionId],
      clearedQuestionIds: [],
      refusedQuestionIds: [],
    };
  }

  throw finalError;
}
