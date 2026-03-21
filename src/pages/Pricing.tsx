import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Crown, Zap, Building2, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PlanTier = "free" | "start" | "pro" | "business";
type SourceLabel = "db" | "fallback";

interface PlanCard {
  id: PlanTier;
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  current: boolean;
  features: string[];
  limits: string[];
}

interface UsageMetric {
  metric: string;
  label: string;
  usedCount: number;
  limitCount: number | null;
}

interface PricingDashboardResponse {
  plans?: PlanCard[];
  subscription?: {
    tier?: PlanTier;
    status?: string;
    periodEnd?: string | null;
  };
  usage?: UsageMetric[];
  source?: {
    plans?: SourceLabel;
    subscription?: SourceLabel;
    usage?: SourceLabel;
  };
}

const fallbackPlans: PlanCard[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "",
    current: true,
    highlight: false,
    features: ["Контент дня каждое утро", "3 контент-пакета в месяц", "5 тем из трендов в день", "3 стиля картинок", "1 стилевой профиль"],
    limits: ["Без расшифровки записей", "Без PDF-гайдов"],
  },
  {
    id: "start",
    name: "Старт",
    price: "790 ₽",
    period: "/ месяц",
    current: false,
    highlight: false,
    features: ["Контент дня каждое утро", "30 контент-пакетов в месяц", "5 расшифровок (до 2ч)", "5 PDF-гайдов в месяц", "Все темы из трендов", "Все стили картинок"],
    limits: [],
  },
  {
    id: "pro",
    name: "Про",
    price: "1 990 ₽",
    period: "/ месяц",
    current: false,
    highlight: true,
    features: ["Всё из Старт", "Безлимитные контент-пакеты", "Безлимитные расшифровки", "Безлимитные PDF-гайды", "2 стилевых профиля", "Приоритетная поддержка"],
    limits: [],
  },
  {
    id: "business",
    name: "Бизнес",
    price: "4 990 ₽",
    period: "/ месяц",
    current: false,
    highlight: false,
    features: ["Всё из Про", "5 стилевых профилей", "Премиум стили картинок", "Свои ключи для трендов"],
    limits: [],
  },
];

const fallbackUsage: UsageMetric[] = [
  { metric: "content_packs", label: "Контент-пакеты", usedCount: 2, limitCount: 3 },
];

const planIcons = {
  free: Zap,
  start: Crown,
  pro: Crown,
  business: Building2,
};

const tierLabels: Record<PlanTier, string> = {
  free: "Бесплатный",
  start: "Старт",
  pro: "Про",
  business: "Бизнес",
};

const formatDate = (isoDate: string | null | undefined) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [plans, setPlans] = useState<PlanCard[]>(fallbackPlans);
  const [usage, setUsage] = useState<UsageMetric[]>(fallbackUsage);
  const [subscription, setSubscription] = useState({
    tier: "free" as PlanTier,
    status: "active",
    periodEnd: null as string | null,
  });
  const [source, setSource] = useState({
    plans: "fallback" as SourceLabel,
    subscription: "fallback" as SourceLabel,
    usage: "fallback" as SourceLabel,
  });
  const [loading, setLoading] = useState(true);

  const usageWithProgress = useMemo(
    () =>
      usage.map((item) => ({
        ...item,
        progress:
          !item.limitCount || item.limitCount <= 0
            ? 100
            : Math.min(100, Math.round((item.usedCount / item.limitCount) * 100)),
      })),
    [usage],
  );

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("pricing-dashboard", {
          body: { action: "get_pricing_dashboard" },
        });
        if (error) throw new Error(error.message);

        const payload = (data ?? {}) as PricingDashboardResponse;
        if (payload.plans && payload.plans.length > 0) {
          setPlans(payload.plans);
        } else {
          setPlans(fallbackPlans);
        }

        if (payload.usage && payload.usage.length > 0) {
          setUsage(payload.usage);
        } else {
          setUsage(fallbackUsage);
        }

        setSubscription((prev) => ({
          tier: payload.subscription?.tier ?? prev.tier,
          status: payload.subscription?.status ?? prev.status,
          periodEnd: payload.subscription?.periodEnd ?? prev.periodEnd,
        }));

        setSource({
          plans: payload.source?.plans ?? "fallback",
          subscription: payload.source?.subscription ?? "fallback",
          usage: payload.source?.usage ?? "fallback",
        });
      } catch {
        setPlans(fallbackPlans);
        setUsage(fallbackUsage);
      } finally {
        setLoading(false);
      }
    };

    void loadPricing();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      <div className="px-5 pt-3 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl text-royal">Тарифы</h1>
          <p className="text-xs text-muted-foreground">Выберите подходящий план</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Источник: планы {source.plans}, подписка {source.subscription}, usage {source.usage}
          </p>
        </div>
      </div>

      <div className="px-5">
        <div className="mb-4 rounded-2xl bg-white border border-border shadow-card p-4">
          <p className="text-sm font-medium text-royal">Текущая подписка</p>
          <p className="text-xs text-muted-foreground mt-1">
            План: {tierLabels[subscription.tier]} · Статус: {subscription.status}
          </p>
          <p className="text-xs text-muted-foreground">Оплачено до: {formatDate(subscription.periodEnd)}</p>
        </div>

        <div className="mb-5 rounded-2xl bg-white border border-border shadow-card p-4">
          <p className="text-sm font-medium text-royal mb-2">Лимиты в текущем периоде</p>
          <div className="space-y-3">
            {usageWithProgress.map((metric) => (
              <div key={metric.metric}>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{metric.label}</span>
                  <span>
                    {metric.usedCount} / {metric.limitCount ?? "∞"}
                  </span>
                </div>
                <div className="w-full bg-shell rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-sapphire" style={{ width: `${metric.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5 text-center">Годовая подписка — скидка 20%</p>

        {loading && (
          <div className="rounded-2xl bg-white border border-border shadow-card p-4 flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 size={16} className="animate-spin" />
            Загрузка тарифов...
          </div>
        )}

        <div className="space-y-3">
          {!loading &&
            plans.map((plan, i) => {
              const Icon = planIcons[plan.id];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-3xl overflow-hidden ${plan.highlight ? "shadow-gold" : "shadow-card"}`}
                  style={{
                    background: plan.highlight
                      ? "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))"
                      : "white",
                    border: plan.highlight
                      ? "1px solid hsl(var(--border-gold))"
                      : "1px solid hsl(var(--border))",
                  }}
                >
                  {plan.highlight && (
                    <div className="bg-gradient-gold text-royal text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                      Самый популярный
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-white/15" : "bg-sapphire/10"}`}
                        >
                          <Icon size={16} className={plan.highlight ? "text-gold" : "text-sapphire"} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${plan.highlight ? "text-swan" : "text-royal"}`}>
                            {plan.name}
                          </p>
                          {plan.current && <p className="text-xs text-sapphire">Текущий план</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-display text-2xl ${plan.highlight ? "text-swan" : "text-royal"}`}>
                          {plan.price}
                        </span>
                        <span className={`text-xs ml-1 ${plan.highlight ? "text-swan/60" : "text-muted-foreground"}`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <Check
                            size={13}
                            className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-gold" : "text-sapphire"}`}
                          />
                          <span className={`text-xs ${plan.highlight ? "text-swan/85" : "text-foreground"}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.limits.map((limit) => (
                        <div key={limit} className="flex items-start gap-2 opacity-40">
                          <div className="w-3 h-px bg-current mt-2 flex-shrink-0" />
                          <span className={`text-xs ${plan.highlight ? "text-swan" : "text-muted-foreground"}`}>
                            {limit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {!plan.current && (
                      <button
                        onClick={() =>
                          toast({
                            description: `Переход к оплате плана: ${plan.name}`,
                          })
                        }
                        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                          plan.highlight
                            ? "bg-white/15 text-swan border border-white/25 hover:bg-white/25"
                            : "bg-royal text-swan hover:bg-sapphire"
                        }`}
                      >
                        {plan.highlight ? "Выбрать Про" : `Выбрать ${plan.name}`}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
