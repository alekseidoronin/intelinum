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
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <Logo size="sm" showText={false} />
      </div>

      {/* User card */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(225 50% 18%), hsl(220 55% 24%))" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl border border-primary/30">
              🔮
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-foreground">Анастасия</h2>
              <p className="text-sm text-muted-foreground">anastasia@mail.ru</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/20">
                <Crown size={12} className="text-gold" />
                <span className="text-xs text-gold font-medium">Бесплатный</span>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="mt-4 pt-4 border-t border-border/20 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Контент-пакеты в этом месяце</span>
              <span className="text-xs text-gold">2 / 3</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-gradient-gold" style={{ width: "67%" }} />
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-gold text-background text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-gold"
            >
              <Crown size={14} />
              Улучшить план
            </button>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(item.path)}
            className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left hover:border-border transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
              <item.icon size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}

        <button className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left hover:border-destructive/30 transition-all mt-2 active:scale-[0.98]">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut size={16} className="text-destructive/70" />
          </div>
          <span className="text-sm font-medium text-destructive/70">Выйти из аккаунта</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
