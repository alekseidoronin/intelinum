import { describe, expect, it } from "vitest";
import { fallbackPack, normalizePack } from "@/lib/content-pack";

describe("content-pack normalization", () => {
  it("returns fallback on invalid payload", () => {
    const pack = normalizePack(null, "Моя тема");
    expect(pack.source).toBe("fallback");
    expect(pack.topic).toBe("Моя тема");
    expect(pack.platforms.length).toBeGreaterThan(0);
  });

  it("normalizes valid backend payload", () => {
    const pack = normalizePack(
      {
        source: "backend",
        pack_id: "pack-123",
        generated_at: "2026-03-21T00:00:00.000Z",
        title: "Тестовый заголовок",
        topic: "Тестовая тема",
        platforms: [
          { id: "instagram", name: "Instagram", char_limit: 2200, text: "Instagram text" },
          { id: "telegram", name: "Telegram", char_limit: 4096, text: "Telegram text" },
        ],
        assets: {
          image_prompt: "img",
          carousel_outline: ["one", "two"],
          pdf_summary: "pdf",
        },
      },
      "fallback-topic",
    );

    expect(pack.source).toBe("backend");
    expect(pack.packId).toBe("pack-123");
    expect(pack.title).toBe("Тестовый заголовок");
    expect(pack.platforms[0].id).toBe("instagram");
    expect(pack.assets.carouselOutline.length).toBe(2);
  });

  it("fallback factory creates five platforms", () => {
    const pack = fallbackPack("Новая тема");
    expect(pack.platforms.map((p) => p.id)).toEqual(["instagram", "telegram", "vk", "dzen", "reels"]);
  });
});
