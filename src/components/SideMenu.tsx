import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, GraduationCap, BookOpen, Sparkles, LayoutGrid, Newspaper, Menu, Shield } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const menuItems = [
  { icon: User,          label: "Профиль",          path: "/profile" },
  { icon: GraduationCap, label: "Обучение",          path: "/education" },
  { icon: BookOpen,      label: "Библиотека",        path: "/library" },
  { icon: Sparkles,      label: "Создать",           path: "/rail-b" },
  { icon: LayoutGrid,    label: "Готовые решения",   path: "/solutions" },
  { icon: Newspaper,     label: "Новости",            path: "/news" },
  { icon: Shield,        label: "Админ-панель",       path: "/admin" },
];

export function SideMenuButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-sapphire hover:border-sapphire transition-colors shadow-card active:scale-90">
        <Menu size={17} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-royal/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border">
                <Logo size="sm" vertical={false} />
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-royal hover:border-sapphire transition-colors active:scale-90">
                  <X size={17} />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98] ${
                        isActive
                          ? "bg-royal text-swan"
                          : "text-foreground hover:bg-muted"
                      }`}>
                      <item.icon size={18} className={isActive ? "text-gold" : "text-sapphire"} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-5 py-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">Нумеролог AI · v1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
