import { Logo } from "@/components/Logo";
import { SideMenuButton } from "@/components/SideMenu";

export function TopBar() {
  return (
    <div
      className="shrink-0 sticky top-0 z-50 w-full bg-white border-b border-border shadow-card md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between px-5 py-3 w-full">
        <Logo size="sm" vertical={false} />
        <SideMenuButton />
      </div>
    </div>
  );
}
