import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, LayoutGrid, Mic, TrendingUp, RefreshCw, ChevronRight, Bell, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";

const todayPost = `Число 9 сегодня — это число завершений и мудрости. 

Если что-то в вашей жизни никак не заканчивается — отношения, проект, привычка — сегодня энергия помогает отпустить. Не бороться, а отпустить.

Спросите себя: что я ношу с собой из прошлого, что уже давно пора оставить?

Девятка учит нас, что пространство для нового появляется только тогда, когда мы освобождаем место.

#нумерология #числодня #энергиядня`;

export default function Home() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(todayPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date();
  const dayNum = today.getDate() + today.getMonth() + 1;
  const num = ((dayNum - 1) % 9) + 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <button className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire hover:border-sapphire transition-colors shadow-card">
            <Bell size={17} />
          </button>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Контент дня widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Zap size={15} className="text-gold" />
              </div>
              <div>
                <div className="text-xs text-white/60">Контент дня</div>
                <div className="text-sm font-medium text-white">Число {num} — {today.toLocaleDateString("ru", { day: "numeric", month: "long" })}</div>
              </div>
            </div>
            <button className="text-white/50 hover:text-white/90 transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Post text */}
          <div className="px-5 py-4">
            <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line line-clamp-6">
              {todayPost}
            </p>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${
                copied ? "bg-gold/30 text-gold" : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <Copy size={14} />
              {copied ? "Скопировано!" : "Копировать"}
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-white/15 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/25 transition-all active:scale-95">
              <Edit3 size={14} />
              Редактировать
            </button>
            <button className="py-2.5 px-3 rounded-xl bg-white/15 text-white text-sm flex items-center justify-center hover:bg-white/25 transition-all active:scale-95">
              <LayoutGrid size={14} />
            </button>
          </div>
        </motion.div>

        {/* Section label */}
        <h2 className="font-display text-xl text-royal pt-1">Создать контент</h2>

        {/* Rail A */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => navigate("/rail-a")}
          className="w-full bg-white rounded-2xl p-5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-royal/10 flex items-center justify-center flex-shrink-0">
                <Mic size={22} className="text-royal" />
              </div>
              <div>
                <div className="font-semibold text-royal text-base mb-1">У меня есть запись</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Загрузите аудио или видео — получите готовый пакет постов
                </div>
                <div className="mt-2 text-xs text-sapphire/70">mp3, wav, mp4, mov · до 500 МБ</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-sapphire flex-shrink-0" />
          </div>
        </motion.button>

        {/* Rail B */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => navigate("/rail-b")}
          className="w-full bg-white rounded-2xl p-5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={22} className="text-sapphire" />
              </div>
              <div>
                <div className="font-semibold text-royal text-base mb-1">Хочу найти тему</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Актуальные темы из трендов — один тап и контент готов
                </div>
                <div className="mt-2 text-xs text-sapphire/70">Обновляется каждый день</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-sapphire flex-shrink-0" />
          </div>
        </motion.button>

        {/* Limit bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl px-4 py-3 border border-border shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Пакеты в этом месяце</span>
            <span className="text-xs text-sapphire font-medium">2 / 3</span>
          </div>
          <div className="w-full bg-shell rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-sapphire" style={{ width: "67%" }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Бесплатный план · <button onClick={() => navigate("/pricing")} className="text-sapphire font-medium">Расширить</button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
