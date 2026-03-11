import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Lock, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ReadingPage = () => {
  const navigate = useNavigate();
  const [reading, setReading] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const birthDate = sessionStorage.getItem("birthDate") || "";
  const birthTime = sessionStorage.getItem("birthTime") || "";
  const birthCity = sessionStorage.getItem("birthCity") || "";

  useEffect(() => {
    if (!birthDate) {
      navigate("/");
      return;
    }
    fetchReading();
  }, []);

  const fetchReading = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("astrology", {
        body: { birthDate, birthTime, birthCity, type: "free-reading" },
      });

      if (error) throw error;
      const lines = (data.reading as string).split("\n").filter((l: string) => l.trim());
      setReading(lines.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch reading:", err);
      setReading([
        "✨ 당신은 주변 사람들을 자연스럽게 끌어당기는 특별한 매력을 지녔어요",
        "💕 곧 당신의 인간관계에 예상치 못한 변화가 찾아올 거예요",
        "🔮 하지만 당신이 아직 모르는 것이 있습니다... 더 깊은 이야기가 기다리고 있어요",
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowPayment(true), 2000);
    }
  };

  const handlePayment = () => {
    // 첫 결제 플로우이므로 paid 플래그 초기화
    sessionStorage.removeItem("paid");
    navigate("/payment");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center px-5 pb-2 pt-14">
        <button onClick={() => navigate("/")} className="text-muted-foreground text-sm font-medium">
          ← 뒤로
        </button>
      </header>

      {/* Reading */}
      <section className="flex-1 px-5 pt-6">
        <div className="mb-6 animate-fade-up">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-toss-purple-light px-3 py-1.5">
            <Star className="h-3.5 w-3.5 text-toss-purple" />
            <span className="text-xs font-semibold text-toss-purple">무료 운세</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">
            당신의 별이 말합니다
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-shimmer rounded-2xl bg-gradient-to-r from-muted via-muted/50 to-muted p-5"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="h-4 w-3/4 rounded bg-muted-foreground/10" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted-foreground/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reading.map((line, i) => (
              <div
                key={i}
                className="animate-fade-up rounded-2xl bg-card p-5 toss-shadow"
                style={{ animationDelay: `${i * 0.3}s`, opacity: 0 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-toss-purple/10">
                    <span className="text-xs font-bold text-toss-purple">{i + 1}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {["성격 분석", "관계 변화", "지금 놓치면 안 될 운명"][i]}
                  </span>
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-foreground">
                  {line}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Blurred teaser */}
        {!isLoading && (
          <div className="animate-fade-up mt-6 relative overflow-hidden rounded-2xl bg-card p-5 toss-shadow" style={{ animationDelay: "1.2s", opacity: 0 }}>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <Lock className="mb-2 h-6 w-6 text-toss-purple" />
              <p className="text-sm font-bold text-foreground">지금 이 순간, 당신에게 다가오는 기회가 있어요</p>
              <p className="mt-1 text-xs text-muted-foreground">이걸 모르고 지나치면 후회할 수도 있어요</p>
            </div>
            <p className="text-sm text-muted-foreground blur-sm">
              올해 하반기 당신의 인생을 바꿀 결정적 전환점이 찾아옵니다. 특히 금성과 목성의 합이...
            </p>
          </div>
        )}
      </section>

      {/* Payment CTA */}
      {showPayment && (
        <section className="animate-fade-up sticky bottom-0 border-t border-border bg-background px-5 pb-10 pt-5">
          <div className="mb-4 text-center">
            <p className="text-sm font-bold text-foreground">
              AI 점성술 전문가와 1:1 대화
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              연애, 재물, 건강, 커리어까지 · 질문 10회
            </p>
          </div>
          
          <button
            onClick={handlePayment}
            className="animate-pulse-glow group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-toss-purple to-primary px-6 py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            2,980원으로 상세 운세 보기
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            첫 결제 2,980원 · 질문 10회 · 안전한 결제
          </p>
        </section>
      )}
    </div>
  );
};

export default ReadingPage;
