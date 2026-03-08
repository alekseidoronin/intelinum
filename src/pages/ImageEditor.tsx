import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Download, RefreshCw, Check } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";

const sizes = [
  { id: "square", label: "1:1", desc: "Instagram пост", w: 1, h: 1 },
  { id: "portrait", label: "4:5", desc: "Instagram вертик.", w: 4, h: 5 },
  { id: "story", label: "9:16", desc: "Stories / Reels", w: 9, h: 16 },
  { id: "landscape", label: "16:9", desc: "YouTube / VK", w: 16, h: 9 },
];

export default function ImageEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("square");
  const [regenerating, setRegenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const size = sizes.find(s => s.id === selectedSize)!;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    toast({ description: "Картинка сохранена 📥" });
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      toast({ description: "Картинка обновлена ✨" });
    }, 1400);
  };

  // Compute preview aspect ratio
  const ratio = size.w / size.h;
  const previewW = Math.min(ratio >= 1 ? 280 : 280 * ratio, 280);
  const previewH = ratio >= 1 ? previewW / ratio : 280;

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar />
      <div className="px-5 pt-3 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card">
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display text-xl text-royal">Картинка</h1>
      </div>

      {/* Size selector */}
      <div className="px-5 mb-5">
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Размер</p>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSize(s.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-center transition-all active:scale-95 ${
                selectedSize === s.id
                  ? "border-royal bg-royal text-swan"
                  : "border-border bg-white text-royal shadow-card"
              }`}
            >
              {/* Mini ratio visual */}
              <div className="flex items-center justify-center w-8 h-8">
                <div
                  className={`rounded border-2 ${selectedSize === s.id ? "border-swan/60" : "border-sapphire/40"}`}
                  style={{
                    width: s.w >= s.h ? 24 : Math.round(24 * s.w / s.h),
                    height: s.h >= s.w ? 24 : Math.round(24 * s.h / s.w),
                  }}
                />
              </div>
              <span className="text-xs font-bold leading-none">{s.label}</span>
              <span className={`text-[10px] leading-tight ${selectedSize === s.id ? "text-swan/70" : "text-muted-foreground"}`}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image preview */}
      <div className="flex justify-center px-5 mb-5">
        <motion.div
          key={selectedSize}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{ width: previewW, height: previewH }}
          className="rounded-2xl bg-gradient-to-br from-sapphire/20 to-royal/30 border border-border shadow-card flex items-center justify-center overflow-hidden relative"
        >
          {regenerating ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw size={28} className="text-sapphire animate-spin" />
              <p className="text-xs text-sapphire">Генерация…</p>
            </div>
          ) : (
            <div className="text-center px-4">
              <p className="text-royal font-display text-lg font-bold leading-snug">Число 7</p>
              <p className="text-sapphire text-sm mt-1">духовный поиск</p>
              <p className="text-muted-foreground text-xs mt-3 leading-relaxed">
                #нумерология #число7 #матрицасудьбы
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Actions */}
      <div className="px-5 space-y-2">
        <button
          onClick={handleDownload}
          className={`w-full py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-card ${
            downloaded ? "bg-sapphire/10 text-sapphire border border-sapphire/30" : "bg-royal text-swan"
          }`}
        >
          {downloaded ? <Check size={16} /> : <Download size={16} />}
          {downloaded ? "Сохранено!" : `Скачать ${size.label}`}
        </button>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="w-full py-3.5 rounded-2xl bg-white border border-border text-sapphire text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-card"
        >
          <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Генерируется…" : "Перегенерировать"}
        </button>
      </div>
    </div>
  );
}
