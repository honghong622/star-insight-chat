import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMsg("결제 정보가 누락되었습니다.");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("toss-confirm", {
          body: { paymentKey, orderId, amount: Number(amount) },
        });

        if (error || !data?.success) {
          setStatus("error");
          setErrorMsg(data?.error?.message || "결제 승인에 실패했습니다.");
          return;
        }

        // 결제 성공 처리
        const isAdditional = sessionStorage.getItem("paid") === "true";
        if (!isAdditional) {
          sessionStorage.setItem("paid", "true");
          sessionStorage.setItem("questionCount", "10");
        } else {
          const currentCount = parseInt(sessionStorage.getItem("questionCount") || "0", 10);
          sessionStorage.setItem("questionCount", String(currentCount + 10));
        }

        setStatus("success");
        setTimeout(() => navigate("/chat"), 1500);
      } catch {
        setStatus("error");
        setErrorMsg("결제 승인 중 오류가 발생했습니다.");
      }
    };

    confirm();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">결제를 확인하고 있어요...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <p className="text-xl font-bold text-destructive">결제 실패</p>
        <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
        <button
          onClick={() => navigate("/payment")}
          className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-10 w-10 text-primary" />
      </div>
      <p className="mt-6 text-xl font-bold text-foreground">결제가 완료되었어요</p>
      <p className="mt-2 text-sm text-muted-foreground">질문 10회가 충전되었습니다 ✨</p>
    </div>
  );
};

export default PaymentSuccessPage;
