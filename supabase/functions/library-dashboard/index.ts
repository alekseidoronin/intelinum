import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type LibraryItemType = "pack" | "transcript" | "pdf" | "other";

type LibraryPayloadItem = {
  id: string;
  title: string;
  type: LibraryItemType;
  dateLabel: string;
  starred: boolean;
};

const fallbackItems: LibraryPayloadItem[] = [
  { id: "fallback-1", title: "Число 7: духовный поиск", dateLabel: "Сегодня", type: "pack", starred: true },
  { id: "fallback-2", title: "Энергия дня — 8 марта", dateLabel: "Вчера", type: "pack", starred: false },
  { id: "fallback-3", title: "Запись эфира 06.03", dateLabel: "6 марта", type: "transcript", starred: false },
  { id: "fallback-4", title: "Топ-5 чисел миллионеров", dateLabel: "5 марта", type: "pack", starred: true },
  { id: "fallback-5", title: "PDF-гайд: Число судьбы", dateLabel: "4 марта", type: "pdf", starred: false },
  { id: "fallback-6", title: "Совместимость по числам", dateLabel: "3 марта", type: "pack", starred: false },
];

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalizeType = (value: string | null | undefined): LibraryItemType => {
  if (value === "pack" || value === "transcript" || value === "pdf") return value;
  return "other";
};

const toDateLabel = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "Без даты";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Без даты";

  const today = new Date();
  const dateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((todayLocal.getTime() - dateLocal.getTime()) / 86400000);

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
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

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = typeof body?.action === "string" ? body.action : "list_items";

    if (action === "toggle_star") {
      if (!authHeader) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }
      const itemId = typeof body?.itemId === "string" ? body.itemId : "";
      const isStarred = typeof body?.isStarred === "boolean" ? body.isStarred : null;
      if (!itemId || isStarred === null) {
        return jsonResponse({ error: "itemId and isStarred are required" }, 400);
      }

      const { error: updateError } = await client
        .from("library_items")
        .update({ is_starred: isStarred })
        .eq("id", itemId)
        .is("deleted_at", null);

      if (updateError) {
        return jsonResponse({ error: updateError.message }, 400);
      }

      return jsonResponse({ ok: true, itemId, isStarred });
    }

    if (!authHeader) {
      return jsonResponse({ items: fallbackItems, source: "fallback" });
    }

    const { data: userData } = await client.auth.getUser();
    if (!userData?.user?.id) {
      return jsonResponse({ items: fallbackItems, source: "fallback" });
    }

    const { data, error } = await client
      .from("library_items")
      .select("id,title,item_type,is_starred,created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.warn("library-dashboard list error, returning fallback:", error.message);
      return jsonResponse({ items: fallbackItems, source: "fallback" });
    }

    const mapped = (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title ?? "Без названия"),
      type: normalizeType(row.item_type),
      dateLabel: toDateLabel(row.created_at),
      starred: Boolean(row.is_starred),
    }));

    if (mapped.length === 0) {
      return jsonResponse({ items: fallbackItems, source: "fallback" });
    }

    return jsonResponse({ items: mapped, source: "db" });
  } catch (error) {
    console.error("library-dashboard error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
