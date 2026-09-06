"use client";

import { MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { chatbotConfig } from "../config";
import { buildConfirmationSummary, getMissingQuestions, getQuestionProgress, hasAllRequiredAnswers } from "../core/qualification";
import type { ChatMessage, ChatSessionStatus, LeadAnswers, LeadExtractionResponse, LeadSubmissionResponse, LocalChatState } from "../types";
import ChatComposer from "./ChatComposer";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import LeadProgress from "./LeadProgress";
import { clearChatState, loadChatState, saveChatState } from "./chat-storage";

function message(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString() };
}

function initialMessages() { return [message("assistant", chatbotConfig.welcomeMessage)]; }

function sourceData() {
  const params = new URLSearchParams(window.location.search);
  return { page: window.location.href, referrer: document.referrer, utmSource: params.get("utm_source") || undefined, utmCampaign: params.get("utm_campaign") || undefined };
}

function modelMessages(messages: ChatMessage[]) {
  return messages.slice(-chatbotConfig.recentMessagesForModel).map(({ role, content }) => ({ role, content }));
}

function isSubmissionConfirmation(content: string) {
  return /^(?:(?:yes|yeah|yep|sure|okay|ok)[,.!]?\s*)?(?:submit(?:\s+(?:it|inquiry|my inquiry))?|confirm(?:\s+(?:it|submission|my inquiry))?|send(?:\s+(?:it|my inquiry))?|go\s+(?:on|ahead)|proceed|do\s+it)(?:\s+(?:please|now))?[.!]?$/i.test(content)
    || /^(?:i\s+)?(?:want|wanna|would like)\s+to\s+(?:confirm|submit|send)(?:\s+(?:it|my inquiry|the inquiry))?[.!]?$/i.test(content);
}

function pendingSubmissionMessage(answers: LeadAnswers) {
  const missing = getMissingQuestions(answers);
  if (!missing.length) return "Your details are ready, but they haven't been submitted yet. Submit when you're ready, or type any correction first.";
  const labels = missing.map((question) => question.label.toLowerCase()).join(" and ");
  return `I can't submit the inquiry just yet because I still need your ${labels}. ${missing[0].prompt}`;
}

function looksLikePrematureCompletion(content: string, answers: LeadAnswers, mode: "qualifying" | "editing" | "confirming" | "complete") {
  if (mode === "complete") return false;
  const hasMissingDetails = getMissingQuestions(answers).length > 0;
  const claimsSubmission = hasMissingDetails && /\b(?:submitted|confirmed|received|sent|routed|completed)\b|\b(?:our team|we)\s+will\s+(?:contact|call|reach out|get back)\b|\bexpect\s+(?:a\s+)?follow-up\b/i.test(content);
  const claimsDetailsComplete = hasMissingDetails
    && /\b(?:all set|have everything|everything (?:is|looks) (?:complete|ready)|details are complete)\b/i.test(content);
  return claimsSubmission || claimsDetailsComplete;
}

function ensureMissingQuestion(content: string, answers: LeadAnswers, mode: "qualifying" | "editing" | "confirming" | "complete") {
  if (mode === "complete") return content.trim();
  const missing = getMissingQuestions(answers);
  if (!missing.length) return content.trim();
  const nextQuestion = missing[0];
  const conversationalText = content
    .replace(/[^.!?\n]*\?/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
  return conversationalText
    ? `${conversationalText}\n\n${nextQuestion.prompt}`
    : nextQuestion.prompt;
}

function isNewInquiryAttempt(content: string) {
  return [
    /\b(?:new|another|second|different)\s+(?:inquiry|request|project|service|boiler|automation|supply)\b/i,
    /\b(?:start|submit|send)\s+(?:over|again|another)\b/i,
    /\b(?:change|edit|update)\s+(?:my\s+)?(?:inquiry|request|details)\b/i,
    /\b(?:i|we)\s+(?:need|want|would like|are looking for)\b.{0,60}\b(?:boiler|fabrication|inspection|chemical|biomass|coal|service|system|project|automation|instrumentation)\b/i,
  ].some((pattern) => pattern.test(content));
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [answers, setAnswers] = useState<LeadAnswers>({});
  const [status, setStatus] = useState<ChatSessionStatus>("collecting");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [submissionLockedUntil, setSubmissionLockedUntil] = useState<string>();
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const streamedText = useRef("");

  const progress = useMemo(() => getQuestionProgress(answers), [answers]);
  const quickActions = useMemo(() => {
    if (status === "confirming") return ["Submit inquiry"];
    if (!messages.some((item) => item.role === "user")) return [...chatbotConfig.starterPrompts];
    return [];
  }, [messages, status]);

  useEffect(() => {
    for (const key of chatbotConfig.legacyLocalStorageKeys) clearChatState(key);
    const cached = loadChatState(chatbotConfig.localStorageKey);
    if (cached) {
      queueMicrotask(() => {
        setMessages(cached.messages);
        setAnswers(cached.answers);
        setStatus(cached.status);
        setSubmissionId(cached.submissionId);
        setSubmissionLockedUntil(cached.submissionLockedUntil);
        setHydrated(true);
      });
    } else {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const completed = status === "submitted" || status === "duplicate";
      const expiresAt = completed && submissionLockedUntil
        ? submissionLockedUntil
        : new Date(Date.now() + chatbotConfig.localStorageTtlMs).toISOString();
      const state: LocalChatState = { version: 6, expiresAt, submissionId, messages, status, answers, submissionLockedUntil };
      saveChatState(chatbotConfig.localStorageKey, state, chatbotConfig.messagesStoredLocally);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [answers, hydrated, messages, status, submissionId, submissionLockedUntil]);

  useEffect(() => {
    if ((status !== "submitted" && status !== "duplicate") || !submissionLockedUntil) return;
    const remaining = Date.parse(submissionLockedUntil) - Date.now();
    if (remaining <= 0) {
      queueMicrotask(startFreshConversation);
      return;
    }
    const timer = window.setTimeout(startFreshConversation, remaining);
    return () => window.clearTimeout(timer);
  }, [status, submissionLockedUntil]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function streamAssistant(conversation: ChatMessage[], currentAnswers: LeadAnswers, mode: "qualifying" | "editing" | "confirming" | "complete", refusedQuestionIds: string[] = []) {
    const assistantId = crypto.randomUUID();
    setMessages([...conversation, { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() }]);
    const response = await fetch(chatbotConfig.apiPaths.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: modelMessages(conversation), answers: currentAnswers, mode, refusedQuestionIds, website: "" }),
    });
    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error || "Unable to get a response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    streamedText.current = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      streamedText.current += chunk;
      setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + chunk } : item));
    }
    if (!streamedText.current.trim()) throw new Error("The assistant returned an empty response.");
    const safeMessage = looksLikePrematureCompletion(streamedText.current, currentAnswers, mode)
      ? pendingSubmissionMessage(currentAnswers)
      : ensureMissingQuestion(streamedText.current, currentAnswers, mode);
    if (safeMessage !== streamedText.current) {
      setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: safeMessage } : item));
    }
  }

  async function captureAnswers(conversation: ChatMessage[], currentAnswers: LeadAnswers) {
    const response = await fetch(chatbotConfig.apiPaths.extract, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: modelMessages(conversation), answers: currentAnswers, website: "" }),
    });
    const data = await response.json() as LeadExtractionResponse & { error?: string };
    if (!response.ok) throw new Error(data.error || "Unable to safely interpret those details.");
    return data;
  }

  function appendConfirmation(nextAnswers: LeadAnswers, updatedQuestionIds: string[], wasEditing: boolean) {
    const configuredName = nextAnswers[chatbotConfig.fieldIds.name];
    const name = configuredName ? `, ${configuredName}` : "";
    const updatedLabels = chatbotConfig.questions
      .filter((question) => updatedQuestionIds.includes(question.id))
      .map((question) => question.label.toLowerCase());
    const updateNote = updatedLabels.length
      ? `I've updated your ${updatedLabels.join(" and ")} and kept everything else unchanged.`
      : "I've kept your details exactly as provided.";
    const introduction = wasEditing
      ? `All set${name} - ${updateNote}`
      : `Thanks${name} - I have everything I need.`;

    setMessages((current) => [
      ...current,
      message("assistant", `${introduction} Take a quick look:\n\n${buildConfirmationSummary(nextAnswers)}\n\nSubmit when you're ready, or type any correction you'd like me to make.`),
    ]);
  }

  async function handleNaturalConversation(conversation: ChatMessage[], mode: "qualifying" | "editing" | "confirming", currentAnswers: LeadAnswers) {
    setBusy(true);
    setMessages(conversation);
    try {
      let extracted: LeadExtractionResponse = { answers: currentAnswers, updatedQuestionIds: [], clearedQuestionIds: [], refusedQuestionIds: [] };
      try {
        extracted = await captureAnswers(conversation, currentAnswers);
      } catch {
        setError("I couldn't safely capture new details from that message. Please rephrase anything you'd like me to save.");
      }

      const changed = extracted.updatedQuestionIds.length > 0 || extracted.clearedQuestionIds.length > 0;
      const complete = hasAllRequiredAnswers(extracted.answers);
      const shouldConfirm = complete && (changed || status === "editing" || status === "collecting");
      setAnswers(extracted.answers);
      if (shouldConfirm) {
        setStatus("confirming");
      } else if (changed) {
        setStatus(mode === "qualifying" ? "collecting" : "editing");
      }
      if (shouldConfirm) {
        appendConfirmation(extracted.answers, extracted.updatedQuestionIds, mode === "editing" || mode === "confirming");
        return;
      }

      const responseMode = mode === "confirming" && (!complete || changed) ? "editing" : mode;
      await streamAssistant(conversation, extracted.answers, responseMode, extracted.refusedQuestionIds);
    } catch (reason) {
      setMessages((current) => {
        const last = current.at(-1);
        if (last?.role === "assistant" && !last.content) return current.slice(0, -1).concat(message("assistant", "I hit a brief connection issue. Could you say that once more?"));
        return current;
      });
      setError(reason instanceof Error ? reason.message : "Unable to respond.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(conversation: ChatMessage[]) {
    setBusy(true);
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch(chatbotConfig.apiPaths.leads, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, confirmed: true, answers, recentMessages: modelMessages(conversation), source: sourceData(), website: "" }),
      });
      const data = await response.json() as LeadSubmissionResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to save your inquiry.");
      setSubmissionLockedUntil(new Date(Date.now() + chatbotConfig.localStorageTtlMs).toISOString());
      setStatus(data.status);
      setMessages([...conversation, message("assistant", data.message)]);
    } catch (reason) {
      setStatus("confirming");
      setError(reason instanceof Error ? reason.message : "Unable to save your inquiry.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(providedMessage?: string) {
    const content = (providedMessage ?? input).trim();
    if (!content || busy) return;
    setInput("");
    setError("");
    const conversation = [...messages, message("user", content)];

    if (status === "submitted" || status === "duplicate") {
      if (isNewInquiryAttempt(content)) {
        setMessages([...conversation, message("assistant", chatbotConfig.newInquiryLockedMessage)]);
        return;
      }
      setBusy(true);
      setMessages(conversation);
      try { await streamAssistant(conversation, answers, "complete"); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to respond."); }
      finally { setBusy(false); }
      return;
    }

    if (isSubmissionConfirmation(content)) {
      if (status === "confirming" && hasAllRequiredAnswers(answers)) {
        setMessages(conversation);
        await submitLead(conversation);
      } else {
        setMessages([...conversation, message("assistant", pendingSubmissionMessage(answers))]);
      }
      return;
    }

    const mode = status === "confirming" ? "confirming" : status === "editing" ? "editing" : "qualifying";
    await handleNaturalConversation(conversation, mode, answers);
  }

  function startFreshConversation() {
    clearChatState(chatbotConfig.localStorageKey);
    setMessages(initialMessages());
    setAnswers({});
    setStatus("collecting");
    setSubmissionId(crypto.randomUUID());
    setSubmissionLockedUntil(undefined);
    setInput("");
    setError("");
  }

  function resetConversation() {
    if (busy) return;
    if ((status === "submitted" || status === "duplicate") && submissionLockedUntil && Date.parse(submissionLockedUntil) > Date.now()) {
      setMessages((current) => [...current, message("assistant", chatbotConfig.newInquiryLockedMessage)]);
      return;
    }
    startFreshConversation();
  }

  return (
    <div className="fixed bottom-0 right-0 z-[2147483647] isolate">
      {open && (
        <section className="fixed bottom-[126px] right-3 flex h-[min(620px,calc(100dvh-150px))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-bordercol bg-white shadow-[0_24px_70px_rgba(7,21,44,0.2)] sm:bottom-[142px] sm:right-[18px]" role="dialog" aria-labelledby="aerotherm-chat-title">
          <ChatHeader onClose={() => setOpen(false)} onReset={resetConversation} busy={busy} />
          <LeadProgress progress={progress} />
          <ChatMessages messages={messages} busy={busy} />
          {quickActions.length > 0 && <div className="flex gap-1.5 overflow-x-auto border-t border-bordercol bg-white px-3.5 py-2.5">{quickActions.map((action) => <button key={action} type="button" disabled={busy} onClick={() => sendMessage(action)} className="shrink-0 rounded-full border border-bordercol bg-panel px-3 py-1.5 text-[10px] font-medium text-steel transition-colors hover:border-primary-2 hover:bg-muted hover:text-primary-1 disabled:opacity-50">{action}</button>)}</div>}
          {error && <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-[10px] font-medium text-amber-800" role="alert">{error}</div>}
          <ChatComposer value={input} onChange={setInput} onSubmit={() => sendMessage()} busy={busy} />
        </section>
      )}
      {!open && <div className="fixed bottom-[68px] right-[14px] flex items-center gap-2 sm:bottom-[82px] sm:right-[18px]"><span className="hidden items-center gap-1.5 rounded-full border border-bordercol bg-white px-3 py-2 text-[10px] font-medium text-steel shadow-[0_10px_28px_rgba(7,21,44,0.14)] sm:flex"><Sparkles className="h-3 w-3 text-primary-2" />Ask {chatbotConfig.assistantName}</span><button type="button" onClick={() => setOpen(true)} className="chatbot-float-button relative" aria-label={`Open ${chatbotConfig.brandName} chat`} aria-expanded={open}><span className="whatsapp-wave" /><span className="whatsapp-wave whatsapp-wave-delay" /><MessageCircle className="relative z-10 h-5 w-5" /></button></div>}
      {open && <button type="button" onClick={() => setOpen(false)} className="chatbot-float-button fixed bottom-[68px] right-[14px] sm:bottom-[82px] sm:right-[18px]" aria-label={`Close ${chatbotConfig.brandName} chat`}><X className="relative z-10 h-5 w-5" /></button>}
    </div>
  );
}
