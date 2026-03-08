import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SideMenuButton } from "@/components/SideMenu";

interface TopBarProps {
  showBack?: boolean;
}

export function TopBar({ showBack = false }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="shrink-0 z-30 bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-sapphire shadow-card active:scale-90 transition-transform">
            <ChevronLeft size={18} />
          </button>
        )}
        <Logo size="sm" vertical={false} />
      </div>
      <SideMenuButton />
    </div>
  );
}

