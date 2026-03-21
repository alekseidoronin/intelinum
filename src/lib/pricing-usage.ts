import { supabase } from "@/integrations/supabase/client";

export type PlanId = "free" | "start" | "pro" | "business";

export type UsageMetric = {
  used: number;
  limit: number | null;
  remaining: number | null;
};

export type PricingPlan = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  features: string[];
  limits: string[];
};

export type PricingUsageSnapshot = {
  source: "backend" | "fallback";
  fetchedAt: string;
  currentPlanId: PlanId;
  currentPlanName: string;
  plans: PricingPlan[];
  usage: {
    periodLabel: string;
    contentPacks: UsageMetric;
    transcripts: UsageMetric;
    pdfGuides: UsageMetric;
  };
};

const FALLBACK_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "",
    features: [
      "Контент дня каждое утро",
      "3 контент-пакета в месяц",
      "5 тем из трендов в день",
      "3 стиля картинок",
      "1 стилевой профиль",
    ],
    limits: ["Без расшифровки записей", "Без PDF-гайдов"],
  },
  {
    id: "start",
    name: "Старт",
    price: "790 ₽",
    period: "/ месяц",
    features: [
      "Контент дня каждое утро",
      "30 контент-пакетов в месяц",
      "5 расшифровок (до 2ч)",
      "5 PDF-гайдов в месяц",
      "Все темы из трендов",
      "Все стили картинок",
    ],
    limits: [],
  },
  {
    id: "pro",
    name: "Про",
    price: "1 990 ₽",
    period: "/ месяц",
    highlight: true,
    features: [
      "Всё из Старт",
      "Безлимитные контент-пакеты",
      "Безлимитные расшифровки",
      "Безлимитные PDF-гайды",
      "2 стилевых профиля",
      "Приоритетная поддержка",
    ],
    limits: [],
  },
  {
    id: "business",
    name: "Бизнес",
    price: "4 990 ₽",
    period: "/ месяц",
    features: [
      "Всё из Про",
      "5 стилевых профилей",
      "Премиум стили картинок",
      "Свои ключи для трендов",
    ],
    limits: [],
  },
];

const fallbackMetric = (used: number, limit: number | null): UsageMetric => ({
  used,
  limit,
  remaining: limit === null ? null : Math.max(0, limit - used),
});

const currentPeriodLabel = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
}).format(new Date());

export const fallbackPricingUsageSnapshot: PricingUsageSnapshot = {
  source: "fallback",
  fetchedAt: new Date().toISOString(),
  currentPlanId: "free",
  currentPlanName: "Бесплатный",
  plans: FALLBACK_PLANS,
  usage: {
    periodLabel: currentPeriodLabel,
    contentPacks: fallbackMetric(2, 3),
    transcripts: fallbackMetric(0, 0),
    pdfGuides: fallbackMetric(0, 0),
  },
};

const planIds = new Set<PlanId>(["free", "start", "pro", "business"]);

const toPlanId = (value: unknown, fallback: PlanId): PlanId =>
  typeof value === "string" && planIds.has(value as PlanId) ? (value as PlanId) : fallback;

const toString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const toSafeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(0, Math.floor(parsed));
  }
  return fallback;
};

const toLimit = (value: unknown, fallback: number | null): number | null => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === "string") {
    if (value === "∞" || value.toLowerCase() === "unlimited") return null;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(0, Math.floor(parsed));
  }
  return fallback;
};

const normalizeMetric = (value: unknown, fallback: UsageMetric): UsageMetric => {
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, unknown>;
  const used = toSafeNumber(raw.used, fallback.used);
  const limit = toLimit(raw.limit, fallback.limit);
  const remaining = limit === null ? null : Math.max(0, limit - used);
  return { used, limit, remaining };
};

const normalizePlans = (value: unknown): PricingPlan[] => {
  if (!Array.isArray(value) || value.length === 0) return FALLBACK_PLANS;

  const mapped = value
    .map((rawPlan) => {
      if (!rawPlan || typeof rawPlan !== "object") return null;
      const plan = rawPlan as Record<string, unknown>;
      const id = toPlanId(plan.id, "free");
      const fallback = FALLBACK_PLANS.find((item) => item.id === id) ?? FALLBACK_PLANS[0];
      return {
        ...fallback,
        id,
        name: toString(plan.name, fallback.name),
        price: toString(plan.price, fallback.price),
        period: toString(plan.period, fallback.period),
        highlight: typeof plan.highlight === "boolean" ? plan.highlight : fallback.highlight ?? false,
        features: Array.isArray(plan.features)
          ? plan.features.filter((x): x is string => typeof x === "string")
          : fallback.features,
        limits: Array.isArray(plan.limits)
          ? plan.limits.filter((x): x is string => typeof x === "string")
          : fallback.limits,
      } satisfies PricingPlan;
    })
    .filter((x): x is PricingPlan => x !== null);

  return mapped.length > 0 ? mapped : FALLBACK_PLANS;
};

export const normalizePricingUsageSnapshot = (payload: unknown): PricingUsageSnapshot => {
  if (!payload || typeof payload !== "object") {
    return fallbackPricingUsageSnapshot;
  }

  const raw = payload as Record<string, unknown>;
  const plans = normalizePlans(raw.plans);
  const currentPlanId = toPlanId(raw.current_plan_id, fallbackPricingUsageSnapshot.currentPlanId);
  const currentPlanName =
    toString(raw.current_plan_name, "") || plans.find((plan) => plan.id === currentPlanId)?.name || "Бесплатный";

  const rawUsage = raw.usage && typeof raw.usage === "object" ? (raw.usage as Record<string, unknown>) : {};
  return {
    source: raw.source === "backend" ? "backend" : "fallback",
    fetchedAt: toString(raw.fetched_at, new Date().toISOString()),
    currentPlanId,
    currentPlanName,
    plans,
    usage: {
      periodLabel: toString(rawUsage.period_label, fallbackPricingUsageSnapshot.usage.periodLabel),
      contentPacks: normalizeMetric(rawUsage.content_packs, fallbackPricingUsageSnapshot.usage.contentPacks),
      transcripts: normalizeMetric(rawUsage.transcripts, fallbackPricingUsageSnapshot.usage.transcripts),
      pdfGuides: normalizeMetric(rawUsage.pdf_guides, fallbackPricingUsageSnapshot.usage.pdfGuides),
    },
  };
};

export const fetchPricingUsageSnapshot = async (): Promise<PricingUsageSnapshot> => {
  const { data, error } = await supabase.functions.invoke("pricing-usage", {
    body: { include: ["plans", "usage"] },
  });

  if (error) throw error;
  return normalizePricingUsageSnapshot(data);
};
