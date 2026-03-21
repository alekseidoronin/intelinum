import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type PlanId = "free" | "start" | "pro" | "business";

type UsageMetric = {
  used: number;
  limit: number | null;
  remaining: number | null;
};

type PricingPlan = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  features: string[];
  limits: string[];
};

type PricingUsagePayload = {
  source: "backend" | "fallback";
  fetched_at: string;
  current_plan_id: PlanId;
  current_plan_name: string;
  plans: PricingPlan[];
  usage: {
    period_label: string;
    content_packs: UsageMetric;
    transcripts: UsageMetric;
    pdf_guides: UsageMetric;
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

const DEFAULT_LIMITS_BY_PLAN: Record<
  PlanId,
  { packs: number | null; transcripts: number | null; pdf: number | null }
> = {
  free: { packs: 3, transcripts: 0, pdf: 0 },
  start: { packs: 30, transcripts: 5, pdf: 5 },
  pro: { packs: null, transcripts: null, pdf: null },
  business: { packs: null, transcripts: null, pdf: null },
};

const currentPeriodLabel = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
}).format(new Date());

const toPlanId = (value: unknown): PlanId | null => {
  if (value === "free" || value === "start" || value === "pro" || value === "business") {
    return value;
  }
  return null;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }
  return fallback;
};

const toLimit = (value: unknown, fallback: number | null): number | null => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
  if (typeof value === "string") {
    if (value.toLowerCase() === "unlimited" || value === "∞") return null;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(0, Math.floor(parsed));
  }
  return fallback;
};

const buildMetric = (used: number, limit: number | null): UsageMetric => ({
  used,
  limit,
  remaining: limit === null ? null : Math.max(0, limit - used),
});

const fallbackPayload = (): PricingUsagePayload => ({
  source: "fallback",
  fetched_at: new Date().toISOString(),
  current_plan_id: "free",
  current_plan_name: "Бесплатный",
  plans: FALLBACK_PLANS,
  usage: {
    period_label: currentPeriodLabel,
    content_packs: buildMetric(2, DEFAULT_LIMITS_BY_PLAN.free.packs),
    transcripts: buildMetric(0, DEFAULT_LIMITS_BY_PLAN.free.transcripts),
    pdf_guides: buildMetric(0, DEFAULT_LIMITS_BY_PLAN.free.pdf),
  },
});

const isSchemaError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
  return code === "42P01" || code === "PGRST205" || code === "42703";
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const fallback = fallbackPayload();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "").trim() : "";

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !jwt) {
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
      auth: { persistSession: false },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify(fallback), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plans = [...FALLBACK_PLANS];
    let currentPlanId: PlanId = "free";
    let usage = fallback.usage;
    let backendUsed = false;

    const { data: planRows, error: plansError } = await adminClient
      .from("pricing_plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (plansError && !isSchemaError(plansError)) {
      throw plansError;
    }

    if (!plansError && Array.isArray(planRows) && planRows.length > 0) {
      const mapped = planRows
        .map((row) => {
          const record = asRecord(row);
          const id = toPlanId(record.id ?? record.plan_id);
          if (!id) return null;

          const fallbackPlan = FALLBACK_PLANS.find((item) => item.id === id);
          if (!fallbackPlan) return null;

          return {
            ...fallbackPlan,
            name: typeof record.name === "string" ? record.name : fallbackPlan.name,
            price:
              typeof record.price_monthly_rub === "number"
                ? `${record.price_monthly_rub.toLocaleString("ru-RU")} ₽`
                : fallbackPlan.price,
            period: typeof record.period === "string" ? record.period : fallbackPlan.period,
            highlight:
              typeof record.highlight === "boolean" ? record.highlight : fallbackPlan.highlight ?? false,
            features: Array.isArray(record.features)
              ? record.features.filter((x) => typeof x === "string")
              : fallbackPlan.features,
            limits: Array.isArray(record.limits)
              ? record.limits.filter((x) => typeof x === "string")
              : fallbackPlan.limits,
          } satisfies PricingPlan;
        })
        .filter((item): item is PricingPlan => item !== null);

      if (mapped.length > 0) {
        plans.splice(0, plans.length, ...mapped);
        backendUsed = true;
      }
    }

    const { data: subscriptionRows, error: subscriptionError } = await adminClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .order("updated_at", { ascending: false })
      .limit(1);

    if (subscriptionError && !isSchemaError(subscriptionError)) {
      throw subscriptionError;
    }

    const subscription = Array.isArray(subscriptionRows) ? subscriptionRows[0] : null;
    if (subscription) {
      const planId = toPlanId(
        asRecord(subscription).plan_id ??
          asRecord(subscription).plan ??
          asRecord(subscription).tier ??
          asRecord(subscription).product_id,
      );
      if (planId) {
        currentPlanId = planId;
        backendUsed = true;
      }
    }

    const defaultLimits = DEFAULT_LIMITS_BY_PLAN[currentPlanId];

    const { data: usageRows, error: usageError } = await adminClient
      .from("usage_monthly")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (usageError && !isSchemaError(usageError)) {
      throw usageError;
    }

    const usageRow = Array.isArray(usageRows) ? usageRows[0] : null;
    if (usageRow) {
      const row = asRecord(usageRow);
      usage = {
        period_label:
          typeof row.period_label === "string"
            ? row.period_label
            : typeof row.month === "string"
              ? row.month
              : currentPeriodLabel,
        content_packs: buildMetric(
          toNumber(row.content_packs_used ?? row.packs_used ?? row.generated_packs_used, 0),
          toLimit(row.content_packs_limit ?? row.packs_limit ?? row.generated_packs_limit, defaultLimits.packs),
        ),
        transcripts: buildMetric(
          toNumber(row.transcripts_used ?? row.transcript_used ?? row.audio_minutes_used, 0),
          toLimit(row.transcripts_limit ?? row.transcript_limit ?? row.audio_minutes_limit, defaultLimits.transcripts),
        ),
        pdf_guides: buildMetric(
          toNumber(row.pdf_guides_used ?? row.pdf_used, 0),
          toLimit(row.pdf_guides_limit ?? row.pdf_limit, defaultLimits.pdf),
        ),
      };
      backendUsed = true;
    } else {
      usage = {
        period_label: currentPeriodLabel,
        content_packs: buildMetric(0, defaultLimits.packs),
        transcripts: buildMetric(0, defaultLimits.transcripts),
        pdf_guides: buildMetric(0, defaultLimits.pdf),
      };
    }

    const currentPlan = plans.find((plan) => plan.id === currentPlanId) ?? plans[0] ?? FALLBACK_PLANS[0];
    const payload: PricingUsagePayload = {
      source: backendUsed ? "backend" : "fallback",
      fetched_at: new Date().toISOString(),
      current_plan_id: currentPlanId,
      current_plan_name: currentPlan.name,
      plans,
      usage,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("pricing-usage error:", error);
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
