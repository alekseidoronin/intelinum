import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, GraduationCap, BookOpen, Sparkles, LayoutGrid, Newspaper, Crown } from "lucide-react";
import { Logo } from "@/components/Logo";

const navItems = [
  { icon: Home,          label: "Главная",          path: "/home" },
  { icon: Sparkles,      label: "Создать",           path: "/rail-b" },
  { icon: BookOpen,      label: "Библиотека",        path: "/library" },
  { icon: GraduationCap, label: "Обучение",          path: "/education" },
  { icon: LayoutGrid,    label: "Готовые решения",   path: "/solutions" },
  { icon: Newspaper,     label: "Новости",            path: "/news" },
  { icon: User,          label: "Профиль",           path: "/profile" },
];

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-white border-r border-border z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Logo size="sm" vertical={false} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all active:scale-[0.98] ${
                isActive
                  ? "bg-royal text-swan"
                  : "text-foreground hover:bg-muted"
              }`}>
              <item.icon
                size={18}
                className={isActive ? "text-gold" : "text-sapphire"}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="px-3 pb-5">
        <button
          onClick={() => navigate("/pricing")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-royal to-sapphire text-swan transition-all hover:opacity-90 active:scale-[0.98]">
          <Crown size={16} className="text-gold flex-shrink-0" />
          <span className="font-semibold text-sm">Улучшить план</span>
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">Нумеролог AI · v1.0</p>
      </div>
    </aside>
  );
}
