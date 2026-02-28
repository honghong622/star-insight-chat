import { Stars, Moon, Sparkles } from "lucide-react";
import BirthInfoForm from "@/components/BirthInfoForm";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-2 pt-14">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-toss-purple/10">
            <Moon className="h-5 w-5 text-toss-purple" />
          </div>
          <span className="text-lg font-bold text-foreground">올어바웃점성술</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-6 pt-8">
        <div className="animate-fade-up">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-toss-purple-light px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-toss-purple" />
            <span className="text-xs font-semibold text-toss-purple">AI 점성술</span>
          </div>
          <h1 className="mb-3 text-[28px] font-extrabold leading-tight tracking-tight text-foreground">
            당신의 별이<br />
            <span className="toss-gradient-text">말해주는 이야기</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            점성술에 모든것! 궁금했던 연애운, 재물운,<br />
            건강운 등 무엇이든 물어보세요! 🔮✨
          </p>
        </div>
      </section>

      {/* Decorative card */}
      <section className="px-5 pb-6">
        <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-toss-purple/5 to-toss-blue/5 p-5" style={{ animationDelay: "0.15s" }}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-toss-purple/10">
              <Stars className="h-5 w-5 text-toss-purple" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">무료 운세 미리보기</p>
              <p className="text-xs text-muted-foreground">3줄 요약으로 빠르게 확인</p>
            </div>
          </div>
          <div className="space-y-2">
            {["성격 & 매력 포인트", "연애 & 인간관계 변화", "숨겨진 잠재력 발견"].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3.5 py-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-toss-purple/10 text-xs font-bold text-toss-purple">
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 px-5 pb-10" style={{ animationDelay: "0.3s" }}>
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <BirthInfoForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
