import { GraduationCap } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";

export default function Education() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar showBack />
      <div className="flex flex-col items-center justify-center mt-20 gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-royal/10 flex items-center justify-center">
          <GraduationCap size={32} className="text-royal" />
        </div>
        <p className="text-muted-foreground text-sm">Раздел обучения скоро появится</p>
      </div>
      <BottomNav />
    </div>
  );
}
