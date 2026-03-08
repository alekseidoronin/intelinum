import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const categories = [
  {
    tag: "Психология",
    items: [
      "Как избавиться от тревоги по числам",
      "Почему я постоянно сомневаюсь в себе",
      "Число, которое блокирует вашу уверенность",
      "Страхи и числа: как они связаны",
      "Как числа влияют на наши эмоции",
      "Панические атаки и числовые паттерны",
      "Числовая медитация для спокойствия",
      "Как перестать бояться будущего через числа",
      "Психологические барьеры в вашем числе судьбы",
    ],
  },
  {
    tag: "Деньги",
    items: [
      "Число судьбы и финансовое благополучие",
      "Числа миллионеров — что общего",
      "Как привлечь деньги через нумерологию",
      "Финансовый код вашего имени",
      "Числа, блокирующие ваш доход",
      "Лучшее время для инвестиций по числам",
      "Почему деньги уходят: числовой анализ",
      "Число изобилия — как его активировать",
      "Нумерология богатства: 7 шагов",
    ],
  },
  {
    tag: "Отношения",
    items: [
      "Совместимость по матрице судьбы",
      "Почему одни отношения разрушаются",
      "Числовая совместимость партнёров",
      "Как найти свою половину через числа",
      "Кармические связи и числа",
      "Почему повторяются одни и те же отношения",
      "Число любви — что оно говорит о вас",
      "Как улучшить отношения с помощью нумерологии",
      "Токсичные партнёры: числовой паттерн",
    ],
  },
  {
    tag: "Успех",
    items: [
      "Как изменить свою судьбу через числа",
      "Число успеха: как его раскрыть",
      "Почему одни достигают целей, а другие нет",
      "Топ-3 числа самых успешных людей",
      "Числовой код карьерного роста",
      "Как выбрать профессию по числам",
      "Числа лидеров — анализ паттернов",
      "Ваш личный год успеха: когда действовать",
      "Числа, которые открывают новые возможности",
    ],
  },
  {
    tag: "Развитие",
    items: [
      "Как раскрыть свой потенциал через числа",
      "Число таланта: что вы умеете лучше всего",
      "Нумерология для личностного роста",
      "Как поставить цели через матрицу судьбы",
      "Числовые циклы: когда меняться",
      "Духовное развитие и нумерология",
      "Число миссии: зачем вы здесь",
      "Как избавиться от старых программ через числа",
      "Путь к себе: числовой анализ",
    ],
  },
  {
    tag: "Личное",
    items: [
      "Почему всё идёт не так, как хочу",
      "Число, которое мешает вам быть собой",
      "Как принять себя через нумерологию",
      "Почему я чувствую себя не на своём месте",
      "Числа и самооценка: прямая связь",
      "Как найти своё призвание по дате рождения",
      "Числовой анализ вашего характера",
      "Что числа говорят о вашем предназначении",
      "Как перестать сравнивать себя с другими",
    ],
  },
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
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl text-royal">Что сейчас обсуждают</h1>
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
            className="w-24 h-24 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-full border-2 border-sapphire/30 flex items-center justify-center">
              <Sparkles size={32} className="text-sapphire" />
            </div>
          </motion.div>
          <h2 className="font-display text-2xl text-royal mb-3">Создаём контент под вас...</h2>
          <div className="bg-white border border-border rounded-2xl px-5 py-3 inline-block mb-6 shadow-card">
            <p className="text-sm text-royal">«{selected}»</p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Пишем посты в вашем стиле, генерируем картинку и карусель
          </p>
        </motion.div>
      ) : (
        <div className="px-5 space-y-8">
          {categories.map((cat, ci) => (
            <div key={cat.tag}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={15} className="text-sapphire" />
                <h2 className="text-sm font-semibold text-royal tracking-wide uppercase">
                  {cat.tag}
                </h2>
              </div>
              <div className="space-y-2">
                {cat.items.map((topic, i) => (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.04 + i * 0.03 }}
                    onClick={() => handleSelect(topic)}
                    className="w-full bg-white border border-border rounded-2xl px-4 py-3 text-left flex items-center justify-between hover:border-sapphire/50 shadow-card transition-all active:scale-[0.98]"
                  >
                    <p className="text-sm text-royal leading-snug flex-1">{topic}</p>
                    <span className="text-xs font-medium text-sapphire ml-3 flex-shrink-0">→</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
