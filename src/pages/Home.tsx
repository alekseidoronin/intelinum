import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, Mic, TrendingUp, RefreshCw, ChevronRight, Zap } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const fallbackPosts = [
`Число 9 сегодня - это число завершений и мудрости.

Если что-то в вашей жизни никак не заканчивается - отношения, проект, привычка - сегодня энергия помогает отпустить. Не бороться, а отпустить.

Спросите себя: что я ношу с собой из прошлого, что уже давно пора оставить?

Девятка учит нас, что пространство для нового появляется только тогда, когда мы освобождаем место.

#нумерология #числодня #энергиядня`,
`Число 3 - это день творчества и самовыражения.

Сегодня лучшее время для новых идей, общения и лёгкости. Не планируйте тяжёлые задачи - доверьтесь потоку.

Тройка говорит: выражай себя, будь искренним, радуйся мелочам.

#нумерология #числодня #творчество`,
`Число 6 - день заботы и гармонии.

Шестёрка приносит тепло в отношения. Сделайте что-то приятное для близкого человека - это вернётся к вам.

Главная задача дня: найти баланс между давать и получать.

#нумерология #числодня #гармония`,
];

interface HomeDashboardResponse {
  daily?: {
    posts?: string[];
    index?: number;
  };
  usage?: {
    usedCount?: number;
    limitCount?: number | null;
    tier?: string;
    status?: string;
  };
  source?: "fallback" | "db";
}

const initialIndex = (() => {
  const d = new Date();
  const dayNum = d.getDate() + d.getMonth() + 1;
  return (dayNum - 1) % fallbackPosts.length;
})();

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [posts, setPosts] = useState<string[]>(fallbackPosts);
  const [postIndex, setPostIndex] = useState(initialIndex);
  const [refreshing, setRefreshing] = useState(false);
  const [usage, setUsage] = useState({
    usedCount: 2,
    limitCount: 3 as number | null,
    tier: "free",
    status: "active",
  });
  const [homeSource, setHomeSource] = useState<"fallback" | "db">("fallback");

  const todayPost = posts.length > 0 ? posts[postIndex % posts.length] : fallbackPosts[0];
  const usagePercent = useMemo(() => {
    if (!usage.limitCount || usage.limitCount <= 0) return 100;
    return Math.min(100, Math.round((usage.usedCount / usage.limitCount) * 100));
  }, [usage.limitCount, usage.usedCount]);
  const tierLabel = usage.tier === "free" ? "Бесплатный план" : `План: ${usage.tier}`;

  const getHomeDashboard = async (action: "get_home_dashboard" | "rotate", currentIndex?: number) => {
    const { data, error } = await supabase.functions.invoke("home-dashboard", {
      body: { action, currentIndex },
    });
    if (error) throw new Error(error.message);
    return (data ?? {}) as HomeDashboardResponse;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await getHomeDashboard("get_home_dashboard");
        if (payload.daily?.posts && payload.daily.posts.length > 0) {
          setPosts(payload.daily.posts);
          const idx = typeof payload.daily.index === "number" ? payload.daily.index : 0;
          setPostIndex(idx % payload.daily.posts.length);
        }
        if (payload.usage) {
          setUsage((prev) => ({
            usedCount: payload.usage?.usedCount ?? prev.usedCount,
            limitCount: payload.usage?.limitCount ?? prev.limitCount,
            tier: payload.usage?.tier ?? prev.tier,
            status: payload.usage?.status ?? prev.status,
          }));
        }
        if (payload.source) setHomeSource(payload.source);
      } catch {
        setPosts(fallbackPosts);
      }
    };
    void load();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(todayPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    const refresh = async () => {
      try {
        const payload = await getHomeDashboard("rotate", postIndex);
        if (payload.daily?.posts && payload.daily.posts.length > 0) {
          setPosts(payload.daily.posts);
          const idx = typeof payload.daily.index === "number" ? payload.daily.index : postIndex + 1;
          setPostIndex(idx % payload.daily.posts.length);
        } else {
          setPostIndex((i) => (i + 1) % posts.length);
        }
        if (payload.usage) {
          setUsage((prev) => ({
            usedCount: payload.usage?.usedCount ?? prev.usedCount,
            limitCount: payload.usage?.limitCount ?? prev.limitCount,
            tier: payload.usage?.tier ?? prev.tier,
            status: payload.usage?.status ?? prev.status,
          }));
        }
        if (payload.source) setHomeSource(payload.source);
      } catch {
        setPostIndex((i) => (i + 1) % posts.length);
      } finally {
        setRefreshing(false);
        toast({ description: "Контент обновлён ✨" });
      }
    };
    void refresh();
  };

  const handleEdit = () => {
    toast({ description: "Редактирование будет доступно в следующем обновлении" });
  };

  const today = new Date();
  const dayNum = today.getDate() + today.getMonth() + 1;
  const num = (dayNum - 1) % 9 + 1;

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <TopBar />

      <div className="flex-1 flex flex-col px-4 pt-3 gap-3 pb-24 md:pb-6">
        <div
          className="rounded-2xl overflow-hidden flex flex-col max-h-80"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}
        >
          <div className="px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Zap size={12} className="text-gold" />
              </div>
              <div>
                <div className="text-xs text-white/60 leading-tight">Контент дня</div>
                <div className="text-sm font-medium text-white leading-tight">
                  Число {num} - {today.toLocaleDateString("ru", { day: "numeric", month: "long" })}
                </div>
                <div className="text-[10px] text-white/45 mt-0.5">Источник: {homeSource === "db" ? "backend" : "fallback"}</div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white/90 transition-colors active:scale-90"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          <motion.div
            key={postIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 overflow-y-auto scrollbar-hide flex-1"
          >
            <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">{todayPost}</p>
          </motion.div>

          <div className="pb-4 grid grid-cols-2 gap-2 px-[10px]">
            <button
              onClick={handleCopy}
              className="py-3 rounded-xl bg-gradient-gold text-royal text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:opacity-90 shadow-md"
            >
              <Copy size={15} className="flex-shrink-0" />
              <span>{copied ? "Скопировано" : "Копировать"}</span>
            </button>
            <button
              onClick={handleEdit}
              className="py-3 rounded-xl bg-gradient-gold text-royal text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:opacity-90 shadow-md"
            >
              <Edit3 size={15} className="flex-shrink-0" />
              Редактировать
            </button>
          </div>
        </div>

        <h2 className="font-display text-lg font-semibold text-royal">Создать контент</h2>

        <button
          onClick={() => navigate("/rail-a")}
          className="w-full bg-card rounded-2xl p-3.5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-royal/10 flex items-center justify-center flex-shrink-0">
              <Mic size={18} className="text-royal" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-base mb-0.5">У меня есть запись</div>
              <div className="text-sm text-muted-foreground">Загрузите аудио или видео — получите пакет постов</div>
              <div className="mt-0.5 text-xs text-sapphire/70">mp3, wav, mp4, mov · до 500 МБ</div>
            </div>
            <ChevronRight size={16} className="text-sapphire flex-shrink-0" />
          </div>
        </button>

        <button
          onClick={() => navigate("/rail-b")}
          className="w-full bg-card rounded-2xl p-3.5 text-left shadow-card border border-border hover:border-sapphire/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-sapphire" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-royal text-base mb-0.5">Хочу найти тему</div>
              <div className="text-sm text-muted-foreground">Актуальные темы из трендов — один тап и контент готов</div>
              <div className="mt-0.5 text-xs text-sapphire/70">Обновляется каждый день</div>
            </div>
            <ChevronRight size={16} className="text-sapphire flex-shrink-0" />
          </div>
        </button>

        <div className="bg-card rounded-2xl px-4 py-3 border border-border shadow-card mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-muted-foreground">Пакеты в этом месяце</span>
            <span className="text-sm text-sapphire font-medium">{usage.usedCount} / {usage.limitCount ?? "∞"}</span>
          </div>
          <div className="w-full bg-shell rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-sapphire" style={{ width: `${usagePercent}%` }} />
          </div>
          <div className="mt-1.5 text-sm text-muted-foreground">
            {tierLabel} ·{" "}
            <button onClick={() => navigate("/pricing")} className="text-sapphire font-medium active:opacity-70">
              Расширить
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
