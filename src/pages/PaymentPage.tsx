import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield } from "lucide-react";

const TOSS_CLIENT_KEY = "test_ck_Ba5PzR0ArnW6l2pMdgma8vmYnNeD";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      payment: (options: { customerKey: string }) => {
        requestPayment: (params: {
          method: string;
          amount: { value: number; currency: string };
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
        }) => Promise<void>;
      };
    };
    TossApp?: {
      requestPayment: (params: {
        productId: string;
        amount: number;
        orderId: string;
        orderName: string;
      }) => Promise<{ status: string }>;
    };
  }
}

const PRODUCT_ID = "ait.0000021328.2e24dd8e.5d5d5e9a16.3407433704";
const isTossApp = () => !!window.TossApp;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const birthDate = sessionStorage.getItem("birthDate") || "";
  const hasPaid = sessionStorage.getItem("paid") === "true";
  const hasQuestions = parseInt(sessionStorage.getItem("questionCount") || "0", 10) > 0;
  const isAdditional = hasPaid && hasQuestions;
  const priceAmount = isAdditional ? 1980 : 2980;
  const priceLabel = isAdditional ? "1,980원" : "2,980원";

  if (!birthDate) {
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const orderName = isAdditional ? "추가 질문 충전 10회" : "AI 점성술 상세 운세";

    // 토스 인앱 환경
    if (isTossApp()) {
      try {
        const result = await window.TossApp!.requestPayment({
          productId: PRODUCT_ID,
          amount: priceAmount,
          orderId,
          orderName,
        });
        if (result.status === "success") {
          if (!isAdditional) {
            sessionStorage.setItem("paid", "true");
            sessionStorage.setItem("questionCount", "10");
          } else {
            const c = parseInt(sessionStorage.getItem("questionCount") || "0", 10);
            sessionStorage.setItem("questionCount", String(c + 10));
          }
          navigate("/chat");
        } else {
          setIsProcessing(false);
        }
      } catch {
        setIsProcessing(false);
      }
      return;
    }

    // 토스페이먼츠 SDK
    if (!window.TossPayments) {
      console.error("TossPayments SDK not loaded");
      setIsProcessing(false);
      return;
    }

    try {
      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      const customerKey = `customer_${Date.now()}`;
      const payment = tossPayments.payment({ customerKey });

      const baseUrl = window.location.origin;

      await payment.requestPayment({
        method: "CARD",
        amount: { value: priceAmount, currency: "KRW" },
        orderId,
        orderName,
        successUrl: `${baseUrl}/payment/success`,
        failUrl: `${baseUrl}/payment/fail`,
      });
    } catch {
      setIsProcessing(false);
    }
  };

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

      {/* 결제 수단 안내 */}
      <section className="flex-1 px-5 py-5">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-primary bg-primary/5 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">토스페이먼츠</p>
            <p className="text-xs text-muted-foreground">카드 · 간편결제 · 계좌이체 등</p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/50 px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            결제 정보는 토스페이먼츠를 통해 안전하게 암호화 처리됩니다.
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
