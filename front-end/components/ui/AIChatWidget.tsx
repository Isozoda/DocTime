"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";
import { X, Send, Bot, Lock } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const AI_RESPONSES: Record<string, string> = {
  "find": "I can help you find a doctor! Go to the **Doctors** page and use the filters — you can search by specialty, city, and availability. You can also use the **Map** view to find doctors near you.",
  "book": "To book an appointment: 1) Find your doctor on the Doctors page. 2) Click their card. 3) On their profile, select an available time slot. 4) Fill in your info and confirm. It takes less than 2 minutes!",
  "appointment": "You can view all your appointments in your **Patient Dashboard** → Appointments. There you can see upcoming, past, and cancelled appointments.",
  "cancel": "To cancel a booking, go to your **Dashboard → Appointments**, find the appointment and click Cancel. Please cancel at least 2 hours before the scheduled time.",
  "doctor": "DocTime has 200+ verified doctors across Dushanbe, Khujand, and Bokhtar. All doctors are licensed and verified by our team. You can filter by specialty, city, rating, and availability.",
  "map": "Our interactive **Map** shows all doctors plotted across Tajikistan. You can filter by city and specialty, then click any marker to see the doctor's info and book directly.",
  "hello": "Hello! I'm DocTime AI, your healthcare assistant. I can help you find doctors, book appointments, and navigate the platform. What can I help you with?",
  "hi": "Hi there! How can I help you today? I can assist with finding doctors, booking appointments, or answering questions about DocTime.",
  "price": "Consultation prices start from 80 TJS and vary by doctor and specialty. You can see each doctor's price on their profile card.",
  "default": "I'm here to help you with DocTime! I can assist with:\n\n• Finding the right doctor\n• Booking appointments\n• Understanding our platform\n• Checking appointment status\n\nFor medical questions, please consult a qualified doctor — I can help you find one!",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return response;
  }
  return AI_RESPONSES.default;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
      >
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-primary/10 border border-primary/20">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AIChatWidget() {
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations("ai");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: t("welcome"),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const QUICK_ACTIONS = [t("action1"), t("action2"), t("action3"), t("action4")];

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim(), time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{ animation: "pulse-ring 2s ease-out infinite", background: "rgba(99,102,241,0.35)" }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{ animation: "pulse-ring 2s ease-out infinite 0.8s", background: "rgba(99,102,241,0.25)" }}
            />
            <button
              onClick={() => setOpen(true)}
              className="relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                boxShadow: "0 0 24px rgba(99,102,241,0.5), 0 4px 20px rgba(0,0,0,0.3)",
              }}
              aria-label="Open AI chat"
            >
              <Bot className="h-6 w-6 text-white" />
              <span
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: "linear-gradient(135deg, #22D3EE, #6366F1)" }}
              >
                AI
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl overflow-hidden flex flex-col animate-slide-up border border-border shadow-2xl"
          style={{ height: "520px", backdropFilter: "blur(28px) saturate(180%)" }}
        >
          {/* Themed background layer */}
          <div className="absolute inset-0 bg-background/95 pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3.5 shrink-0 border-b border-border z-10"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{t("title")}</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{t("online")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-primary/15 border border-primary/30 text-primary">
                GPT-4o
              </span>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages / Gate */}
          {!isAuthenticated ? (
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{ top: `${15 + i * 10}%`, left: `${10 + (i * 13) % 80}%`, animationDelay: `${i * 0.7}s` }}
                  />
                ))}
              </div>
              <div className="relative h-16 w-16 rounded-2xl flex items-center justify-center mb-5 bg-primary/10 border border-primary/25">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{t("signInTitle")}</h3>
              <p className="text-sm leading-relaxed mb-6 text-muted-foreground">{t("signInDesc")}</p>
              <Link
                href="/auth/register"
                className="btn-primary w-full text-center mb-3"
                style={{ borderRadius: "12px" }}
                onClick={() => setOpen(false)}
              >
                {t("createAccount")}
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {t("hasAccount")} <span className="text-primary font-medium">{t("signIn")}</span>
              </Link>
            </div>
          ) : (
            <div className="relative flex-1 flex flex-col overflow-hidden z-10">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 mb-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                      >
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className="max-w-[78%]">
                      <div
                        className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "text-white rounded-[18px_18px_4px_18px]"
                            : "text-foreground bg-primary/10 border border-primary/20 rounded-[4px_18px_18px_18px]"
                        }`}
                        style={
                          msg.role === "user"
                            ? { background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }
                            : undefined
                        }
                      >
                        {msg.text.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < msg.text.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] mt-1 px-1 text-muted-foreground/60">{msg.time}</p>
                    </div>
                  </div>
                ))}
                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Quick action chips */}
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 bg-primary/8 border border-primary/25 text-primary"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-3 py-3 shrink-0 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                    placeholder={t("placeholder")}
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl outline-none bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
