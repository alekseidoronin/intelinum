import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Crown, Zap, Building2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";

const plans = [
  {
    id: "free", name: "Бесплатный", price: "0 ₽", period: "", icon: Zap, current: true,
    features: ["Контент дня каждое утро", "3 контент-пакета в месяц", "5 тем из трендов в день", "3 стиля картинок", "1 стилевой профиль"],
    limits: ["Без расшифровки записей", "Без PDF-гайдов"],
  },
  {
    id: "start", name: "Старт", price: "790 ₽", period: "/ месяц", icon: Crown, current: false, highlight: false,
    features: ["Контент дня каждое утро", "30 контент-пакетов в месяц", "5 расшифровок (до 2ч)", "5 PDF-гайдов в месяц", "Все темы из трендов", "Все стили картинок"],
    limits: [],
  },
  {
    id: "pro", name: "Про", price: "1 990 ₽", period: "/ месяц", icon: Crown, current: false, highlight: true,
    features: ["Всё из Старт", "Безлимитные контент-пакеты", "Безлимитные расшифровки", "Безлимитные PDF-гайды", "2 стилевых профиля", "Приоритетная поддержка"],
    limits: [],
  },
  {
    id: "business", name: "Бизнес", price: "4 990 ₽", period: "/ месяц", icon: Building2, current: false, highlight: false,
    features: ["Всё из Про", "5 стилевых профилей", "Премиум стили картинок", "Свои ключи для трендов"],
    limits: [],
  },
];

export default function Pricing() {
  const navigate = useNavigate();

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

        <div className="space-y-3">
          {plans.map((plan, i) => (
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
                      <plan.icon size={16} className={plan.highlight ? "text-gold" : "text-sapphire"} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${plan.highlight ? "text-swan" : "text-royal"}`}>{plan.name}</p>
                      {plan.current && <p className="text-xs text-sapphire">Текущий план</p>}
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

                {!plan.current && (
                  <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    plan.highlight
                      ? "bg-white/15 text-swan border border-white/25 hover:bg-white/25"
                      : "bg-royal text-swan hover:bg-sapphire"
                  }`}>
                    {plan.highlight ? "Выбрать Про" : `Выбрать ${plan.name}`}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
