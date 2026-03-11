import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Moon, ArrowLeft } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/astrology-chat`;

const CATEGORIES = [
  { label: "연애", emoji: "💕" },
  { label: "재물", emoji: "💰" },
  { label: "진로/사업", emoji: "🚀" },
  { label: "궁합", emoji: "💑" },
  { label: "건강", emoji: "💪" },
];

const parseSuggestions = (text: string): { clean: string; suggestions: string[] } => {
  const match = text.match(/\[SUGGESTIONS\](.*?)\[\/SUGGESTIONS\]/s);
  if (!match) return { clean: text, suggestions: [] };
  const clean = text.replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/s, "").trimEnd();
  const suggestions = match[1].split("|").map(s => s.trim()).filter(Boolean);
  return { clean, suggestions };
};

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(() => {
    return parseInt(sessionStorage.getItem("questionCount") || "0", 10);
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const birthDate = sessionStorage.getItem("birthDate") || "";
  const birthTime = sessionStorage.getItem("birthTime") || "";
  const birthCity = sessionStorage.getItem("birthCity") || "";

  useEffect(() => {
    if (!birthDate) {
      navigate("/");
      return;
    }
    // Auto send first message
    sendMessage("안녕하세요! 제 운세를 알려주세요.", true, true);
  }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string, isFirst = false, skipCount = false) => {
    if (!skipCount) {
      if (questionCount <= 0) {
        // Auto navigate to additional payment
        navigate("/payment");
        return;
      }
      const newCount = questionCount - 1;
      setQuestionCount(newCount);
      sessionStorage.setItem("questionCount", String(newCount));
    }

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = isFirst ? [userMsg] : [...messages, userMsg];

    if (!isFirst) {
      setMessages((prev) => [...prev, userMsg]);
    } else {
      setMessages([userMsg]);
    }
    setInput("");
    setIsLoading(true);
    setShowCategories(false);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          birthDate,
          birthTime,
          birthCity,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              // Strip [SUGGESTIONS]...[/SUGGESTIONS] from displayed text in real-time
              const displayText = assistantSoFar.replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/gs, "").replace(/\[SUGGESTIONS\].*/s, "").trimEnd();
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: displayText } : m
                  );
                }
                return [...prev, { role: "assistant", content: displayText }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse suggestions from the final response
      const { clean, suggestions } = parseSuggestions(assistantSoFar);
      if (clean !== assistantSoFar) {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.role === "assistant" ? { ...m, content: clean } : m
          )
        );
      }
      setDynamicSuggestions(suggestions);

      // Show categories after first response
      if (isFirst) {
        setShowCategories(true);
      }
    } catch (e) {
      console.error(e);
      // Refund the question on error
      if (!skipCount) {
        const refunded = questionCount;
        setQuestionCount(refunded);
        sessionStorage.setItem("questionCount", String(refunded));
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "죄송해요, 잠시 문제가 생겼어요. 다시 시도해주세요 🙏" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  const handleCategoryClick = (category: string) => {
    sendMessage(`${category}운에 대해 자세히 알려주세요`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleBuyMore = () => {
    navigate("/payment");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 pb-3 pt-14">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-toss-purple/10">
              <Moon className="h-4 w-4 text-toss-purple" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">달이</p>
              <p className="text-xs text-muted-foreground">점성술 연구소</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-toss-purple/10 px-3 py-1.5">
            <span className="text-xs font-bold text-toss-purple">
              남은 질문 {questionCount}개
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-lg space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-toss-purple/10">
                  <Moon className="h-3.5 w-3.5 text-toss-purple" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-foreground toss-shadow rounded-bl-md"
                }`}
              >
                {msg.content.replace(/\*\*/g, "").replace(/\*/g, "")}
              </div>
            </div>
          ))}

          {/* Category buttons after first AI response */}
          {showCategories && !isLoading && (
            <div className="flex flex-wrap gap-2 pl-9">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.label)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic suggestion buttons */}
          {!showCategories && !isLoading && dynamicSuggestions.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
            <div className="space-y-2 pl-9">
              <p className="text-xs font-semibold text-muted-foreground">💡 이런 것도 물어보세요</p>
              <div className="flex flex-wrap gap-2">
                {dynamicSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No questions left - show recharge prompt */}
          {questionCount <= 0 && !isLoading && messages.length > 1 && (
            <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-5 text-center toss-shadow">
              <p className="text-sm font-bold text-foreground">질문 15회가 다 소진되었어요!</p>
              <p className="mt-2 text-xs text-muted-foreground">추가로 궁금하신 게 있으시다면<br />아래 버튼을 눌러주세요 ✨</p>
              <button
                onClick={() => navigate("/payment")}
                className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]"
              >
                1,980원으로 15회 추가질문 결제하기
              </button>
            </div>
          )}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-toss-purple/10">
                <Moon className="h-3.5 w-3.5 text-toss-purple" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 toss-shadow">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0.15s" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-background px-4 pb-10 pt-3"
      >
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={questionCount > 0 ? "궁금한 것을 물어보세요..." : "질문을 충전해주세요"}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isLoading || questionCount <= 0}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || questionCount <= 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
