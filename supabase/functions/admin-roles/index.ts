import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createAuthedClient, jsonResponse, requireAnyRole } from "../_shared/admin.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const client = createAuthedClient(req);

    if (req.method === "GET") {
      await requireAnyRole(client, ["owner", "admin", "support"]);
      const url = new URL(req.url);
      const userId = url.searchParams.get("user_id");
      const includeRevoked = url.searchParams.get("include_revoked") === "true";

      let query = client.from("user_roles").select("*").order("granted_at", { ascending: false });
      if (userId) query = query.eq("user_id", userId);
      if (!includeRevoked) query = query.is("revoked_at", null);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();
    const action = body?.action as string;

    if (action === "list_roles") {
      await requireAnyRole(client, ["owner", "admin", "support"]);
      const { data, error } = await client
        .from("user_roles")
        .select("*")
        .order("granted_at", { ascending: false });
      if (error) throw new Error(error.message);
      return jsonResponse({ data });
    }

    if (action === "assign_role") {
      await requireAnyRole(client, ["owner", "admin"]);
      const { error } = await client.rpc("assign_user_role", {
        _target_user_id: body?.userId,
        _role: body?.role,
      });
      if (error) throw new Error(error.message);
      return jsonResponse({ ok: true });
    }

    if (action === "revoke_role") {
      await requireAnyRole(client, ["owner", "admin"]);
      const { error } = await client.rpc("admin_revoke_user_role", {
        _target_user_id: body?.userId,
        _role: body?.role,
        _reason: body?.reason ?? null,
      });
      if (error) throw new Error(error.message);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    console.error("admin-roles error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
