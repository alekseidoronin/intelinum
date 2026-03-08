import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const trends = [
  { id: 1, title: "Как избавиться от тревоги по числам", growth: "+487%", tag: "Психология" },
  { id: 2, title: "Число судьбы и финансовое благополучие", growth: "+312%", tag: "Деньги" },
  { id: 3, title: "Почему всё идёт не так, как хочу", growth: "+256%", tag: "Личное" },
  { id: 4, title: "Совместимость по матрице судьбы", growth: "+198%", tag: "Отношения" },
  { id: 5, title: "Числа миллионеров — что общего", growth: "+176%", tag: "Успех" },
  { id: 6, title: "Как изменить свою судьбу через числа", growth: "+143%", tag: "Развитие" },
];

const prompts = [
  { category: "Ежедневные", items: ["Число дня", "Энергия дня", "Прогноз на неделю"] },
  { category: "Обучающие", items: ["Что такое число судьбы", "Как рассчитать матрицу"] },
  { category: "Продающие", items: ["Почему стоит заказать разбор", "История клиента"] },
  { category: "Развлекательные", items: ["Топ-5 чисел миллионеров", "3 числа, которые меняют жизнь"] },
  { category: "Сезонные", items: ["Прогноз на месяц", "Числа нового года"] },
];

export default function RailB() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleSelect = (topic: string) => {
    setSelected(topic);
    setGenerating(true);
    setTimeout(() => navigate("/result"), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl gradient-text-gold">Что сейчас обсуждают</h1>
          <p className="text-xs text-muted-foreground">Актуальные темы под нумерологию</p>
        </div>
      </div>

      {generating && selected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 py-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 opacity-80"
          >
            <div className="w-full h-full rounded-full border-2 border-primary/40 flex items-center justify-center">
              <Sparkles size={32} className="text-gold" />
            </div>
          </motion.div>
          <h2 className="font-display text-2xl gradient-text-gold mb-3">Создаём контент под вас...</h2>
          <div className="glass-card rounded-2xl px-5 py-3 inline-block mb-6">
            <p className="text-sm text-foreground/80">«{selected}»</p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Пишем посты в вашем стиле, генерируем картинку и карусель
          </p>
        </motion.div>
      ) : (
        <div className="px-5 space-y-6">
          {/* Trends */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-gold" />
              <h2 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Тренды сегодня</h2>
              <span className="ml-auto text-xs text-muted-foreground">Обновлено 2ч назад</span>
            </div>
            <div className="space-y-2">
              {trends.map((trend, i) => (
                <motion.button
                  key={trend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleSelect(trend.title)}
                  className="w-full glass-card rounded-2xl px-4 py-3.5 text-left flex items-center justify-between group hover:border-primary/40 transition-all active:scale-[0.98]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{trend.tag}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug">{trend.title}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs font-medium text-gold bg-primary/10 px-2 py-1 rounded-lg">{trend.growth}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick prompts */}
          <div>
            <h2 className="text-sm font-semibold text-foreground/80 tracking-wide uppercase mb-3">Быстрые темы</h2>
            <div className="space-y-4">
              {prompts.map((group) => (
                <div key={group.category}>
                  <p className="text-xs text-muted-foreground mb-2">{group.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(item => (
                      <button
                        key={item}
                        onClick={() => handleSelect(item)}
                        className="px-4 py-2 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground/80 hover:border-primary/40 hover:text-gold hover:bg-primary/10 transition-all active:scale-95"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
