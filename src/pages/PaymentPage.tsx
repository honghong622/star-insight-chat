import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building2, Check, Shield } from "lucide-react";

type PayMethod = "card" | "phone" | "transfer";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const birthDate = sessionStorage.getItem("birthDate") || "";
  const hasPaid = sessionStorage.getItem("paid") === "true";
  const isAdditional = hasPaid;
  const priceLabel = isAdditional ? "1,980원" : "2,980원";

  if (!birthDate) {
    navigate("/");
    return null;
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      if (!isAdditional) {
        // 첫 결제: 정확히 10개로 설정
        sessionStorage.setItem("paid", "true");
        sessionStorage.setItem("questionCount", "10");
      } else {
        // 추가 결제: 기존 + 10
        const currentCount = parseInt(sessionStorage.getItem("questionCount") || "0", 10);
        sessionStorage.setItem("questionCount", String(currentCount + 10));
      }
      setTimeout(() => navigate("/chat"), 1500);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-6 text-xl font-bold text-foreground">결제가 완료되었어요</p>
        <p className="mt-2 text-sm text-muted-foreground">질문 10회가 충전되었습니다 ✨</p>
      </div>
    );
  }

  const methods: { id: PayMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "card", label: "카드 결제", icon: <CreditCard className="h-5 w-5" />, desc: "신용·체크카드" },
    { id: "phone", label: "휴대폰 결제", icon: <Smartphone className="h-5 w-5" />, desc: "통신사 결제" },
    { id: "transfer", label: "계좌이체", icon: <Building2 className="h-5 w-5" />, desc: "실시간 이체" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-14">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-base font-bold text-foreground">결제하기</p>
      </header>

      {/* 상품 정보 */}
      <section className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <span className="text-2xl">🔮</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-foreground">
              {isAdditional ? "추가 질문 충전" : "AI 점성술 상세 운세"}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">1:1 채팅 · 질문 10회</p>
          </div>
          <p className="text-lg font-extrabold text-foreground">{priceLabel}</p>
        </div>
      </section>

      {/* 결제 수단 */}
      <section className="flex-1 px-5 py-5">
        <p className="mb-3 text-sm font-bold text-foreground">결제 수단</p>
        <div className="space-y-2.5">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                selectedMethod === m.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  selectedMethod === m.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m.icon}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  selectedMethod === m.id
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              >
                {selectedMethod === m.id && (
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 안내 */}
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/50 px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            결제 정보는 안전하게 암호화되어 처리됩니다.
            개인정보는 결제 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
          </p>
        </div>
      </section>

      {/* 결제 버튼 */}
      <section className="border-t border-border bg-background px-5 pb-10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">총 결제 금액</span>
          <span className="text-lg font-extrabold text-foreground">{priceLabel}</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {isProcessing ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            `${priceLabel} 결제하기`
          )}
        </button>
      </section>
    </div>
  );
};

export default PaymentPage;
