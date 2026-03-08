import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, Download, RefreshCw, ChevronLeft, Check, FileText, LayoutGrid, Sparkles, Image } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    emoji: "📸",
    charLimit: 2200,
    text: `✨ Число 7 — почему эти люди всегда ищут истину?

Если у вас семёрка в матрице судьбы, вы, наверное, не раз слышали: «Ты слишком много думаешь». И знаете что? Это правда. Но это ваш дар.

Семёрка — число духовного поиска. Эти люди не могут принять что-то просто так. Им нужно понять, докопаться, исследовать.

👁 3 главные черты людей с числом 7:
• Глубокий аналитический ум
• Внутренняя интуиция, которой редко доверяют сами
• Потребность в уединении для «перезарядки»

Главный вызов семёрки — научиться доверять. Себе, людям, процессу.

Если это про вас — напишите «7» в комментарии 👇

#нумерология #числосудьбы #матрицасудьбы #число7 #нумерологонлайн #эзотерика`,
  },
  {
    id: "telegram",
    name: "Telegram",
    emoji: "✈️",
    charLimit: 4096,
    text: `**Число 7: почему эти люди никогда не перестают искать**

Сегодня я хочу поговорить о семёрке — одном из самых неоднозначных чисел в нумерологии.

Люди с числом 7 в матрице судьбы отличаются особым устройством ума. Они не могут просто принять что-то на веру — им нужно понять механизм, найти закономерность, докопаться до сути.

**Что это значит на практике?**

Семёрки часто кажутся окружающим «странными» или «слишком серьёзными». Они предпочитают глубокий разговор светской беседе. Им нужно время в одиночестве — это не социофобия, это перезарядка.

Именно поэтому среди людей с семёркой так много исследователей, учёных, философов, духовных практиков.

**Главная задача семёрки** — научиться доверять своей интуиции. Парадокс в том, что при всём своём аналитическом уме, интуиция у них развита феноменально. Просто они часто её заглушают логикой.

Если вы хотите узнать, есть ли в вашей матрице семёрка и как она влияет на вашу жизнь — записывайтесь на личный разбор по ссылке в профиле.`,
  },
  {
    id: "vk",
    name: "ВКонтакте",
    emoji: "🔵",
    charLimit: 3000,
    text: `Число 7 в нумерологии — разбор для тех, кто узнаёт себя

Давайте поговорим о людях с семёркой. Их легко вычислить: они всегда немного «в своей голове», задают неожиданные вопросы и редко довольствуются поверхностными ответами.

Семёрка — это число духовного поиска и внутреннего знания. Это не мистика — это просто такой тип личности, который нумерология называет особым словом.

Три вещи, которые важно знать о числе 7:

1. Им нужно одиночество. Не потому что они не любят людей — а потому что так они восстанавливаются.

2. Их интуиция работает лучше логики. Но они об этом часто не знают.

3. Их главный урок — доверие. К себе, к людям, к жизни.

Если это про вас — я провожу полные разборы матрицы судьбы. Пишите в личные сообщения.`,
  },
  {
    id: "dzen",
    name: "Яндекс Дзен",
    emoji: "📰",
    charLimit: 10000,
    text: `Число 7 в нумерологии: полный разбор характера, судьбы и жизненного пути

Нумерология — это система, позволяющая через числа понять глубинные черты личности, жизненные задачи и особенности судьбы. Число 7 занимает особое место в этой системе — оно считается числом духовного поиска, аналитического ума и внутреннего знания...

[Полная SEO-статья на 3000+ слов будет сгенерирована]`,
  },
  {
    id: "reels",
    name: "Reels / Скрипт",
    emoji: "🎬",
    charLimit: 500,
    text: `[0-3 сек] Хук: «Если у вас число 7 — вы это узнаете по одной вещи»

[3-8 сек] «Вы никогда не принимаете ничего на веру»

[8-20 сек] «Семёрка — число людей, которые всегда ищут истину. Им нужно понять механизм любой вещи»

[20-35 сек] «Три черты: аналитический ум, сильная интуиция, потребность в уединении»

[35-45 сек] «Главный вызов семёрки — научиться доверять»

[45-60 сек] CTA: «Хотите узнать своё число судьбы? Ссылка в профиле»`,
  },
];

export default function Result() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("instagram");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentPlatform = platforms.find(p => p.id === activeTab)!;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-gold" />
            <h1 className="font-display text-xl gradient-text-gold">Контент-пакет готов</h1>
          </div>
          <p className="text-xs text-muted-foreground">Число 7: духовный поиск</p>
        </div>
      </div>

      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-5 mb-4 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <Sparkles size={18} className="text-gold flex-shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium">Всё готово для всех площадок</p>
          <p className="text-xs text-muted-foreground">5 постов · картинка · карусель · PDF-гайд</p>
        </div>
      </motion.div>

      {/* Platform tabs */}
      <div className="px-5 mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === p.id
                  ? "bg-primary/15 text-gold border border-primary/30"
                  : "text-muted-foreground border border-border/30 hover:border-border"
              }`}
            >
              <span>{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Post text */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{currentPlatform.emoji} {currentPlatform.name}</span>
            <span className="text-xs text-muted-foreground">{currentPlatform.text.length} / {currentPlatform.charLimit.toLocaleString()} симв.</span>
          </div>
          <div className="px-4 py-4 max-h-64 overflow-y-auto scrollbar-hide">
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{currentPlatform.text}</p>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <button
              onClick={() => handleCopy(activeTab, currentPlatform.text)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${
                copiedId === activeTab ? "bg-primary/20 text-gold" : "bg-muted/50 text-foreground hover:bg-muted"
              }`}
            >
              {copiedId === activeTab ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === activeTab ? "Скопировано!" : "Копировать"}
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-muted/50 text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-all active:scale-95">
              <Edit3 size={14} />
              Редактировать
            </button>
            <button className="py-2.5 px-3 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-colors active:scale-95">
              <RefreshCw size={14} />
            </button>
          </div>
        </motion.div>

        {/* Image & Carousel */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3">
            <div className="w-full aspect-square rounded-xl bg-gradient-hero flex items-center justify-center">
              <div className="text-center">
                <Image size={28} className="text-gold mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Картинка</p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground transition-colors">
                <Download size={12} />
                Скачать
              </button>
              <button className="flex-1 py-2 rounded-lg bg-primary/10 text-xs text-gold flex items-center justify-center gap-1">
                <RefreshCw size={12} />
                Ещё
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3">
            <div className="w-full aspect-square rounded-xl bg-gradient-hero flex items-center justify-center">
              <div className="text-center">
                <LayoutGrid size={28} className="text-gold mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">8 слайдов</p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground transition-colors">
                <Download size={12} />
                ZIP
              </button>
              <button className="flex-1 py-2 rounded-lg bg-primary/10 text-xs text-gold flex items-center justify-center gap-1">
                <Edit3 size={12} />
                Изм.
              </button>
            </div>
          </div>
        </div>

        {/* Extra actions */}
        <div className="space-y-2">
          <button className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left hover:border-primary/30 transition-all active:scale-[0.98]">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={16} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Сделать бесплатный PDF-гайд</p>
              <p className="text-xs text-muted-foreground">Красивый гайд на 3–7 страниц для привлечения клиентов</p>
            </div>
          </button>
          <button className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left hover:border-primary/30 transition-all active:scale-[0.98]">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw size={16} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Перегенерировать</p>
              <p className="text-xs text-muted-foreground">Создать новый вариант всего пакета</p>
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
