import { Logo } from "@/components/Logo";
import { SideMenuButton } from "@/components/SideMenu";

export function TopBar() {
  return (
    <div className="shrink-0 sticky top-0 z-50 w-full bg-white border-b border-border shadow-card">
      <div className="flex items-center justify-between px-4 py-2 max-w-2xl mx-auto">
        <Logo size="sm" vertical={false} />
        <SideMenuButton />
      </div>
    </div>
  );
}


