import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const fallbackPosts = [
  `Число 9 сегодня - это число завершений и мудрости.

Если что-то в вашей жизни никак не заканчивается - отношения, проект, привычка - сегодня энергия помогает отпустить. Не бороться, а отпустить.

Спросите себя: что я ношу с собой из прошлого, что уже давно пора оставить?

Девятка учит нас, что пространство для нового появляется только тогда, когда мы освобождаем место.

#нумерология #числодня #энергиядня`,
  `Число 3 - это день творчества и самовыражения.

Сегодня лучшее время для новых идей, общения и лёгкости. Не планируйте тяжёлые задачи - доверьтесь потоку.

Тройка говорит: выражай себя, будь искренним, радуйся мелочам.

#нумерология #числодня #творчество`,
  `Число 6 - день заботы и гармонии.

Шестёрка приносит тепло в отношения. Сделайте что-то приятное для близкого человека - это вернётся к вам.

Главная задача дня: найти баланс между давать и получать.

#нумерология #числодня #гармония`,
];

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const dayOfYearIndex = (d: Date, total: number) => {
  if (total <= 0) return 0;
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const dayOfYear = Math.floor((today - start) / 86400000);
  return (dayOfYear - 1 + total) % total;
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

    let action = "get_home_dashboard";
    let currentIndex: number | undefined;
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (typeof body?.action === "string") action = body.action;
      if (typeof body?.currentIndex === "number") currentIndex = body.currentIndex;
    }

    let posts = [...fallbackPosts];
    let source: "fallback" | "db" = "fallback";

    const { data: settingData } = await client
      .from("app_settings")
      .select("value")
      .eq("scope", "home")
      .eq("key", "daily_content")
      .eq("is_enabled", true)
      .maybeSingle();

    const rawValue = settingData?.value;
    if (rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)) {
      const maybePosts = (rawValue as Record<string, unknown>).posts;
      if (Array.isArray(maybePosts)) {
        const normalized = maybePosts.filter(
          (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
        );
        if (normalized.length > 0) {
          posts = normalized;
          source = "db";
        }
      }
    }

    const now = new Date();
    let index = dayOfYearIndex(now, posts.length);
    if (action === "rotate" && typeof currentIndex === "number" && posts.length > 0) {
      index = (currentIndex + 1) % posts.length;
    }

    let usage = {
      usedCount: 0,
      limitCount: 3 as number | null,
      tier: "free",
      status: "active",
    };

    if (authHeader) {
      const { data: userData } = await client.auth.getUser();
      const userId = userData?.user?.id;

      if (userId) {
        const { data: subscription } = await client
          .from("subscriptions")
          .select("tier,status")
          .eq("user_id", userId)
          .eq("is_current", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscription) {
          usage = {
            ...usage,
            tier: subscription.tier ?? usage.tier,
            status: subscription.status ?? usage.status,
          };
        }

        const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
          .toISOString()
          .slice(0, 10);
        const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
          .toISOString()
          .slice(0, 10);

        const { data: usageCounter } = await client
          .from("usage_counters")
          .select("used_count,limit_count")
          .eq("user_id", userId)
          .eq("metric", "content_packs")
          .gte("period_start", periodStart)
          .lte("period_end", periodEnd)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (usageCounter) {
          usage = {
            ...usage,
            usedCount: usageCounter.used_count ?? usage.usedCount,
            limitCount: usageCounter.limit_count ?? usage.limitCount,
          };
        }
      }
    }

    return jsonResponse({
      daily: {
        posts,
        index,
        date: now.toISOString().slice(0, 10),
      },
      usage,
      source,
    });
  } catch (error) {
    console.error("home-dashboard error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
