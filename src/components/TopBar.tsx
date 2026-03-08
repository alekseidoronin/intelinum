import { Logo } from "@/components/Logo";
import { SideMenuButton } from "@/components/SideMenu";

export function TopBar() {
  return (
    <div
      className="shrink-0 sticky top-0 z-50 w-full bg-white border-b border-border shadow-card"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between px-4 py-2 w-full max-w-lg mx-auto sm:max-w-lg">
        <Logo size="sm" vertical={false} />
        <SideMenuButton />
      </div>
    </div>
  );
}
