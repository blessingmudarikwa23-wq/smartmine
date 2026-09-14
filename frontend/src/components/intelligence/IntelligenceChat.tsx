import {
  ArrowUp,
  BrainCircuit,
  LoaderCircle,
  MessageSquareText,
  Sparkles,
  User,
} from "lucide-react";
import {
  useRef,
  useState,
  type FormEvent,
} from "react";

import type {
  IntelligenceMessage,
  MineSnapshot,
} from "../../pages/SmartIntelligence";

import { askSmartMineAI } from "../../services/intelligenceApi";

type IntelligenceChatProps = {
  messages: IntelligenceMessage[];
  snapshot: MineSnapshot;
  isThinking: boolean;
  setIsThinking: (value: boolean) => void;
  onMessageAdded: (
    message: IntelligenceMessage,
  ) => void;
};

const suggestions = [
  "Why is today's production below target?",
  "Which operational risks should I address first?",
  "Analyse equipment performance.",
  "Give me today's management priorities.",
];

function IntelligenceChat({
  messages,
  snapshot,
  isThinking,
  setIsThinking,
  onMessageAdded,
}: IntelligenceChatProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const submitQuestion = async (
    event?: FormEvent,
    suggestedQuestion?: string,
  ) => {
    event?.preventDefault();

    const question =
      suggestedQuestion?.trim() || input.trim();

    if (!question || isThinking) {
      return;
    }

    const userMessage: IntelligenceMessage = {
      id: Date.now(),
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    onMessageAdded(userMessage);
    setInput("");
    setIsThinking(true);

    try {
      const answer = await askSmartMineAI(
        question,
        snapshot,
      );

      onMessageAdded({
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (error) {
      console.error(error);

      onMessageAdded({
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I could not reach the SmartMine AI service. Please check that the FastAPI intelligence endpoint is running and that the AI provider is configured on the backend.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } finally {
      setIsThinking(false);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <section className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
              <BrainCircuit size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                SmartMine AI Assistant
              </h2>

              <p className="text-xs text-slate-400">
                Operational intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:flex">
            <Sparkles size={12} />
            AI READY
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-[#d8a83e]">
                  <BrainCircuit size={17} />
                </div>
              )}

              <div
                className={`max-w-[82%] ${
                  isUser ? "order-first" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "rounded-br-md bg-[#d8a83e] font-medium text-[#10251f]"
                      : "rounded-bl-md bg-slate-100 text-slate-600"
                  }`}
                >
                  {message.content}
                </div>

                <p
                  className={`mt-1 text-[10px] text-slate-400 ${
                    isUser ? "text-right" : ""
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[#10251f]">
                  <User size={17} />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-[#d8a83e]">
              <BrainCircuit size={17} />
            </div>

            <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
                Analysing mine data...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                submitQuestion(undefined, suggestion)
              }
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10 hover:text-[#10251f]"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          onSubmit={submitQuestion}
          className="flex items-end gap-2"
        >
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#d8a83e] focus-within:ring-2 focus-within:ring-[#d8a83e]/10">
            <div className="flex items-center gap-2">
              <MessageSquareText
                size={17}
                className="text-slate-400"
              />

              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask SmartMine anything about the operation..."
                className="w-full bg-transparent text-sm text-[#10251f] outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10251f] text-white transition hover:bg-[#17372e] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ask SmartMine AI"
          >
            {isThinking ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <ArrowUp size={19} />
            )}
          </button>
        </form>

        <p className="mt-3 text-center text-[10px] text-slate-400">
          SmartMine AI analyses operational data supplied by
          the mine system. Always verify critical operational
          decisions.
        </p>
      </div>
    </section>
  );
}

export default IntelligenceChat;