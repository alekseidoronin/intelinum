import { supabase } from "@/integrations/supabase/client";

export type PlatformId = "instagram" | "telegram" | "vk" | "dzen" | "reels";

export type ContentPlatform = {
  id: PlatformId;
  name: string;
  charLimit: number;
  text: string;
};

export type ContentPack = {
  source: "backend" | "fallback";
  packId: string;
  generatedAt: string;
  title: string;
  topic: string;
  platforms: ContentPlatform[];
  assets: {
    imagePrompt: string;
    carouselOutline: string[];
    pdfSummary: string;
  };
};

type GenerateInput = {
  topic: string;
  transcript?: string;
};

export const fallbackPack = (topic: string): ContentPack => ({
  source: "fallback",
  packId: crypto.randomUUID(),
  generatedAt: new Date().toISOString(),
  title: topic,
  topic,
  platforms: [
    {
      id: "instagram",
      name: "Instagram",
      charLimit: 2200,
      text: `✨ ${topic}\n\nРазбор темы в нумерологическом подходе: почему это важно и как применить в жизни уже сегодня.\n\nСохраните пост, чтобы вернуться к практике вечером.`,
    },
    {
      id: "telegram",
      name: "Telegram",
      charLimit: 4096,
      text: `**${topic}**\n\nКороткий разбор: контекст, нумерологическая логика и один практический шаг на день.`,
    },
    {
      id: "vk",
      name: "ВКонтакте",
      charLimit: 3000,
      text: `${topic}\n\nЧто это значит на практике и как использовать без перегруза — в трёх шагах.`,
    },
    {
      id: "dzen",
      name: "Яндекс Дзен",
      charLimit: 10000,
      text: `${topic}: подробная версия с примерами, типичными ошибками и планом действий.`,
    },
    {
      id: "reels",
      name: "Reels / Скрипт",
      charLimit: 500,
      text: `[0-3] Хук\n[3-15] Контекст\n[15-40] 3 инсайта\n[40-55] Практика\n[55-60] CTA`,
    },
  ],
  assets: {
    imagePrompt: `Минималистичный визуал на тему "${topic}", премиальный стиль.`,
    carouselOutline: ["Заголовок", "Контекст", "Ошибка", "Решение", "CTA"],
    pdfSummary: `Гайд по теме "${topic}" с рекомендациями.`,
  },
});

const toString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() ? value : fallback;

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(1, Math.floor(parsed));
  }
  return fallback;
};

const platformIds = new Set<PlatformId>(["instagram", "telegram", "vk", "dzen", "reels"]);

const toPlatformId = (value: unknown): PlatformId | null =>
  typeof value === "string" && platformIds.has(value as PlatformId) ? (value as PlatformId) : null;

export const normalizePack = (payload: unknown, topicFallback: string): ContentPack => {
  const fallback = fallbackPack(topicFallback);
  if (!payload || typeof payload !== "object") return fallback;

  const raw = payload as Record<string, unknown>;
  const normalizedPlatforms = Array.isArray(raw.platforms)
    ? raw.platforms
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const platform = item as Record<string, unknown>;
          const id = toPlatformId(platform.id);
          if (!id) return null;
          return {
            id,
            name: toString(platform.name, id),
            charLimit: toNumber(platform.char_limit, fallback.platforms.find((x) => x.id === id)?.charLimit ?? 1000),
            text: toString(platform.text, fallback.platforms.find((x) => x.id === id)?.text ?? ""),
          } satisfies ContentPlatform;
        })
        .filter((x): x is ContentPlatform => x !== null)
    : [];

  return {
    source: raw.source === "backend" ? "backend" : "fallback",
    packId: toString(raw.pack_id, fallback.packId),
    generatedAt: toString(raw.generated_at, fallback.generatedAt),
    title: toString(raw.title, topicFallback),
    topic: toString(raw.topic, topicFallback),
    platforms: normalizedPlatforms.length > 0 ? normalizedPlatforms : fallback.platforms,
    assets: {
      imagePrompt:
        raw.assets && typeof raw.assets === "object"
          ? toString((raw.assets as Record<string, unknown>).image_prompt, fallback.assets.imagePrompt)
          : fallback.assets.imagePrompt,
      carouselOutline:
        raw.assets &&
        typeof raw.assets === "object" &&
        Array.isArray((raw.assets as Record<string, unknown>).carousel_outline)
          ? ((raw.assets as Record<string, unknown>).carousel_outline as unknown[]).filter(
              (x): x is string => typeof x === "string",
            )
          : fallback.assets.carouselOutline,
      pdfSummary:
        raw.assets && typeof raw.assets === "object"
          ? toString((raw.assets as Record<string, unknown>).pdf_summary, fallback.assets.pdfSummary)
          : fallback.assets.pdfSummary,
    },
  };
};

export const generateContentPack = async (input: GenerateInput): Promise<ContentPack> => {
  const topic = input.topic.trim() || "Разбор числа 7";
  try {
    const { data, error } = await supabase.functions.invoke("generate-content-pack", {
      body: { topic, transcript: input.transcript },
    });
    if (error) throw error;
    return normalizePack(data, topic);
  } catch (_error) {
    return fallbackPack(topic);
  }
};
