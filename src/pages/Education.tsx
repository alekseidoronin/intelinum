import { useNavigate } from "react-router-dom";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";

export default function Education() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />
      <div className="px-5 pt-3 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display text-xl text-royal">Обучение</h1>
      </div>
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
