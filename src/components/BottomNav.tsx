import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Home, label: "Главная", path: "/home" },
  { icon: Sparkles, label: "Создать", path: "/rail-b" },
  { icon: BookOpen, label: "Библиотека", path: "/library" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2 w-full max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-royal/8 rounded-xl"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}
              <item.icon size={24} className={isActive ? "text-royal" : "text-muted-foreground"} />
              <span className={`text-xs font-body ${isActive ? "text-royal font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
