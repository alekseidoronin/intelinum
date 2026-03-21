import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Crown, Zap, Building2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { usePricingUsage } from "@/hooks/usePricingUsage";
import { fallbackPricingUsageSnapshot, type PlanId } from "@/lib/pricing-usage";

const planIcons: Record<PlanId, typeof Zap> = {
  free: Zap,
  start: Crown,
  pro: Crown,
  business: Building2,
};

const renderMetric = (used: number, limit: number | null) => (limit === null ? `${used} / ∞` : `${used} / ${limit}`);

export default function Pricing() {
  const navigate = useNavigate();
  const { data } = usePricingUsage();
  const snapshot = data ?? fallbackPricingUsageSnapshot;
  const plans = snapshot.plans;
  const currentPlanId = snapshot.currentPlanId;
  const sourceLabel = snapshot.source === "backend" ? "backend" : "fallback";

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />
      <div className="px-5 pt-3 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl text-royal">Тарифы</h1>
          <p className="text-xs text-muted-foreground">Выберите подходящий план</p>
        </div>
      </div>

      <div className="px-5">
        <p className="text-sm text-muted-foreground mb-5 text-center">Годовая подписка — скидка 20%</p>

        <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Текущий план</p>
            <p className="text-sm font-medium text-sapphire">{snapshot.currentPlanName}</p>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-background border border-border px-2 py-2">
              <p className="text-muted-foreground">Пакеты</p>
              <p className="mt-0.5 text-royal font-semibold">{renderMetric(snapshot.usage.contentPacks.used, snapshot.usage.contentPacks.limit)}</p>
            </div>
            <div className="rounded-xl bg-background border border-border px-2 py-2">
              <p className="text-muted-foreground">Расшифровки</p>
              <p className="mt-0.5 text-royal font-semibold">{renderMetric(snapshot.usage.transcripts.used, snapshot.usage.transcripts.limit)}</p>
            </div>
            <div className="rounded-xl bg-background border border-border px-2 py-2">
              <p className="text-muted-foreground">PDF-гайды</p>
              <p className="mt-0.5 text-royal font-semibold">{renderMetric(snapshot.usage.pdfGuides.used, snapshot.usage.pdfGuides.limit)}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Период: {snapshot.usage.periodLabel} · источник: {sourceLabel}
          </p>
        </div>

        <div className="space-y-3">
          {plans.map((plan, i) => {
            const Icon = planIcons[plan.id];
            const isCurrent = plan.id === currentPlanId;
            return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-3xl overflow-hidden ${plan.highlight ? "shadow-gold" : "shadow-card"}`}
              style={{ background: plan.highlight ? "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" : "white",
                border: plan.highlight ? "1px solid hsl(var(--border-gold))" : "1px solid hsl(var(--border))" }}>
              {plan.highlight && (
                <div className="bg-gradient-gold text-royal text-xs font-bold text-center py-1.5 tracking-widest uppercase">
                  Самый популярный
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-white/15" : "bg-sapphire/10"}`}>
                      <Icon size={16} className={plan.highlight ? "text-gold" : "text-sapphire"} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${plan.highlight ? "text-swan" : "text-royal"}`}>{plan.name}</p>
                      {isCurrent && <p className="text-xs text-sapphire">Текущий план</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-display text-2xl ${plan.highlight ? "text-swan" : "text-royal"}`}>{plan.price}</span>
                    <span className={`text-xs ml-1 ${plan.highlight ? "text-swan/60" : "text-muted-foreground"}`}>{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2">
                      <Check size={13} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-gold" : "text-sapphire"}`} />
                      <span className={`text-xs ${plan.highlight ? "text-swan/85" : "text-foreground"}`}>{f}</span>
                    </div>
                  ))}
                  {plan.limits.map(f => (
                    <div key={f} className="flex items-start gap-2 opacity-40">
                      <div className="w-3 h-px bg-current mt-2 flex-shrink-0" />
                      <span className={`text-xs ${plan.highlight ? "text-swan" : "text-muted-foreground"}`}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlight
                      ? "bg-white/15 text-swan border border-white/25 hover:bg-white/25"
                      : "bg-royal text-swan hover:bg-sapphire"
                  }`}
                >
                    {isCurrent ? "Текущий план" : plan.highlight ? "Выбрать Про" : `Выбрать ${plan.name}`}
                  </button>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
