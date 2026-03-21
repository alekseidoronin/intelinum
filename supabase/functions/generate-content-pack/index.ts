import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type PlatformId = "instagram" | "telegram" | "vk" | "dzen" | "reels";

type ContentPlatform = {
  id: PlatformId;
  name: string;
  char_limit: number;
  text: string;
};

type ContentPackPayload = {
  source: "backend" | "fallback";
  pack_id: string;
  generated_at: string;
  title: string;
  topic: string;
  platforms: ContentPlatform[];
  assets: {
    image_prompt: string;
    carousel_outline: string[];
    pdf_summary: string;
  };
};

const fallbackPlatforms = (topic: string): ContentPlatform[] => [
  {
    id: "instagram",
    name: "Instagram",
    char_limit: 2200,
    text: `✨ ${topic}\n\nСегодня разбираем тему через нумерологию простыми словами.\n\n• Что это значит в жизни\n• Где чаще всего проявляется\n• Как использовать это себе в плюс\n\nСохраните пост и напишите в комментариях «Хочу разбор», если хотите продолжение 👇\n\n#нумерология #саморазвитие #контент`,
  },
  {
    id: "telegram",
    name: "Telegram",
    char_limit: 4096,
    text: `**${topic}**\n\nСобрала короткий разбор, который можно применить уже сегодня.\n\n1. Контекст: почему эта тема сейчас важна.\n2. Нумерологическая логика: как это отражается в вашем числе.\n3. Практика: один шаг на сегодня.\n\nЕсли хотите, следующим постом сделаю чек-лист по этой теме.`,
  },
  {
    id: "vk",
    name: "ВКонтакте",
    char_limit: 3000,
    text: `${topic}: разбор без воды\n\nГлавная мысль: каждое число задаёт сценарий поведения. Если понимать свой сценарий, решения даются проще.\n\nЧто сделать сегодня:\n1) Определить, где тема уже проявлена.\n2) Выбрать один конкретный шаг.\n3) Зафиксировать результат к вечеру.\n\nПродолжать эту серию?`,
  },
  {
    id: "dzen",
    name: "Яндекс Дзен",
    char_limit: 10000,
    text: `${topic}: подробный разбор\n\nЭта тема особенно актуальна, когда нужно навести порядок в целях, эмоциях и действиях. В статье разберём:\n- нумерологическую основу;\n- типичные ошибки;\n- практические рекомендации на неделю.\n\nВ конце — мини-план из 5 шагов.`,
  },
  {
    id: "reels",
    name: "Reels / Скрипт",
    char_limit: 500,
    text: `[0-3 сек] «${topic} — разберём за минуту»\n[3-12 сек] «Почему это важно именно сейчас»\n[12-30 сек] «3 ключевые идеи через числа»\n[30-50 сек] «Что сделать сегодня на практике»\n[50-60 сек] «Сохраните, чтобы не потерять»`,
  },
];

const makeFallbackPayload = (topic: string): ContentPackPayload => ({
  source: "fallback",
  pack_id: crypto.randomUUID(),
  generated_at: new Date().toISOString(),
  title: topic,
  topic,
  platforms: fallbackPlatforms(topic),
  assets: {
    image_prompt: `Премиальный минималистичный постер на тему "${topic}", мягкий контраст, светлый фон, акцент сапфировым цветом.`,
    carousel_outline: [
      `Слайд 1: Заголовок — ${topic}`,
      "Слайд 2: Почему тема важна",
      "Слайд 3: Ошибка №1",
      "Слайд 4: Ошибка №2",
      "Слайд 5: Ошибка №3",
      "Слайд 6: Практический шаг",
      "Слайд 7: Итог",
      "Слайд 8: CTA",
    ],
    pdf_summary: `Краткий гайд по теме "${topic}": контекст, диагностика, шаги внедрения, рекомендации на неделю.`,
  },
});

const buildPrompt = (topic: string, transcript?: string) => {
  if (!transcript) {
    return `Сгенерируй контент-пакет по теме: "${topic}". Нужен деловой дружелюбный тон и практическая подача.`;
  }
  return `Сгенерируй контент-пакет по расшифровке. Основная тема: "${topic}".\n\nТекст расшифровки:\n${transcript}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const topic =
      typeof body?.topic === "string" && body.topic.trim().length > 0
        ? body.topic.trim()
        : "Разбор числа 7";
    const transcript =
      typeof body?.transcript === "string" && body.transcript.trim().length > 0
        ? body.transcript.trim()
        : undefined;

    const fallback = makeFallbackPayload(topic);
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const schemaExample = {
      title: "string",
      topic,
      platforms: [
        { id: "instagram", name: "Instagram", char_limit: 2200, text: "string" },
        { id: "telegram", name: "Telegram", char_limit: 4096, text: "string" },
        { id: "vk", name: "ВКонтакте", char_limit: 3000, text: "string" },
        { id: "dzen", name: "Яндекс Дзен", char_limit: 10000, text: "string" },
        { id: "reels", name: "Reels / Скрипт", char_limit: 500, text: "string" },
      ],
      assets: {
        image_prompt: "string",
        carousel_outline: ["string"],
        pdf_summary: "string",
      },
    };

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Ты создаёшь контент-пакет для соцсетей на русском языке. Верни только JSON без markdown и без комментариев.",
          },
          {
            role: "user",
            content: `${buildPrompt(topic, transcript)}\n\nВерни JSON в формате: ${JSON.stringify(schemaExample)}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResponse.json();
    const rawText: string = aiJson?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(rawText);

    const payload: ContentPackPayload = {
      source: "backend",
      pack_id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      title: typeof parsed?.title === "string" && parsed.title.trim() ? parsed.title : topic,
      topic: typeof parsed?.topic === "string" && parsed.topic.trim() ? parsed.topic : topic,
      platforms: Array.isArray(parsed?.platforms)
        ? parsed.platforms
            .map((item: Record<string, unknown>) => ({
              id: item?.id as PlatformId,
              name: typeof item?.name === "string" ? item.name : "",
              char_limit: typeof item?.char_limit === "number" ? item.char_limit : 1000,
              text: typeof item?.text === "string" ? item.text : "",
            }))
            .filter((item: ContentPlatform) => item.id && item.name && item.text)
        : fallback.platforms,
      assets: {
        image_prompt:
          typeof parsed?.assets?.image_prompt === "string"
            ? parsed.assets.image_prompt
            : fallback.assets.image_prompt,
        carousel_outline: Array.isArray(parsed?.assets?.carousel_outline)
          ? parsed.assets.carousel_outline.filter((x: unknown) => typeof x === "string")
          : fallback.assets.carousel_outline,
        pdf_summary:
          typeof parsed?.assets?.pdf_summary === "string"
            ? parsed.assets.pdf_summary
            : fallback.assets.pdf_summary,
      },
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_error) {
    const fallback = makeFallbackPayload("Разбор числа 7");
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
