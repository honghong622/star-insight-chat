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
    const { messages, birthDate, birthTime, birthCity } = await req.json();

    const systemPrompt = `당신은 따뜻하고 친근한 AI 점성술 전문가 '별이'입니다. 점성술 연구소의 전문 상담사입니다.

사용자 정보:
- 생년월일: ${birthDate}
- 태어난 시간: ${birthTime || "알 수 없음"}
- 태어난 도시: ${birthCity || "알 수 없음"}

규칙:
1. 점성술 전문가처럼 분석한다. 별자리, 행성 배치, 하우스 등 점성술 용어를 적절히 사용하세요.
2. 구체적이고 이해하기 쉽게 설명한다. 개인화된 조언을 제공하세요.
3. 불필요하게 길어지지 않는다. 답변은 반드시 400~600자 이내로 작성하세요.
4. 친근하고 따뜻한 톤으로 대화하세요.
5. 연애, 재물, 건강, 커리어, 궁합 등 다양한 주제를 다루세요.
6. 이모지를 자연스럽게 사용하세요.
7. 한국어로 답변하세요.
8. 첫 메시지라면 반갑게 인사하고 무엇이 궁금한지 물어보세요.
9. 매 답변의 맨 마지막에 반드시 아래 형식으로 후속 추천 질문 3개를 추가하세요. 사용자의 질문과 직접 관련된, 더 깊이 파고들 수 있는 질문이어야 합니다:
[SUGGESTIONS]추천질문1|추천질문2|추천질문3[/SUGGESTIONS]
예시: [SUGGESTIONS]올해 하반기 연애운은?|나와 잘 맞는 별자리는?|짝사랑 고백 타이밍은?[/SUGGESTIONS]`;

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
