import { useNavigate } from "react-router-dom";
import { ChevronRight, Crown, Palette, FileText, Bell, LogOut, Shield, HelpCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";

const menuItems = [
  { icon: FileText, label: "Мой стиль письма", desc: "Обновить тексты-примеры", path: "/profile/style" },
  { icon: Palette, label: "Стиль визуала", desc: "Изменить визуальный стиль картинок", path: "/profile/visual" },
  { icon: Bell, label: "Уведомления", desc: "Настройки напоминаний", path: "/profile/notifications" },
  { icon: Shield, label: "Безопасность", desc: "Пароль и данные", path: "/profile/security" },
  { icon: HelpCircle, label: "Поддержка", desc: "Написать нам", path: "/profile/support" },
];

export default function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Пользователь";

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      {/* User card */}
      <div className="px-5 pt-3 mb-5">
        <div
          className="rounded-3xl p-5"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}>

          {/* Avatar + name row */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl border border-white/20 flex-shrink-0">
              🔮
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl text-swan truncate">{userName}</h2>
              <div className="flex items-center gap-1.5 mt-0.5 w-fit px-2.5 py-1 rounded-lg bg-white/15 border border-white/20">
                <Crown size={12} className="text-gold flex-shrink-0" />
                <span className="text-xs text-gold font-medium whitespace-nowrap">Бесплатный</span>
              </div>
            </div>
          </div>

          {/* Usage bar */}
          <div className="mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-swan/60">Контент-пакеты в этом месяце</span>
              <span className="text-sm text-gold font-medium">2 / 3</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-gold" style={{ width: "67%" }} />
            </div>
            <button onClick={() => navigate("/pricing")}
              className="mt-3 w-full py-3 rounded-xl bg-white/15 border border-white/20 text-swan text-base font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/25">
              <Crown size={16} className="text-gold" />
              Улучшить план
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-2">
        {menuItems.map((item) => (
          <button key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left shadow-card hover:border-sapphire/40 transition-all active:scale-[0.98]">
            <div className="w-11 h-11 rounded-xl bg-background flex items-center justify-center border border-border flex-shrink-0">
              <item.icon size={22} className="text-sapphire" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-royal leading-snug">{item.label}</p>
              <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
          </button>
        ))}

        <button className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left shadow-card hover:border-destructive/30 transition-all active:scale-[0.98]">
          <div className="w-11 h-11 rounded-xl bg-destructive/5 flex items-center justify-center border border-destructive/10 flex-shrink-0">
            <LogOut size={20} className="text-destructive/70" />
          </div>
          <span className="text-base font-medium text-destructive/70">Выйти из аккаунта</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
