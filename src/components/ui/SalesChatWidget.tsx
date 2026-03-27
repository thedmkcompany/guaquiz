"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { quizQuestions, calculateQuizResult } from "@/lib/quiz-data";
import type { QuizResult } from "@/types";

const CONFIG = { businessName: "Glow Up Academy", agentName: "Miss Baddie", tagline: "How can we help you today?" };
interface Message { role: "user" | "ai"; content: string; }
interface Lead {
  name: string;
  email: string;
  phone: string;
  company: string;
  challenge: string;
  interestedInTransform?: boolean;
  interestedInStrategy?: boolean;
  recommendation?: string;
  referralSource?: string;
  quizAnswers?: QuizAnswerLite[];
}
const LEAD_RE = /__LEAD__({[\s\S]*?})__LEAD__/;
/** Shown as the third bot message (after two user replies) and optionally when starting quiz if not already shown. */
const QUIZ_INTRO_LINE =
  "Perfect babe, let's do this. I'll ask one question at a time and match you to your best-fit plan.";

const PROGRAM_SLUGS = ["essentials", "webinar", "circle", "transform"] as const;
type ProgramSlug = (typeof PROGRAM_SLUGS)[number];

const PROGRAM_LABELS: Record<ProgramSlug, string> = {
  essentials: "24 Day Challenge",
  webinar: "Webinar",
  circle: "Circle",
  transform: "Transform",
};

const PROGRAM_RESULT_PATHS: Record<ProgramSlug, string> = {
  essentials: "/results/essentials",
  webinar: "/results/webinar",
  circle: "/circle",
  transform: "/transform",
};

interface QuizAnswerLite { questionId: string; selectedOptionIds: string[]; }

function buildQuizCompletionMessage(result: QuizResult, reasonSummary: string): string {
  const primary = result.programSlug as ProgramSlug;
  const scores = result.allScores;
  const others = (["webinar", "essentials", "circle", "transform"] as const)
    .filter((s) => s !== primary)
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
    .map((s) => PROGRAM_LABELS[s]);
  const otherLine =
    others.length > 0
      ? `\n\nAnd babe, you're not stuck with just one option — you can also explore ${others.join(", ")} below if that feels better for you.`
      : "";
  return `Okay love, based on everything you shared, ${PROGRAM_LABELS[primary]} feels like your best next step right now.\n${reasonSummary}${otherLine}`;
}

function buildQuizReasonSummary(answers: QuizAnswerLite[], programSlug: string): string {
  const topSignals = answers
    .map((answer) => {
      const question = quizQuestions.find((q) => q.id === answer.questionId);
      if (!question) return null;
      const option = question.options.find((o) => o.id === answer.selectedOptionIds[0]);
      if (!option) return null;
      const signal = option.scores[programSlug as keyof typeof option.scores] ?? 0;
      return {
        signal,
        // Prefer richer, non-price language for "why this fits" messaging.
        reason: option.description?.trim() || option.text.trim(),
      };
    })
    .filter((item): item is { signal: number; reason: string } => item !== null && item.signal > 0)
    .sort((a, b) => b.signal - a.signal)
    .slice(0, 2);

  if (topSignals.length === 0) {
    return "From what you shared, this lines up really well with your goals, your current capacity, and the kind of support you'll actually use.";
  }

  if (topSignals.length === 1) {
    return `What stood out most is that ${topSignals[0].reason.toLowerCase()}.`;
  }

  return `What really stood out is that ${topSignals[0].reason.toLowerCase()} and ${topSignals[1].reason.toLowerCase()}.`;
}

function extractLead(text: string): { clean: string; lead: Lead | null } {
  const match = text.match(LEAD_RE);
  if (!match) return { clean: text, lead: null };
  try { return { clean: text.replace(LEAD_RE, "").trim(), lead: JSON.parse(match[1]) as Lead }; }
  catch { return { clean: text.replace(LEAD_RE, "").trim(), lead: null }; }
}

export default function SalesChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hey gorgeous, Miss Baddie here. What are we fixing today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswerLite[]>([]);
  const [quizResultSlug, setQuizResultSlug] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [resultLeadTargetSlug, setResultLeadTargetSlug] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showResultLeadModal, setShowResultLeadModal] = useState(false);
  const [savingResultLead, setSavingResultLead] = useState(false);
  const [resultLeadError, setResultLeadError] = useState("");
  const [resultLead, setResultLead] = useState({ name: "", email: "", phone: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const quizIntroLineShownRef = useRef(false);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 250); }, [open]);

  const saveLead = useCallback(async (lead: Lead) => {
    if (leadSaved) return;
    setLeadSaved(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[SalesChatWidget] Lead save returned", res.status);
        }
      }
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.warn("[SalesChatWidget] Lead save request failed (network or server unreachable)");
      }
    }
  }, [leadSaved]);

  const askCurrentQuizQuestion = useCallback((index: number) => {
    const q = quizQuestions[index];
    if (!q) return;
    const options = q.options.map((o, i) => `${i + 1}. ${o.text}`).join("\n");
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: `Q${index + 1}/${quizQuestions.length}: ${q.question}\n${q.subtext ? `${q.subtext}\n` : ""}${options}`,
      },
    ]);
  }, []);

  const startQuiz = useCallback(() => {
    setQuizStarted(true);
    setQuizActive(true);
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizResultSlug(null);
    setQuizResult(null);
    setResultLeadTargetSlug(null);
    setMessages((prev) => {
      if (quizIntroLineShownRef.current) return prev;
      quizIntroLineShownRef.current = true;
      return [...prev, { role: "ai", content: QUIZ_INTRO_LINE }];
    });
    askCurrentQuizQuestion(0);
  }, [askCurrentQuizQuestion]);

  const submitQuizOption = useCallback((optionId: string) => {
    const q = quizQuestions[quizIndex];
    if (!q) return;
    const selected = q.options.find((o) => o.id === optionId);
    const nextAnswers = [...quizAnswers, { questionId: q.id, selectedOptionIds: [optionId] }];
    setQuizAnswers(nextAnswers);
    if (selected) {
      setMessages((prev) => [...prev, { role: "user", content: selected.text }]);
    }

    if (quizIndex < quizQuestions.length - 1) {
      const next = quizIndex + 1;
      setQuizIndex(next);
      askCurrentQuizQuestion(next);
      return;
    }

    const result = calculateQuizResult(nextAnswers as never);
    setQuizResult(result);
    setQuizResultSlug(result.programSlug);
    setQuizActive(false);
    const reasonSummary = buildQuizReasonSummary(nextAnswers, result.programSlug);
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: buildQuizCompletionMessage(result, reasonSummary),
      },
    ]);
  }, [askCurrentQuizQuestion, quizAnswers, quizIndex]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated); setInput(""); setLoading(true);

    if (onboardingStep < 2) {
      const nextPrompt =
        onboardingStep === 0 ? "What’s your #1 glow-up goal right now?" : QUIZ_INTRO_LINE;
      if (onboardingStep === 1) quizIntroLineShownRef.current = true;
      setMessages((prev) => [...prev, { role: "ai", content: nextPrompt }]);
      setOnboardingStep((prev) => prev + 1);
      setLoading(false);
      return;
    }

    if (!quizStarted && /\b(start|take)\b.*\bquiz\b|\bquiz\b/i.test(text)) {
      setLoading(false);
      startQuiz();
      return;
    }
    const controller = new AbortController();
    const timeoutMs = 120_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          userEmail,
        }),
        signal: controller.signal,
      });

      let data: { content?: string; error?: string } = {};
      try {
        data = (await res.json()) as { content?: string; error?: string };
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Something went wrong reading the response. Please try again." },
        ]);
        return;
      }

      if (!res.ok) {
        const fallback =
          data.content ??
          (res.status === 429
            ? "Hey gorgeous, to continue chatting with Miss Baddie please choose a plan and enroll first. Start here: gua.thedmk.online/programs"
            : res.status === 503
              ? "The assistant isn't available right now. Please try again in a moment."
              : res.status === 502
                ? "Our AI service had a problem. Please try again shortly."
                : "Something went wrong. Please try again.");
        setMessages((prev) => [...prev, { role: "ai", content: fallback }]);
        return;
      }

      const { clean, lead } = extractLead(data.content ?? "Sorry, I had trouble responding.");
      setMessages((prev) => [...prev, { role: "ai", content: clean }]);
      if (lead?.email) setUserEmail(lead.email);
      if (lead?.email && lead?.name && lead?.phone) await saveLead(lead);
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: aborted
            ? "That took too long — please try a shorter message or try again."
            : "Connection issue — check that the site is open on the same address as the dev server (e.g. http://localhost:3000) and try again.",
        },
      ]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const submitResultLeadAndContinue = async () => {
    const name = resultLead.name.trim();
    const email = resultLead.email.trim().toLowerCase();
    const phone = resultLead.phone.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneDigits = phone.replace(/\D/g, "");
    if (!name || !email || !phone) {
      setResultLeadError("Please fill name, email, and phone.");
      return;
    }
    if (!emailOk) {
      setResultLeadError("Please enter a valid email.");
      return;
    }
    if (phoneDigits.length < 10) {
      setResultLeadError("Please enter a valid phone number.");
      return;
    }
    if (!quizResultSlug) {
      setResultLeadError("Result is not available right now. Please retry.");
      return;
    }
    const chosenSlug = (resultLeadTargetSlug ?? quizResultSlug) as ProgramSlug;

    setSavingResultLead(true);
    setResultLeadError("");
    try {
      const topMatch = quizResult?.programSlug ?? quizResultSlug;
      const payload: Lead = {
        name,
        email,
        phone,
        company: "Quiz Result",
        challenge: `Requested path: ${chosenSlug} (quiz top match: ${topMatch})`,
        interestedInTransform: chosenSlug === "transform",
        interestedInStrategy: chosenSlug === "transform",
        recommendation: chosenSlug,
        referralSource: "chat_result_popup",
        quizAnswers,
      };
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setResultLeadError("Could not save your details. Please try again.");
        return;
      }
      setShowResultLeadModal(false);
      setUserEmail(email);
      setResultLeadTargetSlug(null);
      window.location.href = PROGRAM_RESULT_PATHS[chosenSlug];
    } catch {
      setResultLeadError("Network issue. Please try again.");
    } finally {
      setSavingResultLead(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="scw-root">
        {open && (
          <div className="scw-window">
            <div className="scw-header">
              <img
                className="scw-avatar-img"
                src="/images/baddie.jpeg"
                alt="Miss Baddie"
                width={38}
                height={38}
              />
              <div className="scw-header-info">
                <div className="scw-header-name">{CONFIG.agentName} · {CONFIG.businessName}</div>
                <div className="scw-header-status"><span className="scw-dot" /><span className="scw-status-text">Online · Replies instantly</span></div>
              </div>
              <button className="scw-close" onClick={() => setOpen(false)} aria-label="Close chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="scw-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`scw-msg scw-msg--${msg.role}`}>
                  {msg.role === "ai" ? (
                    <img
                      className="scw-msg-avatar-img"
                      src="/images/baddie.jpeg"
                      alt="Miss Baddie"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <div className="scw-msg-avatar">U</div>
                  )}
                  <div className="scw-bubble">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="scw-msg scw-msg--ai">
                  <img
                    className="scw-msg-avatar-img"
                    src="/images/baddie.jpeg"
                    alt="Miss Baddie"
                    width={28}
                    height={28}
                  />
                  <div className="scw-typing"><span /><span /><span /></div>
                </div>
              )}
              {!quizStarted && !quizActive && onboardingStep >= 2 && (
                <div className="scw-quiz-cta-wrap">
                  <button className="scw-quiz-cta" onClick={startQuiz}>
                    Let's get started!
                  </button>
                </div>
              )}
              {quizActive && (
                <div className="scw-quiz-options">
                  {quizQuestions[quizIndex]?.options.map((opt) => (
                    <button
                      key={opt.id}
                      className="scw-quiz-option-btn"
                      onClick={() => submitQuizOption(opt.id)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
              {quizResultSlug && (
                <>
                  <div className="scw-quiz-cta-wrap">
                    <button
                      type="button"
                      className="scw-quiz-cta"
                      onClick={() => {
                        setResultLeadTargetSlug(quizResultSlug);
                        setShowResultLeadModal(true);
                      }}
                    >
                      Take me to {PROGRAM_LABELS[quizResultSlug as ProgramSlug]}
                    </button>
                  </div>
                  <div className="scw-result-alt-label">Or explore another path — no pressure:</div>
                  <div className="scw-result-alt-grid">
                    {PROGRAM_SLUGS.filter((s) => s !== quizResultSlug).map((slug) => (
                      <button
                        key={slug}
                        type="button"
                        className="scw-quiz-option-btn"
                        onClick={() => {
                          setResultLeadTargetSlug(slug);
                          setShowResultLeadModal(true);
                        }}
                      >
                        {PROGRAM_LABELS[slug]}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="scw-input-area">
              <textarea ref={inputRef} className="scw-input" placeholder="Type your message…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} rows={1} />
              <button className="scw-send" onClick={sendMessage} disabled={loading || !input.trim()} aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
            <div className="scw-branding">Powered by Claude AI</div>
          </div>
        )}
        {showResultLeadModal && (
          <div className="scw-modal-overlay" role="dialog" aria-modal="true" aria-label="Enter contact information">
            <div className="scw-modal">
              <div className="scw-modal-title">Before we show your result</div>
              <div className="scw-modal-subtitle">
                {resultLeadTargetSlug || quizResultSlug
                  ? `Share your details to continue to ${PROGRAM_LABELS[(resultLeadTargetSlug ?? quizResultSlug) as ProgramSlug]}.`
                  : "Share your details to continue."}
              </div>
              <input
                className="scw-modal-input"
                placeholder="Full name"
                value={resultLead.name}
                onChange={(e) => setResultLead((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                className="scw-modal-input"
                placeholder="Email"
                type="email"
                value={resultLead.email}
                onChange={(e) => setResultLead((prev) => ({ ...prev, email: e.target.value }))}
              />
              <input
                className="scw-modal-input"
                placeholder="Phone number"
                value={resultLead.phone}
                onChange={(e) => setResultLead((prev) => ({ ...prev, phone: e.target.value }))}
              />
              {resultLeadError && <div className="scw-modal-error">{resultLeadError}</div>}
              <div className="scw-modal-actions">
                <button
                  className="scw-modal-cancel"
                  onClick={() => {
                    setShowResultLeadModal(false);
                    setResultLeadTargetSlug(null);
                  }}
                  disabled={savingResultLead}
                >
                  Cancel
                </button>
                <button className="scw-modal-submit" onClick={submitResultLeadAndContinue} disabled={savingResultLead}>
                  {savingResultLead ? "Saving..." : "Continue to result"}
                </button>
              </div>
            </div>
          </div>
        )}
        {!open && <div className="scw-prompt">Talk to me!</div>}
        <button className="scw-trigger" onClick={() => setOpen((o) => !o)} aria-label="Toggle chat">
          <img src="/images/kissie-icon.jpeg" alt="Chat with Miss Baddie" width="28" height="28" className="scw-trigger-icon" />
        </button>
      </div>
    </>
  );
}

const CSS = `
.scw-root * { box-sizing: border-box; margin: 0; padding: 0; }
.scw-root { font-family: var(--font-be-vietnam-pro), sans-serif; --scw-ivory: #FFFFF0; --scw-ivory-deep: #F5F0E6; --scw-burgundy: #722F37; --scw-burgundy-dark: #5a252c; --scw-burgundy-muted: rgba(114,47,55,0.14); }
.scw-trigger { position: fixed; bottom: 28px; right: 28px; z-index: 9999; width: 58px; height: 58px; border-radius: 50%; background: var(--scw-ivory); color: var(--scw-burgundy); border: 2px solid var(--scw-burgundy-muted); cursor: pointer; box-shadow: 0 8px 28px rgba(114,47,55,0.18); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; overflow: hidden; }
.scw-trigger:hover { transform: scale(1.08); }
.scw-trigger-icon { width: 40px; height: 40px; object-fit: cover; object-position: center; transform: scale(1.1); display: block; }
.scw-prompt { position: fixed; bottom: 42px; right: 98px; z-index: 9999; background: var(--scw-ivory); color: var(--scw-burgundy); border: 1px solid var(--scw-burgundy-muted); border-radius: 999px; padding: 9px 14px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 28px rgba(114,47,55,0.12); animation: scw-float-prompt 2.2s ease-in-out infinite; }
.scw-prompt::after { content: ""; position: absolute; right: -6px; top: 50%; width: 10px; height: 10px; transform: translateY(-50%) rotate(45deg); background: var(--scw-ivory); border-right: 1px solid var(--scw-burgundy-muted); border-top: 1px solid var(--scw-burgundy-muted); }
@keyframes scw-float-prompt { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.scw-window { position: fixed; bottom: 98px; right: 28px; z-index: 9998; width: 375px; height: 555px; background: var(--scw-ivory); border-radius: 20px; border: 1px solid var(--scw-burgundy-muted); box-shadow: 0 24px 80px rgba(114,47,55,0.22); display: flex; flex-direction: column; overflow: hidden; animation: scw-in 0.28s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes scw-in { from { opacity:0; transform: translateY(20px) scale(0.96); } to { opacity:1; transform: none; } }
.scw-header { background: var(--scw-ivory-deep); padding: 16px 18px; border-bottom: 1px solid var(--scw-burgundy-muted); display: flex; align-items: center; gap: 11px; }
.scw-avatar-img { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; object-fit: cover; border: 2px solid var(--scw-burgundy-muted); }
.scw-header-info { flex: 1; }
.scw-header-name { font-size: 14px; font-weight: 600; color: var(--scw-burgundy); }
.scw-header-status { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.scw-dot { width: 6px; height: 6px; border-radius: 50%; background: #2d8a4e; flex-shrink: 0; }
.scw-status-text { font-size: 11px; color: rgba(114,47,55,0.65); font-weight: 400; }
.scw-close { background: none; border: none; cursor: pointer; color: rgba(114,47,55,0.55); padding: 4px; transition: color 0.15s; }
.scw-close:hover { color: var(--scw-burgundy); }
.scw-messages { flex: 1; overflow-y: auto; padding: 18px 14px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: var(--scw-burgundy-muted) transparent; background: var(--scw-ivory); }
.scw-msg { display: flex; gap: 8px; animation: scw-msg 0.18s ease; }
@keyframes scw-msg { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
.scw-msg--user { flex-direction: row-reverse; }
.scw-msg-avatar-img { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; object-fit: cover; border: 1px solid var(--scw-burgundy-muted); }
.scw-msg-avatar { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: var(--scw-burgundy); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: var(--scw-ivory); margin-top: 2px; }
.scw-msg--user .scw-msg-avatar { background: var(--scw-burgundy-dark); color: var(--scw-ivory); }
.scw-bubble { max-width: 76%; padding: 9px 13px; border-radius: 16px; font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; }
.scw-msg--ai .scw-bubble { background: #fffef8; color: #3d1f24; border-bottom-left-radius: 4px; border: 1px solid var(--scw-burgundy-muted); }
.scw-msg--user .scw-bubble { background: var(--scw-burgundy); color: var(--scw-ivory); border-bottom-right-radius: 4px; font-weight: 500; }
.scw-quiz-cta-wrap { display: flex; justify-content: center; margin: 6px 0 2px; }
.scw-quiz-cta { background: linear-gradient(135deg, var(--scw-burgundy), var(--scw-burgundy-dark)); color: var(--scw-ivory); border: 0; border-radius: 999px; padding: 10px 16px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; box-shadow: 0 6px 16px rgba(114,47,55,0.35); }
.scw-result-alt-label { font-size: 11px; color: rgba(114,47,55,0.72); text-align: center; margin: 10px 4px 6px; font-weight: 600; letter-spacing: 0.02em; line-height: 1.35; }
.scw-result-alt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 2px 0 10px; padding: 0 2px; }
.scw-quiz-options { display: grid; gap: 8px; margin: 8px 0 4px; }
.scw-quiz-option-btn { text-align: left; background: var(--scw-ivory-deep); border: 1px solid var(--scw-burgundy-muted); color: #3d1f24; border-radius: 12px; padding: 10px 12px; font-size: 12.5px; line-height: 1.4; cursor: pointer; }
.scw-quiz-option-btn:hover { border-color: var(--scw-burgundy); background: #fffef8; }
.scw-typing { display: flex; gap: 4px; padding: 11px 13px; background: #fffef8; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid var(--scw-burgundy-muted); }
.scw-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--scw-burgundy); opacity: 0.55; animation: scw-bounce 1.2s infinite; }
.scw-typing span:nth-child(2) { animation-delay: 0.2s; }
.scw-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes scw-bounce { 0%,60%,100%{transform:translateY(0);opacity:.45} 30%{transform:translateY(-5px);opacity:1} }
.scw-input-area { padding: 12px 14px; background: var(--scw-ivory-deep); border-top: 1px solid var(--scw-burgundy-muted); display: flex; gap: 9px; align-items: flex-end; }
.scw-input { flex: 1; background: var(--scw-ivory); border: 1px solid var(--scw-burgundy-muted); border-radius: 12px; padding: 9px 13px; color: #3d1f24; font-size: 13.5px; font-family: inherit; font-weight: 400; resize: none; outline: none; min-height: 38px; max-height: 96px; line-height: 1.5; transition: border-color 0.2s; }
.scw-input::placeholder { color: rgba(114,47,55,0.45); }
.scw-input:focus { border-color: var(--scw-burgundy); }
.scw-send { width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0; background: var(--scw-burgundy); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--scw-ivory); transition: opacity 0.15s, transform 0.15s; }
.scw-send:hover:not(:disabled) { transform: scale(1.06); }
.scw-send:disabled { background: rgba(114,47,55,0.25); color: rgba(114,47,55,0.4); cursor: not-allowed; }
.scw-branding { text-align: center; padding: 7px; font-size: 10px; color: rgba(114,47,55,0.45); background: var(--scw-ivory-deep); }
.scw-modal-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(61,31,36,0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.scw-modal { width: min(92vw, 360px); background: var(--scw-ivory); border: 1px solid var(--scw-burgundy-muted); border-radius: 16px; padding: 16px; box-shadow: 0 18px 48px rgba(114,47,55,0.25); }
.scw-modal-title { color: var(--scw-burgundy); font-weight: 700; font-size: 15px; }
.scw-modal-subtitle { color: rgba(114,47,55,0.65); font-size: 12px; margin-top: 3px; margin-bottom: 12px; }
.scw-modal-input { width: 100%; background: #fffef8; border: 1px solid var(--scw-burgundy-muted); border-radius: 10px; padding: 10px 12px; color: #3d1f24; font-size: 13px; margin-bottom: 8px; outline: none; }
.scw-modal-input:focus { border-color: var(--scw-burgundy); }
.scw-modal-error { color: #9b2335; font-size: 12px; margin: 4px 2px 0; }
.scw-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.scw-modal-cancel { background: transparent; border: 1px solid var(--scw-burgundy-muted); color: var(--scw-burgundy); border-radius: 10px; padding: 9px 12px; font-size: 12.5px; cursor: pointer; }
.scw-modal-submit { background: linear-gradient(135deg, var(--scw-burgundy), var(--scw-burgundy-dark)); color: var(--scw-ivory); border: 0; border-radius: 10px; padding: 9px 12px; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.scw-modal-cancel:disabled, .scw-modal-submit:disabled { opacity: 0.7; cursor: not-allowed; }
@media (max-width: 420px) { .scw-window { width: calc(100vw - 16px); right: 8px; bottom: 86px; height: 68vh; } }
`;


