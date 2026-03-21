import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlanTier = "free" | "start" | "pro" | "business";
type SourceLabel = "db" | "fallback";

interface PlanCard {
  id: PlanTier;
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  features: string[];
  limits: string[];
  current: boolean;
}

interface UsageMetric {
  metric: string;
  label: string;
  usedCount: number;
  limitCount: number | null;
}

const fallbackPlansBase: Omit<PlanCard, "current">[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "",
    highlight: false,
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
    highlight: false,
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
    highlight: false,
    features: ["Всё из Про", "5 стилевых профилей", "Премиум стили картинок", "Свои ключи для трендов"],
    limits: [],
  },
];

const fallbackUsage: UsageMetric[] = [
  { metric: "content_packs", label: "Контент-пакеты", usedCount: 2, limitCount: 3 },
];

const metricLabels: Record<string, string> = {
  content_packs: "Контент-пакеты",
  transcripts: "Расшифровки",
  pdf_guides: "PDF-гайды",
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isPlanTier = (value: string): value is PlanTier =>
  value === "free" || value === "start" || value === "pro" || value === "business";

const normalizePlanCatalog = (value: unknown): Omit<PlanCard, "current">[] => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallbackPlansBase;
  const maybePlans = (value as Record<string, unknown>).plans;
  if (!Array.isArray(maybePlans)) return fallbackPlansBase;

  const parsed = maybePlans
    .map((item): Omit<PlanCard, "current"> | null => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const raw = item as Record<string, unknown>;
      if (typeof raw.id !== "string" || !isPlanTier(raw.id)) return null;
      if (typeof raw.name !== "string" || typeof raw.price !== "string" || typeof raw.period !== "string") {
        return null;
      }
      const features = Array.isArray(raw.features)
        ? raw.features.filter((entry): entry is string => typeof entry === "string")
        : [];
      const limits = Array.isArray(raw.limits)
        ? raw.limits.filter((entry): entry is string => typeof entry === "string")
        : [];
      return {
        id: raw.id,
        name: raw.name,
        price: raw.price,
        period: raw.period,
        highlight: Boolean(raw.highlight),
        features,
        limits,
      };
    })
    .filter((item): item is Omit<PlanCard, "current"> => item !== null);

  if (parsed.length === 0) return fallbackPlansBase;

  const byId = new Map(parsed.map((plan) => [plan.id, plan]));
  return (["free", "start", "pro", "business"] as PlanTier[]).map((tier) => byId.get(tier) ?? fallbackPlansBase.find((p) => p.id === tier)!);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    }

    const authHeader = req.headers.get("Authorization");
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
      auth: { persistSession: false },
    });

    let plansSource: SourceLabel = "fallback";
    let subscriptionSource: SourceLabel = "fallback";
    let usageSource: SourceLabel = "fallback";

    let planCatalog = fallbackPlansBase;
    let currentTier: PlanTier = "free";
    let currentStatus = "active";
    let periodEnd: string | null = null;
    let usage = fallbackUsage;

    const { data: pricingSettings } = await client
      .from("app_settings")
      .select("value")
      .eq("scope", "pricing")
      .eq("key", "plans_catalog")
      .eq("is_enabled", true)
      .maybeSingle();

    if (pricingSettings?.value) {
      planCatalog = normalizePlanCatalog(pricingSettings.value);
      plansSource = "db";
    }

    if (authHeader) {
      const { data: userData } = await client.auth.getUser();
      const userId = userData?.user?.id;

      if (userId) {
        const { data: subscription } = await client
          .from("subscriptions")
          .select("tier,status,period_end")
          .eq("user_id", userId)
          .eq("is_current", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscription?.tier && isPlanTier(subscription.tier)) {
          currentTier = subscription.tier;
          subscriptionSource = "db";
        }
        if (subscription?.status) {
          currentStatus = subscription.status;
          subscriptionSource = "db";
        }
        if (subscription?.period_end) {
          periodEnd = subscription.period_end;
          subscriptionSource = "db";
        }

        const now = new Date();
        const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
          .toISOString()
          .slice(0, 10);
        const periodEndDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
          .toISOString()
          .slice(0, 10);

        const { data: usageRows } = await client
          .from("usage_counters")
          .select("metric,used_count,limit_count,updated_at")
          .eq("user_id", userId)
          .gte("period_start", periodStart)
          .lte("period_end", periodEndDate)
          .order("updated_at", { ascending: false })
          .limit(200);

        if (usageRows && usageRows.length > 0) {
          const latestByMetric = new Map<string, { used_count: number; limit_count: number | null }>();
          for (const row of usageRows) {
            if (!latestByMetric.has(row.metric)) {
              latestByMetric.set(row.metric, {
                used_count: row.used_count ?? 0,
                limit_count: row.limit_count ?? null,
              });
            }
          }
          usage = Array.from(latestByMetric.entries())
            .map(([metric, data]) => ({
              metric,
              label: metricLabels[metric] ?? metric,
              usedCount: data.used_count,
              limitCount: data.limit_count,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, "ru"));
          usageSource = "db";
        }
      }
    }

    const plans: PlanCard[] = planCatalog.map((plan) => ({
      ...plan,
      current: plan.id === currentTier,
    }));

    return jsonResponse({
      plans,
      subscription: {
        tier: currentTier,
        status: currentStatus,
        periodEnd,
      },
      usage,
      source: {
        plans: plansSource,
        subscription: subscriptionSource,
        usage: usageSource,
      },
    });
  } catch (error) {
    console.error("pricing-dashboard error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
