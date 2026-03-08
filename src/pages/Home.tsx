import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, Mic, TrendingUp, RefreshCw, ChevronRight, Zap } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";

const posts = [
  `Число 9 сегодня — это число завершений и мудрости. 

Если что-то в вашей жизни никак не заканчивается — отношения, проект, привычка — сегодня энергия помогает отпустить. Не бороться, а отпустить.

Спросите себя: что я ношу с собой из прошлого, что уже давно пора оставить?

Девятка учит нас, что пространство для нового появляется только тогда, когда мы освобождаем место.

#нумерология #числодня #энергиядня`,
  `Число 3 — это день творчества и самовыражения.

Сегодня лучшее время для новых идей, общения и лёгкости. Не планируйте тяжёлые задачи — доверьтесь потоку.

Тройка говорит: выражай себя, будь искренним, радуйся мелочам.

#нумерология #числодня #творчество`,
  `Число 6 — день заботы и гармонии.

Шестёрка приносит тепло в отношения. Сделайте что-то приятное для близкого человека — это вернётся к вам.

Главная задача дня: найти баланс между давать и получать.

#нумерология #числодня #гармония`,
];

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [postIndex, setPostIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const todayPost = posts[postIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(todayPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPostIndex((i) => (i + 1) % posts.length);
      setRefreshing(false);
      toast({ description: "Контент обновлён ✨" });
    }, 800);
  };

  const handleEdit = () => {
    toast({ description: "Редактирование будет доступно в следующем обновлении" });
  };

  const today = new Date();
  const dayNum = today.getDate() + today.getMonth() + 1;
  const num = (dayNum - 1) % 9 + 1;

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <TopBar />

      {/* Scrollable content */}
      <div className="flex-1 flex flex-col px-4 pt-3 gap-3 overflow-hidden">

        {/* Контент дня widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-0 max-h-[38vh] rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}>

          {/* Widget Header */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Zap size={13} className="text-gold" />
              </div>
              <div>
               <div className="text-xs text-white/60 leading-tight">Контент дня</div>
                <div className="text-sm font-medium text-white leading-tight">
                  Число {num} — {today.toLocaleDateString("ru", { day: "numeric", month: "long" })}
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/90 transition-colors active:scale-90">
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Post text */}
          <motion.div
            key={postIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
            <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
              {todayPost}
            </p>
          </motion.div>

          {/* Actions */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className={`py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                 copied ? "bg-gold/30 text-gold" : "bg-white/15 text-white hover:bg-white/25"
              }`}>
              <Copy size={15} className="flex-shrink-0" />
              <span>{copied ? "Скопировано" : "Копировать"}</span>
            </button>
            <button
              onClick={handleEdit}
              className="py-3 rounded-xl bg-white/15 text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/25 transition-all active:scale-95">
              <Edit3 size={15} className="flex-shrink-0" />
              Редактировать
            </button>
          </div>
        </motion.div>

        {/* Section label */}
        <h2 className="font-display text-base font-semibold text-royal shrink-0">Создать контент</h2>

        {/* Rail A */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => navigate("/rail-a")}
          className="shrink-0 w-full bg-card rounded-2xl p-3.5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-royal/10 flex items-center justify-center flex-shrink-0">
              <Mic size={18} className="text-royal" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-sm mb-0.5">У меня есть запись</div>
              <div className="text-xs text-muted-foreground">Загрузите аудио или видео — получите пакет постов</div>
              <div className="mt-0.5 text-[10px] text-sapphire/70">mp3, wav, mp4, mov · до 500 МБ</div>
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
          className="shrink-0 w-full bg-card rounded-2xl p-3.5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-sapphire" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-sm mb-0.5">Хочу найти тему</div>
              <div className="text-xs text-muted-foreground">Актуальные темы из трендов — один тап и контент готов</div>
              <div className="mt-0.5 text-[10px] text-sapphire/70">Обновляется каждый день</div>
            </div>
            <ChevronRight size={16} className="text-sapphire flex-shrink-0" />
          </div>
        </motion.button>

        {/* Limit bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="shrink-0 bg-card rounded-2xl px-4 py-3 border border-border shadow-card mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Пакеты в этом месяце</span>
            <span className="text-xs text-sapphire font-medium">2 / 3</span>
          </div>
          <div className="w-full bg-shell rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-sapphire" style={{ width: "67%" }} />
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            Бесплатный план ·{" "}
            <button onClick={() => navigate("/pricing")} className="text-sapphire font-medium active:opacity-70">
              Расширить
            </button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
