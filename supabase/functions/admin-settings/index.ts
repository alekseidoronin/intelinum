import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createAuthedClient, jsonResponse, requireAnyRole } from "../_shared/admin.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const client = createAuthedClient(req);

    if (req.method === "GET") {
      await requireAnyRole(client, ["owner", "admin", "support", "readonly"]);
      const url = new URL(req.url);
      const scope = url.searchParams.get("scope");
      const key = url.searchParams.get("key");
      const includeDisabled = url.searchParams.get("include_disabled") === "true";

      let query = client.from("app_settings").select("*").order("updated_at", { ascending: false });
      if (scope) query = query.eq("scope", scope);
      if (key) query = query.eq("key", key);
      if (!includeDisabled) query = query.eq("is_enabled", true);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();
    const action = body?.action as string;

    if (action === "list_settings") {
      await requireAnyRole(client, ["owner", "admin", "support", "readonly"]);
      const { data, error } = await client
        .from("app_settings")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (action === "list_revisions") {
      await requireAnyRole(client, ["owner", "admin", "support", "readonly"]);
      const settingId = body?.settingId as string | undefined;
      const scope = body?.scope as string | undefined;
      const key = body?.key as string | undefined;

      let query = client
        .from("app_setting_revisions")
        .select("*")
        .order("created_at", { ascending: false });

      if (settingId) query = query.eq("setting_id", settingId);
      if (scope) query = query.eq("scope", scope);
      if (key) query = query.eq("key", key);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (action === "create_draft") {
      await requireAnyRole(client, ["owner", "admin"]);
      const { data, error } = await client.rpc("admin_create_setting_draft", {
        _scope: body?.scope,
        _key: body?.key,
        _value: body?.value ?? {},
        _description: body?.description ?? null,
        _is_enabled: body?.isEnabled ?? true,
        _change_note: body?.changeNote ?? null,
      });
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (action === "publish_revision") {
      await requireAnyRole(client, ["owner", "admin"]);
      const { data, error } = await client.rpc("admin_publish_setting_revision", {
        _revision_id: body?.revisionId,
        _publish_note: body?.publishNote ?? null,
      });
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    return jsonResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    console.error("admin-settings error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
