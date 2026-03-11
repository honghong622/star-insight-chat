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
    const { birthDate, birthTime, birthCity, type } = await req.json();

    if (type !== "free-reading") {
      return new Response(JSON.stringify({ error: "Use astrology-chat for chat" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `당신은 점성술 연구소의 세계적으로 유명한 점성술 전문가입니다. 사용자의 생년월일과 태어난 시간을 기반으로 별자리, 행성 배치를 분석합니다.

별자리 날짜 기준 (반드시 이 기준을 따르세요):
- 양자리(♈): 3/21~4/19
- 황소자리(♉): 4/20~5/20
- 쌍둥이자리(♊): 5/21~6/21
- 게자리(♋): 6/22~7/22
- 사자자리(♌): 7/23~8/22
- 처녀자리(♍): 8/23~9/22
- 천칭자리(♎): 9/23~10/22
- 전갈자리(♏): 10/23~11/21
- 사수자리(♐): 11/22~12/21
- 염소자리(♑): 12/22~1/19
- 물병자리(♒): 1/20~2/18
- 물고기자리(♓): 2/19~3/20

중요 규칙:
1. 반드시 정확히 3줄로 답변하세요
2. 첫 번째 줄: 사용자의 성격 중 가장 매력적이고 특별한 점을 짚어주세요
3. 두 번째 줄: 현재 연애/인간관계에서 곧 일어날 변화를 암시하세요
4. 세 번째 줄: "하지만 당신이 아직 모르는 것이 있습니다..."로 시작하는 강력한 클리프행어
5. 모든 문장은 구체적이고 개인적으로 느껴져야 합니다
6. 별자리 이모지를 자연스럽게 사용하세요
7. 한국어로 답변하세요`;

    const userPrompt = `생년월일: ${birthDate}, 태어난 시간: ${birthTime || "모름"}, 태어난 도시: ${birthCity || "모름"}\n\n이 사람의 별자리 운세를 3줄로 작성해주세요.`;

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
          { role: "user", content: userPrompt },
        ],
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ reading: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("astrology error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
