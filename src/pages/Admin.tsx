import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw, Shield, Users, Settings2, FileText, BarChart3 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TabKey = "health" | "settings" | "content" | "roles" | "plans" | "audit";
type HealthState = "ok" | "warn" | "error";

interface SettingItem {
  id: string;
  scope: string;
  key: string;
  value: unknown;
  is_enabled: boolean;
  version: number;
  updated_at: string;
}

interface RevisionItem {
  id: string;
  setting_id: string;
  scope: string;
  key: string;
  version: number;
  state: "draft" | "published" | "discarded";
  created_at: string;
}

interface RoleItem {
  id: string;
  user_id: string;
  role: string;
  granted_at: string;
  revoked_at: string | null;
}

interface AuditItem {
  id: number;
  action: string;
  target_type: string;
  target_id: string;
  actor_user_id: string | null;
  created_at: string;
}

interface ProfileItem {
  user_id: string;
  display_name: string | null;
}

interface SubscriptionItem {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  is_current: boolean;
  period_end: string | null;
}

interface UsageItem {
  id: string;
  user_id: string;
  metric: string;
  used_count: number;
  limit_count: number | null;
  period_start: string;
  period_end: string;
}

interface LooseError {
  message?: string;
}

interface LooseTableQuery<T> {
  select(columns: string): LooseTableQuery<T>;
  order(column: string, options: { ascending: boolean }): LooseTableQuery<T>;
  limit(count: number): Promise<{ data: T[] | null; error: LooseError | null }>;
}

interface SupabaseLooseClient {
  from<T>(table: string): LooseTableQuery<T>;
}

const tabs: { key: TabKey; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "health", label: "Health", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings2 },
  { key: "content", label: "Content Rules", icon: FileText },
  { key: "roles", label: "Users & Roles", icon: Users },
  { key: "plans", label: "Plans & Usage", icon: BarChart3 },
  { key: "audit", label: "Audit", icon: Shield },
];

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>("health");
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [usageRows, setUsageRows] = useState<UsageItem[]>([]);

  const [health, setHealth] = useState<Record<string, { state: HealthState; message: string }>>({
    settingsApi: { state: "warn", message: "not checked" },
    rolesApi: { state: "warn", message: "not checked" },
    auditApi: { state: "warn", message: "not checked" },
    subscriptions: { state: "warn", message: "not checked" },
    usage: { state: "warn", message: "not checked" },
  });

  const [settingsForm, setSettingsForm] = useState({
    scope: "global",
    key: "",
    valueText: "{}",
    description: "",
    isEnabled: true,
    changeNote: "",
  });
  const [publishRevisionId, setPublishRevisionId] = useState("");
  const [publishNote, setPublishNote] = useState("");

  const [contentRuleForm, setContentRuleForm] = useState({
    key: "",
    valueText: "{\"enabled\": true}",
    description: "",
    changeNote: "",
  });

  const [rolesForm, setRolesForm] = useState({
    userId: "",
    role: "support",
    revokeReason: "",
  });

  const [auditFilter, setAuditFilter] = useState({
    eventAction: "",
    targetType: "",
    targetId: "",
    limit: 100,
  });

  const contentScopedSettings = useMemo(
    () => settings.filter((s) => s.scope === "content"),
    [settings],
  );

  const draftRevisions = useMemo(
    () => revisions.filter((r) => r.state === "draft"),
    [revisions],
  );

  const jsonOrThrow = (text: string) => {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON payload");
    }
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
  };

  const invokeAdmin = async <T,>(fn: string, body: unknown): Promise<T> => {
    const { data, error } = await supabase.functions.invoke(fn, { body });
    if (error) throw new Error(error.message || "Admin API error");
    return data as T;
  };

  const loadSettings = async () => {
    try {
      const settingsRes = await invokeAdmin<{ data: SettingItem[] }>("admin-settings", { action: "list_settings" });
      setSettings(settingsRes.data ?? []);
      setHealth((prev) => ({ ...prev, settingsApi: { state: "ok", message: `ok (${settingsRes.data?.length ?? 0} items)` } }));
    } catch (e) {
      setHealth((prev) => ({ ...prev, settingsApi: { state: "error", message: (e as Error).message } }));
      throw e;
    }
  };

  const loadRevisions = async () => {
    const revisionsRes = await invokeAdmin<{ data: RevisionItem[] }>("admin-settings", { action: "list_revisions" });
    setRevisions(revisionsRes.data ?? []);
  };

  const loadRoles = async () => {
    try {
      const rolesRes = await invokeAdmin<{ data: RoleItem[] }>("admin-roles", { action: "list_roles" });
      setRoles(rolesRes.data ?? []);
      setHealth((prev) => ({ ...prev, rolesApi: { state: "ok", message: `ok (${rolesRes.data?.length ?? 0} rows)` } }));
    } catch (e) {
      setRoles([]);
      setHealth((prev) => ({ ...prev, rolesApi: { state: "warn", message: (e as Error).message } }));
    }
  };

  const loadAudit = async () => {
    try {
      const auditRes = await invokeAdmin<{ data: AuditItem[] }>("admin-audit", {
        action: "list_events",
        eventAction: auditFilter.eventAction || undefined,
        targetType: auditFilter.targetType || undefined,
        targetId: auditFilter.targetId || undefined,
        limit: auditFilter.limit,
      });
      setAudits(auditRes.data ?? []);
      setHealth((prev) => ({ ...prev, auditApi: { state: "ok", message: `ok (${auditRes.data?.length ?? 0} events)` } }));
    } catch (e) {
      setAudits([]);
      setHealth((prev) => ({ ...prev, auditApi: { state: "warn", message: (e as Error).message } }));
    }
  };

  const loadPlansAndUsage = async () => {
    const client = supabase as unknown as SupabaseLooseClient;

    try {
      const { data, error } = await client
        .from("subscriptions")
        .select("id,user_id,tier,status,is_current,period_end")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      setSubscriptions((data ?? []) as SubscriptionItem[]);
      setHealth((prev) => ({ ...prev, subscriptions: { state: "ok", message: `ok (${data?.length ?? 0} rows)` } }));
    } catch (e: unknown) {
      setSubscriptions([]);
      setHealth((prev) => ({ ...prev, subscriptions: { state: "warn", message: getErrorMessage(e, "read error") } }));
    }

    try {
      const { data, error } = await client
        .from("usage_counters")
        .select("id,user_id,metric,used_count,limit_count,period_start,period_end")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      setUsageRows((data ?? []) as UsageItem[]);
      setHealth((prev) => ({ ...prev, usage: { state: "ok", message: `ok (${data?.length ?? 0} rows)` } }));
    } catch (e: unknown) {
      setUsageRows([]);
      setHealth((prev) => ({ ...prev, usage: { state: "warn", message: getErrorMessage(e, "read error") } }));
    }

    try {
      const { data, error } = await client.from("profiles").select("user_id,display_name").limit(200);
      if (error) throw error;
      setProfiles((data ?? []) as ProfileItem[]);
    } catch {
      setProfiles([]);
    }
  };

  const refreshAll = async () => {
    setPageLoading(true);
    try {
      await Promise.all([loadSettings(), loadRevisions(), loadRoles(), loadAudit(), loadPlansAndUsage()]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const checkAccess = async () => {
      try {
        await invokeAdmin("admin-settings", { action: "list_settings" });
        setCanAccess(true);
        setAccessError("");
      } catch (e) {
        setCanAccess(false);
        setAccessError((e as Error).message);
      }
    };
    void checkAccess();
  }, [user]);

  useEffect(() => {
    if (!canAccess) return;
    void refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess]);

  const onCreateSettingsDraft = async () => {
    try {
      const value = jsonOrThrow(settingsForm.valueText);
      await invokeAdmin("admin-settings", {
        action: "create_draft",
        scope: settingsForm.scope,
        key: settingsForm.key,
        value,
        description: settingsForm.description || null,
        isEnabled: settingsForm.isEnabled,
        changeNote: settingsForm.changeNote || null,
      });
      toast({ description: "Draft создан" });
      setSettingsForm((prev) => ({ ...prev, key: "", description: "", changeNote: "" }));
      await Promise.all([loadSettings(), loadRevisions()]);
    } catch (e: unknown) {
      toast({ description: getErrorMessage(e, "Не удалось создать draft"), variant: "destructive" });
    }
  };

  const onPublishRevision = async () => {
    if (!publishRevisionId) return;
    try {
      await invokeAdmin("admin-settings", {
        action: "publish_revision",
        revisionId: publishRevisionId,
        publishNote: publishNote || null,
      });
      toast({ description: "Revision опубликован" });
      setPublishRevisionId("");
      setPublishNote("");
      await Promise.all([loadSettings(), loadRevisions(), loadAudit()]);
    } catch (e: unknown) {
      toast({ description: getErrorMessage(e, "Не удалось опубликовать revision"), variant: "destructive" });
    }
  };

  const onCreateContentRule = async () => {
    try {
      const value = jsonOrThrow(contentRuleForm.valueText);
      await invokeAdmin("admin-settings", {
        action: "create_draft",
        scope: "content",
        key: contentRuleForm.key,
        value,
        description: contentRuleForm.description || null,
        isEnabled: true,
        changeNote: contentRuleForm.changeNote || null,
      });
      toast({ description: "Content rule draft создан" });
      setContentRuleForm({ key: "", valueText: "{\"enabled\": true}", description: "", changeNote: "" });
      await Promise.all([loadSettings(), loadRevisions()]);
    } catch (e: unknown) {
      toast({ description: getErrorMessage(e, "Ошибка создания content rule"), variant: "destructive" });
    }
  };

  const onAssignRole = async () => {
    try {
      await invokeAdmin("admin-roles", {
        action: "assign_role",
        userId: rolesForm.userId,
        role: rolesForm.role,
      });
      toast({ description: "Роль назначена" });
      await Promise.all([loadRoles(), loadAudit()]);
    } catch (e: unknown) {
      toast({ description: getErrorMessage(e, "Ошибка назначения роли"), variant: "destructive" });
    }
  };

  const onRevokeRole = async () => {
    try {
      await invokeAdmin("admin-roles", {
        action: "revoke_role",
        userId: rolesForm.userId,
        role: rolesForm.role,
        reason: rolesForm.revokeReason || null,
      });
      toast({ description: "Роль отозвана" });
      await Promise.all([loadRoles(), loadAudit()]);
    } catch (e: unknown) {
      toast({ description: getErrorMessage(e, "Ошибка отзыва роли"), variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background p-6 text-sm text-muted-foreground">Проверяем доступ...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar />
        <div className="max-w-3xl mx-auto p-5">
          <div className="bg-white border border-border rounded-2xl p-5 shadow-card">
            <h1 className="font-display text-2xl text-royal mb-2">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mb-4">Для доступа требуется авторизация.</p>
            <button onClick={() => navigate("/auth")} className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium">
              Войти
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (canAccess === false) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar />
        <div className="max-w-3xl mx-auto p-5">
          <div className="bg-white border border-destructive/30 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle size={18} />
              <h1 className="font-display text-xl">Нет доступа к админ-панели</h1>
            </div>
            <p className="text-sm text-muted-foreground">{accessError || "Текущая роль не имеет прав."}</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <TopBar />
      <div className="max-w-7xl mx-auto px-5 pt-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-2xl text-royal">Admin Panel v1</h1>
            <p className="text-sm text-muted-foreground">Централизованное управление настройками, ролями и аудитом</p>
          </div>
          <button
            onClick={() => void refreshAll()}
            className="px-4 py-2 rounded-xl border border-border bg-white text-sapphire text-sm font-medium flex items-center gap-2 shadow-card"
          >
            <RefreshCw size={14} className={pageLoading ? "animate-spin" : ""} />
            Обновить
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 border ${
                activeTab === tab.key ? "bg-royal text-swan border-royal" : "bg-white text-sapphire border-border"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "health" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Object.entries(health).map(([name, info]) => (
              <div key={name} className="bg-white border border-border rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-2 mb-1">
                  {info.state === "ok" ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={16} className={info.state === "warn" ? "text-amber-600" : "text-destructive"} />
                  )}
                  <p className="text-sm font-semibold text-royal">{name}</p>
                </div>
                <p className="text-xs text-muted-foreground break-all">{info.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Создать draft setting</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  value={settingsForm.scope}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, scope: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-border text-sm"
                  placeholder="scope"
                />
                <input
                  value={settingsForm.key}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, key: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-border text-sm"
                  placeholder="key"
                />
              </div>
              <textarea
                value={settingsForm.valueText}
                onChange={(e) => setSettingsForm((p) => ({ ...p, valueText: e.target.value }))}
                className="w-full h-28 px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder='{"enabled": true}'
              />
              <input
                value={settingsForm.description}
                onChange={(e) => setSettingsForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder="description"
              />
              <input
                value={settingsForm.changeNote}
                onChange={(e) => setSettingsForm((p) => ({ ...p, changeNote: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-3"
                placeholder="change note"
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <input
                  type="checkbox"
                  checked={settingsForm.isEnabled}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, isEnabled: e.target.checked }))}
                />
                is_enabled
              </label>
              <button onClick={() => void onCreateSettingsDraft()} className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium">
                Создать draft
              </button>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Публикация draft</h2>
              <select
                value={publishRevisionId}
                onChange={(e) => setPublishRevisionId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
              >
                <option value="">Выбери revision</option>
                {draftRevisions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.scope}.{r.key} v{r.version}
                  </option>
                ))}
              </select>
              <input
                value={publishNote}
                onChange={(e) => setPublishNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-3"
                placeholder="publish note"
              />
              <button onClick={() => void onPublishRevision()} className="px-4 py-2 rounded-xl bg-sapphire text-swan text-sm font-medium">
                Publish
              </button>

              <div className="mt-4 max-h-64 overflow-auto space-y-2">
                {settings.map((s) => (
                  <div key={s.id} className="border border-border rounded-xl p-2 text-xs">
                    <div className="font-semibold text-royal">{s.scope}.{s.key}</div>
                    <div className="text-muted-foreground">v{s.version} · {s.is_enabled ? "enabled" : "disabled"}</div>
                    <pre className="mt-1 whitespace-pre-wrap text-[11px] text-foreground">{JSON.stringify(s.value, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Content rules / prompts</h2>
              <input
                value={contentRuleForm.key}
                onChange={(e) => setContentRuleForm((p) => ({ ...p, key: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder="rule key (e.g. rewrite.max_chars)"
              />
              <textarea
                value={contentRuleForm.valueText}
                onChange={(e) => setContentRuleForm((p) => ({ ...p, valueText: e.target.value }))}
                className="w-full h-28 px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder='{"prompt":"..."}'
              />
              <input
                value={contentRuleForm.description}
                onChange={(e) => setContentRuleForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder="description"
              />
              <input
                value={contentRuleForm.changeNote}
                onChange={(e) => setContentRuleForm((p) => ({ ...p, changeNote: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-3"
                placeholder="change note"
              />
              <button onClick={() => void onCreateContentRule()} className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium">
                Создать content draft
              </button>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Текущие content settings</h2>
              <div className="max-h-80 overflow-auto space-y-2">
                {contentScopedSettings.length === 0 && (
                  <p className="text-sm text-muted-foreground">Пока нет записей со scope=`content`.</p>
                )}
                {contentScopedSettings.map((s) => (
                  <div key={s.id} className="border border-border rounded-xl p-2 text-xs">
                    <div className="font-semibold text-royal">{s.key}</div>
                    <div className="text-muted-foreground">v{s.version}</div>
                    <pre className="mt-1 whitespace-pre-wrap text-[11px] text-foreground">{JSON.stringify(s.value, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Назначение / отзыв ролей</h2>
              <input
                value={rolesForm.userId}
                onChange={(e) => setRolesForm((p) => ({ ...p, userId: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
                placeholder="target user id (uuid)"
              />
              <select
                value={rolesForm.role}
                onChange={(e) => setRolesForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-2"
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="support">support</option>
                <option value="readonly">readonly</option>
              </select>
              <input
                value={rolesForm.revokeReason}
                onChange={(e) => setRolesForm((p) => ({ ...p, revokeReason: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm mb-3"
                placeholder="reason (for revoke)"
              />
              <div className="flex gap-2">
                <button onClick={() => void onAssignRole()} className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium">
                  Assign role
                </button>
                <button onClick={() => void onRevokeRole()} className="px-4 py-2 rounded-xl bg-white border border-border text-sapphire text-sm font-medium">
                  Revoke role
                </button>
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Активные роли</h2>
              <div className="max-h-80 overflow-auto space-y-2">
                {roles.filter((r) => !r.revoked_at).map((r) => (
                  <div key={r.id} className="border border-border rounded-xl p-2 text-xs">
                    <div className="font-semibold text-royal">{r.role}</div>
                    <div className="text-muted-foreground break-all">{r.user_id}</div>
                    <div className="text-muted-foreground">{new Date(r.granted_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Subscriptions</h2>
              <div className="max-h-80 overflow-auto space-y-2">
                {subscriptions.map((s) => (
                  <div key={s.id} className="border border-border rounded-xl p-2 text-xs">
                    <div className="font-semibold text-royal">{s.tier} · {s.status}</div>
                    <div className="text-muted-foreground break-all">user: {s.user_id}</div>
                    <div className="text-muted-foreground">current: {String(s.is_current)} · end: {s.period_end ?? "n/a"}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <h2 className="font-semibold text-royal mb-3">Usage counters</h2>
              <div className="max-h-80 overflow-auto space-y-2">
                {usageRows.map((u) => (
                  <div key={u.id} className="border border-border rounded-xl p-2 text-xs">
                    <div className="font-semibold text-royal">{u.metric}: {u.used_count} / {u.limit_count ?? "∞"}</div>
                    <div className="text-muted-foreground break-all">user: {u.user_id}</div>
                    <div className="text-muted-foreground">{u.period_start} {"->"} {u.period_end}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Profiles cached: {profiles.length}</div>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
            <h2 className="font-semibold text-royal mb-3">Audit events</h2>
            <div className="grid md:grid-cols-4 gap-2 mb-3">
              <input
                value={auditFilter.eventAction}
                onChange={(e) => setAuditFilter((p) => ({ ...p, eventAction: e.target.value }))}
                className="px-3 py-2 rounded-xl border border-border text-sm"
                placeholder="action"
              />
              <input
                value={auditFilter.targetType}
                onChange={(e) => setAuditFilter((p) => ({ ...p, targetType: e.target.value }))}
                className="px-3 py-2 rounded-xl border border-border text-sm"
                placeholder="target type"
              />
              <input
                value={auditFilter.targetId}
                onChange={(e) => setAuditFilter((p) => ({ ...p, targetId: e.target.value }))}
                className="px-3 py-2 rounded-xl border border-border text-sm"
                placeholder="target id"
              />
              <input
                type="number"
                value={auditFilter.limit}
                onChange={(e) => setAuditFilter((p) => ({ ...p, limit: Number(e.target.value || 100) }))}
                className="px-3 py-2 rounded-xl border border-border text-sm"
                placeholder="limit"
              />
            </div>
            <button onClick={() => void loadAudit()} className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium mb-3">
              Apply filters
            </button>
            <div className="max-h-[26rem] overflow-auto space-y-2">
              {audits.map((a) => (
                <div key={a.id} className="border border-border rounded-xl p-2 text-xs">
                  <div className="font-semibold text-royal">{a.action}</div>
                  <div className="text-muted-foreground">{a.target_type} / {a.target_id}</div>
                  <div className="text-muted-foreground break-all">actor: {a.actor_user_id ?? "n/a"}</div>
                  <div className="text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
