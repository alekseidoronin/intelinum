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

#нумерология #числодня #энергиядня #нумерологияonline`;

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
      <div className="px-5 pt-12 pb-6 relative">
        <div className="flex items-center justify-between mb-1">
          <Logo size="sm" />
          <button className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Контент дня widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden gold-border"
          style={{ background: "linear-gradient(145deg, hsl(226 44% 11%), hsl(225 50% 17%))" }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Zap size={15} className="text-gold" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Контент дня</div>
                <div className="text-sm font-medium text-foreground">Число {num} — {today.toLocaleDateString("ru", { day: "numeric", month: "long" })}</div>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-gold transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Post text */}
          <div className="px-5 py-4">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line line-clamp-6">
              {todayPost}
            </p>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${
                copied ? "bg-primary/20 text-gold" : "bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              <Copy size={14} />
              {copied ? "Скопировано!" : "Копировать"}
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-muted/50 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-all active:scale-95">
              <Edit3 size={14} />
              Редактировать
            </button>
            <button className="py-2.5 px-3 rounded-xl bg-primary/15 text-gold text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary/25 transition-all active:scale-95">
              <LayoutGrid size={14} />
            </button>
          </div>
        </motion.div>

        {/* Two rails */}
        <div className="space-y-3">
          <h2 className="font-display text-xl text-foreground/80 tracking-wide">Создать контент</h2>
          
          {/* Rail A */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => navigate("/rail-a")}
            className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] hover:shadow-gold"
            style={{ background: "linear-gradient(135deg, hsl(225 50% 18%), hsl(220 55% 24%))" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Mic size={22} className="text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-base mb-1">У меня есть запись</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    Загрузите аудио или видео — получите готовый пакет постов
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gold/80">
                    <span>mp3, wav, mp4, mov</span>
                    <span>·</span>
                    <span>до 500 МБ</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
            </div>
          </motion.button>

          {/* Rail B */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate("/rail-b")}
            className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] hover:shadow-gold"
            style={{ background: "linear-gradient(135deg, hsl(226 45% 16%), hsl(225 42% 21%))" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={22} className="text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-base mb-1">Хочу найти тему</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    Актуальные темы из трендов — один тап и контент готов
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gold/80">
                    <span>Обновляется каждый день</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
            </div>
          </motion.button>
        </div>

        {/* Limit bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl px-4 py-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Пакеты в этом месяце</span>
            <span className="text-xs text-gold font-medium">2 / 3</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-gold" style={{ width: "67%" }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Бесплатный план · <button onClick={() => navigate("/pricing")} className="text-gold">Расширить</button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
