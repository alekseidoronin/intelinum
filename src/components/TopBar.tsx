import { Logo } from "@/components/Logo";
import { SideMenuButton } from "@/components/SideMenu";

export function TopBar() {
  return (
    <div className="shrink-0 z-30 bg-background px-4 py-3 flex items-center justify-between">
      <Logo size="sm" vertical={false} />
      <SideMenuButton />
    </div>
  );
}


