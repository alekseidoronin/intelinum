import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createAuthedClient, jsonResponse, requireAnyRole } from "../_shared/admin.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const client = createAuthedClient(req);
    await requireAnyRole(client, ["owner", "admin", "support"]);

    if (req.method === "GET") {
      const url = new URL(req.url);
      const targetType = url.searchParams.get("target_type");
      const targetId = url.searchParams.get("target_id");
      const action = url.searchParams.get("action");
      const limit = Math.min(Number(url.searchParams.get("limit") ?? "100"), 500);

      let query = client
        .from("audit_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (targetType) query = query.eq("target_type", targetType);
      if (targetId) query = query.eq("target_id", targetId);
      if (action) query = query.eq("action", action);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();
    const action = body?.action as string;

    if (action === "write_event") {
      await requireAnyRole(client, ["owner", "admin"]);
      const { data, error } = await client.rpc("admin_log_event", {
        _action: body?.eventAction,
        _target_type: body?.targetType,
        _target_id: body?.targetId,
        _before_state: body?.beforeState ?? null,
        _after_state: body?.afterState ?? null,
        _metadata: body?.metadata ?? {},
      });
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    return jsonResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    console.error("admin-audit error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
