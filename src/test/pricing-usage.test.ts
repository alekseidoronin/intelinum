import { describe, expect, it } from "vitest";
import { normalizePricingUsageSnapshot } from "@/lib/pricing-usage";

describe("pricing-usage normalization", () => {
  it("returns fallback shape for empty payload", () => {
    const snapshot = normalizePricingUsageSnapshot(null);

    expect(snapshot.currentPlanId).toBe("free");
    expect(snapshot.usage.contentPacks.limit).toBe(3);
    expect(snapshot.plans.length).toBeGreaterThan(0);
  });

  it("normalizes backend payload and calculates remaining", () => {
    const snapshot = normalizePricingUsageSnapshot({
      source: "backend",
      fetched_at: "2026-03-21T00:00:00.000Z",
      current_plan_id: "start",
      current_plan_name: "Старт",
      plans: [
        {
          id: "start",
          name: "Старт",
          price: "790 ₽",
          period: "/ месяц",
          features: ["f1"],
          limits: [],
        },
      ],
      usage: {
        period_label: "март 2026",
        content_packs: { used: 12, limit: 30 },
        transcripts: { used: 4, limit: 5 },
        pdf_guides: { used: 1, limit: 5 },
      },
    });

    expect(snapshot.source).toBe("backend");
    expect(snapshot.currentPlanId).toBe("start");
    expect(snapshot.usage.contentPacks.remaining).toBe(18);
    expect(snapshot.usage.transcripts.remaining).toBe(1);
    expect(snapshot.usage.pdfGuides.remaining).toBe(4);
  });
});
