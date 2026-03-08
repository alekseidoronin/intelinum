import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, User } from "lucide-react";

const items = [
  { icon: Home, label: "Главная", path: "/home" },
  { icon: BookOpen, label: "Библиотека", path: "/library" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-card md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around w-full max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1.5 flex-1 py-3 px-1 transition-all"
            >
              <item.icon
                size={26}
                className={isActive ? "text-gold-dark" : "text-muted-foreground"}
              />
              <span
                className={`text-[11px] leading-none font-medium font-body whitespace-nowrap ${
                  isActive ? "text-gold-dark" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
