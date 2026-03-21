import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Brain, DollarSign, Heart, Trophy, Star, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { generateContentPack } from "@/lib/content-pack";

const categories = [
  {
    tag: "Психология",
    description: "Тревога, страхи, эмоции и уверенность через числа",
    icon: Brain,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
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
    description: "Привлечение дохода, финансовые блоки и числа изобилия",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
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
    description: "Совместимость, кармические связи и поиск партнёра",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
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
    description: "Карьера, цели и числовой код достижений",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
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
    description: "Потенциал, миссия и духовный рост через числа",
    icon: Star,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
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
    description: "Самооценка, призвание и принятие себя",
    icon: User,
    color: "text-sapphire",
    bg: "bg-sky-50",
    border: "border-sky-200",
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
  const [activeCategory, setActiveCategory] = useState<typeof categories[0] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleSelect = async (topic: string) => {
    setSelected(topic);
    setGenerating(true);
    const generationInput = { topic };
    const pack = await generateContentPack(generationInput);
    navigate("/result", { state: { contentPack: pack, generationInput } });
  };

  // Generating screen
  if (generating && selected) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 py-20 text-center"
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
        <BottomNav />
      </div>
    );
  }

  // Topics screen
  if (activeCategory) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card"
          >
            <ChevronLeft size={18} />
          </button>
          <div className={`w-9 h-9 rounded-xl ${activeCategory.bg} ${activeCategory.border} border flex items-center justify-center`}>
            <activeCategory.icon size={18} className={activeCategory.color} />
          </div>
          <div>
            <h1 className="font-display text-xl text-royal">{activeCategory.tag}</h1>
            <p className="text-xs text-muted-foreground">{activeCategory.items.length} темы</p>
          </div>
        </div>

        <div className="px-5 space-y-2">
          {activeCategory.items.map((topic, i) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleSelect(topic)}
              className="w-full bg-white border border-border rounded-2xl px-4 py-3 text-left flex items-center justify-between hover:border-sapphire/50 shadow-card transition-all active:scale-[0.98]"
            >
              <span className={`text-xs font-bold mr-3 flex-shrink-0 ${activeCategory.color}`}>{i + 1}</span>
              <p className="text-sm text-royal leading-snug flex-1">{topic}</p>
              <span className="text-xs font-medium text-sapphire ml-3 flex-shrink-0">→</span>
            </motion.button>
          ))}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Categories screen
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
          <p className="text-xs text-muted-foreground">Выберите категорию</p>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.tag}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setActiveCategory(cat)}
            className={`w-full bg-white border ${cat.border} rounded-2xl px-4 py-3.5 text-left flex items-center gap-4 shadow-card hover:shadow-md transition-all active:scale-[0.98]`}
          >
            <div className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
              <cat.icon size={20} className={cat.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-royal text-sm">{cat.tag}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{cat.description}</p>
            </div>
            <span className={`text-sm font-medium flex-shrink-0 ${cat.color}`}>→</span>
          </motion.button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
