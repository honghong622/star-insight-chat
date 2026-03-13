import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";
  const message = searchParams.get("message") || "결제에 실패했습니다.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <p className="text-xl font-bold text-destructive">결제 실패</p>
      <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>
      {code && <p className="mt-1 text-xs text-muted-foreground">({code})</p>}
      <button
        onClick={() => navigate("/payment")}
        className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
      >
        다시 시도하기
      </button>
    </div>
  );
};

export default PaymentFailPage;
