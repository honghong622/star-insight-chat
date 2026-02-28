import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";

const BirthInfoForm = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!birthDate) return;
    setIsLoading(true);
    sessionStorage.setItem("birthDate", birthDate);
    sessionStorage.setItem("birthTime", birthTime);
    sessionStorage.setItem("birthCity", birthCity);
    navigate("/reading");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          생년월일
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          태어난 시간 <span className="text-muted-foreground font-normal">(선택)</span>
        </label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="모르면 비워두세요"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          태어난 도시 <span className="text-muted-foreground font-normal">(선택)</span>
        </label>
        <input
          type="text"
          value={birthCity}
          onChange={(e) => setBirthCity(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="예: 서울, 부산"
        />
        <p className="text-xs text-muted-foreground">
          시간과 태어난 도시를 입력하면 더 정확한 운세를 받을 수 있어요
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!birthDate || isLoading}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            무료 운세 보기
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default BirthInfoForm;
