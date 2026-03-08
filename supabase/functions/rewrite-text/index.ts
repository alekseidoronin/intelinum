import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, targetChars, platform } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Ты — копирайтер для социальных сетей. Твоя задача: переписать текст, уложившись СТРОГО в ${targetChars} символов (±3%, то есть от ${Math.round(Number(targetChars) * 0.97)} до ${Math.round(Number(targetChars) * 1.03)} символов включительно). Считай символы точно. Не добавляй лишнего. Не объясняй ничего. Верни ТОЛЬКО готовый текст без каких-либо комментариев, заголовков или пояснений. Если текст длиннее нужного — сокращай. Если короче — расширяй.`,
          },
          {
            role: "user",
            content: `Перепиши этот текст для платформы ${platform}. Целевое количество символов: ${targetChars} (допустимо от ${Math.round(Number(targetChars) * 0.97)} до ${Math.round(Number(targetChars) * 1.03)}). Проверь длину перед ответом и убедись, что она в допустимом диапазоне.\n\nТекст:\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Превышен лимит запросов, попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Недостаточно средств в аккаунте." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Ошибка AI-сервиса" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let rewrittenText: string = data.choices?.[0]?.message?.content ?? "";

    // Hard trim: if AI returned too much, cut to target
    const target = Number(targetChars);
    if (rewrittenText.length > Math.round(target * 1.03)) {
      rewrittenText = rewrittenText.slice(0, target);
      // Trim to last space to avoid cutting mid-word
      const lastSpace = rewrittenText.lastIndexOf(" ");
      if (lastSpace > target * 0.9) rewrittenText = rewrittenText.slice(0, lastSpace);
    }

    return new Response(JSON.stringify({ text: rewrittenText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("rewrite-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
