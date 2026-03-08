import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check, ArrowLeft, Sparkles } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default function WritingStyle() {
  const navigate = useNavigate();
  const [texts, setTexts] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSave = () => {
    if (texts.trim().length < 10) return;
    setLoading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setSaved(true);
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      <div className="px-5 pt-4">
        <button onClick={() => navigate("/profile")}
          className="flex items-center gap-1.5 text-sm text-sapphire mb-5 active:opacity-60 transition-opacity">
          <ArrowLeft size={16} />
          Назад
        </button>

        <h1 className="font-display text-2xl text-royal mb-1">Мой стиль письма</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Вставьте 3–5 своих постов или текстов — ИИ изучит ваш стиль и будет писать так же, как вы
        </p>

        {!loading && !saved && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <textarea
              value={texts}
              onChange={e => setTexts(e.target.value)}
              placeholder="Вставьте сюда 3–5 ваших постов, статей или текстов. Наш помощник изучит ваш стиль и будет писать именно так, как пишете вы..."
              rows={10}
              className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all resize-none leading-relaxed shadow-card"
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 rounded-xl border border-border text-sapphire flex items-center justify-center gap-2 text-sm active:scale-95 transition-all bg-white hover:border-sapphire shadow-card">
                <Upload size={15} />
                Загрузить файл
              </button>
              <button
                onClick={handleSave}
                disabled={texts.trim().length < 10}
                className="flex-1 py-3 rounded-xl bg-royal text-swan font-semibold shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire">
                Сохранить
              </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-shell" />
              <div className="absolute inset-0 rounded-full border-2 border-sapphire border-t-transparent animate-spin" style={{ animationDuration: "1.5s" }} />
              <Sparkles className="absolute inset-0 m-auto text-sapphire animate-pulse" size={28} />
            </div>
            <p className="font-display text-xl text-royal mb-2">Изучаем ваш стиль...</p>
            <p className="text-sm text-muted-foreground mb-5">Анализируем ваши тексты</p>
            <div className="w-full bg-shell rounded-full h-2 mb-2">
              <motion.div className="h-2 rounded-full bg-sapphire" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </motion.div>
        )}

        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-sapphire/10 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-sapphire" />
            </div>
            <p className="font-display text-xl text-royal mb-2">Стиль сохранён!</p>
            <p className="text-sm text-muted-foreground mb-6">ИИ теперь будет писать в вашем стиле</p>
            <button onClick={() => { setSaved(false); setTexts(""); setProgress(0); }}
              className="px-6 py-2.5 rounded-xl border border-border text-sapphire text-sm bg-white shadow-card active:scale-95 transition-all">
              Обновить тексты
            </button>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
