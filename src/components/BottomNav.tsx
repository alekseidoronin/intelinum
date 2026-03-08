import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, BookOpen, User } from "lucide-react";

const items = [
{ icon: Home, label: "Главная", path: "/home" },
{ icon: Sparkles, label: "Создать", path: "/rail-b" },
{ icon: BookOpen, label: "Библиотека", path: "/library" },
{ icon: User, label: "Профиль", path: "/profile" }];


export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      
      <div className="flex items-stretch justify-around w-full max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return;


















        })}
      </div>
    </nav>);

}