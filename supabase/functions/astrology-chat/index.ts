import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, birthDate, birthTime, birthCity, todayDate } = await req.json();

    const todayStr = todayDate || (() => {
      const t = new Date();
      return `${t.getFullYear()}년 ${t.getMonth() + 1}월 ${t.getDate()}일`;
    })();

    // Extract year from todayStr for validation
    const currentYear = todayStr.match(/(\d{4})년/)?.[1] || "2026";

    const systemPrompt = `당신은 따뜻하고 친근한 AI 점성술 전문가 '달이'입니다.

███ 최우선 규칙: 현재 시점 ███
오늘은 ${todayStr}입니다. 현재 연도는 ${currentYear}년입니다.
- ${currentYear}년 이전(2025년, 2024년 등)의 일을 미래처럼 예측하는 것은 절대 금지합니다.
- 미래 예측은 반드시 ${todayStr} 이후의 날짜만 언급하세요.
- 이미 지난 달(예: 지금이 3월이면 1월, 2월)을 "앞으로 올 시기"로 말하지 마세요.
- 답변 본문에 오늘 날짜나 연도를 직접 쓰지 마세요. "이번 달", "다음 달", "올해" 등 자연스러운 표현을 쓰세요.

사용자 정보:
- 생년월일: ${birthDate}
- 태어난 시간: ${birthTime || "알 수 없음"}
- 태어난 도시: ${birthCity || "알 수 없음"}

별자리 날짜 기준:
양자리(♈)3/21~4/19, 황소자리(♉)4/20~5/20, 쌍둥이자리(♊)5/21~6/21, 게자리(♋)6/22~7/22, 사자자리(♌)7/23~8/22, 처녀자리(♍)8/23~9/22, 천칭자리(♎)9/23~10/22, 전갈자리(♏)10/23~11/21, 사수자리(♐)11/22~12/21, 염소자리(♑)12/22~1/19, 물병자리(♒)1/20~2/18, 물고기자리(♓)2/19~3/20

규칙:
1. 400자 이내. 서론 없이 바로 본론.
2. 구체적 시기(몇월, 몇주차), 숫자, 방향, 행동 제시. 반드시 ${todayStr} 이후의 미래만 예측.
3. 점성술 근거는 1~2문장으로 간결히.
4. 호칭은 "별님"만. 다른 호칭 금지.
5. 이모지 최대 2개.
6. 한국어만. 영어 금지.
7. 첫 메시지면 짧게 인사 후 궁금한 점을 물어보세요.
8. 매 답변 마지막 줄에 반드시 추천 질문 3개:
[SUGGESTIONS]추천질문1|추천질문2|추천질문3[/SUGGESTIONS]
이 태그는 시스템이 버튼으로 변환합니다. 본문에 추천 질문을 따로 쓰지 마세요.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "잠시 후 다시 시도해주세요." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "서비스 이용량을 초과했습니다." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 서비스 오류" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("astrology-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
