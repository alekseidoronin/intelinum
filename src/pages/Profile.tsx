import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Crown, Palette, FileText, Bell, LogOut, Shield, HelpCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";

const menuItems = [
  { icon: FileText, label: "Мой стиль письма", desc: "Обновить тексты-примеры", path: "/profile/style" },
  { icon: Palette, label: "Стиль картинок", desc: "Изменить визуальный стиль", path: "/profile/visual" },
  { icon: Bell, label: "Уведомления", desc: "Настройки напоминаний", path: "/profile/notifications" },
  { icon: Shield, label: "Безопасность", desc: "Пароль и данные", path: "/profile/security" },
  { icon: HelpCircle, label: "Поддержка", desc: "Написать нам", path: "/profile/support" },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-5">
        <Logo size="sm" showText={false} />
      </div>

      {/* User card — Royal Blue background */}
      <div className="px-5 mb-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl border border-white/20">
              🔮
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-swan">Анастасия</h2>
              <p className="text-sm text-swan/60">anastasia@mail.ru</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 border border-white/20">
              <Crown size={12} className="text-gold" />
              <span className="text-xs text-gold font-medium">Бесплатный</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-swan/60">Контент-пакеты в этом месяце</span>
              <span className="text-xs text-gold font-medium">2 / 3</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-gradient-gold" style={{ width: "67%" }} />
            </div>
            <button onClick={() => navigate("/pricing")}
              className="mt-3 w-full py-2.5 rounded-xl bg-white/15 border border-white/20 text-swan text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/25">
              <Crown size={14} className="text-gold" />
              Улучшить план
            </button>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => navigate(item.path)}
            className="w-full bg-white border border-border rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left shadow-card hover:border-sapphire/40 transition-all active:scale-[0.98]">
            <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center border border-border">
              <item.icon size={16} className="text-sapphire" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-royal">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}

        <button className="w-full bg-white border border-border rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left shadow-card hover:border-destructive/30 transition-all active:scale-[0.98]">
          <div className="w-9 h-9 rounded-xl bg-destructive/5 flex items-center justify-center border border-destructive/10">
            <LogOut size={16} className="text-destructive/70" />
          </div>
          <span className="text-sm font-medium text-destructive/70">Выйти из аккаунта</span>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
