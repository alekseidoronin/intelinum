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
  const num = (dayNum - 1) % 9 + 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header — прижат к safe area сверху */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <Logo size="sm" vertical={false} />
          <button className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-sapphire hover:border-sapphire transition-colors shadow-card">
            <Bell size={17} />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {/* Контент дня widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}>
          
          {/* Widget Header */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Zap size={13} className="text-gold" />
              </div>
              <div>
                <div className="text-[10px] text-white/60 leading-tight">Контент дня</div>
                <div className="text-xs font-medium text-white leading-tight">
                  Число {num} — {today.toLocaleDateString("ru", { day: "numeric", month: "long" })}
                </div>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/90 transition-colors active:scale-90">
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Post text */}
          <div className="px-4 py-3 max-h-32 overflow-y-auto scrollbar-hide">
            <p className="text-xs text-white/85 leading-relaxed whitespace-pre-line">
              {todayPost}
            </p>
          </div>

          {/* Actions — три кнопки в ряд, текст в одну строку */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className={`py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              copied ? "bg-gold/30 text-gold" : "bg-white/15 text-white hover:bg-white/25"}`}>
              <Copy size={13} className="flex-shrink-0" />
              <span>{copied ? "Скопировано" : "Копировать"}</span>
            </button>
            <button
              onClick={() => navigate("/result")}
              className="py-2.5 rounded-xl bg-white/15 text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/25 transition-all active:scale-95">
              <Edit3 size={13} className="flex-shrink-0" />
              <span>Редактировать</span>
            </button>
          </div>
        </motion.div>

        {/* Section label */}
        <h2 className="font-display text-lg font-semibold text-royal pt-0.5">Создать контент</h2>

        {/* Rail A */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => navigate("/rail-a")}
          className="w-full bg-card rounded-2xl p-4 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-royal/10 flex items-center justify-center flex-shrink-0">
              <Mic size={20} className="text-royal" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-sm mb-0.5">У меня есть запись</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Загрузите аудио или видео — получите пакет постов
              </div>
              <div className="mt-1 text-[10px] text-sapphire/70">mp3, wav, mp4, mov · до 500 МБ</div>
            </div>
            <ChevronRight size={16} className="text-sapphire flex-shrink-0" />
          </div>
        </motion.button>

        {/* Rail B */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => navigate("/rail-b")}
          className="w-full bg-card rounded-2xl p-4 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-sapphire" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-sm mb-0.5">Хочу найти тему</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Актуальные темы из трендов — один тап и контент готов
              </div>
              <div className="mt-1 text-[10px] text-sapphire/70">Обновляется каждый день</div>
            </div>
            <ChevronRight size={16} className="text-sapphire flex-shrink-0" />
          </div>
        </motion.button>

        {/* Limit bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl px-4 py-3 border border-border shadow-card">
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Пакеты в этом месяце</span>
            <span className="text-xs text-sapphire font-medium">2 / 3</span>
          </div>
          <div className="w-full bg-shell rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-sapphire" style={{ width: "67%" }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Бесплатный план ·{" "}
            <button
              onClick={() => navigate("/pricing")}
              className="text-sapphire font-medium active:opacity-70">
              
              Расширить
            </button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>);

}