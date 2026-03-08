import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, Download, RefreshCw, ChevronLeft, ChevronRight, Check, FileText, LayoutGrid, Sparkles, Image, ChevronsDown, ChevronsUp } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  {
    id: "instagram", name: "Instagram", emoji: "📸", charLimit: 2200,
    text: `✨ Число 7 - почему эти люди всегда ищут истину?

Если у вас семёрка в матрице судьбы, вы, наверное, не раз слышали: «Ты слишком много думаешь». И знаете что? Это правда. Но это ваш дар.

Семёрка - число духовного поиска. Им нужно понять, докопаться, исследовать.

👁 3 главные черты людей с числом 7:
• Глубокий аналитический ум
• Внутренняя интуиция
• Потребность в уединении для «перезарядки»

Если это про вас - напишите «7» в комментарии 👇

#нумерология #числосудьбы #матрицасудьбы #число7`,
  },
  {
    id: "telegram", name: "Telegram", emoji: "✈️", charLimit: 4096,
    text: `**Число 7: почему эти люди никогда не перестают искать**

Люди с числом 7 в матрице судьбы отличаются особым устройством ума. Они не могут просто принять что-то на веру - им нужно понять механизм, найти закономерность.

**Что это значит на практике?**

Семёрки часто кажутся окружающим «странными». Им нужно время в одиночестве - это не социофобия, это перезарядка.

**Главная задача семёрки** - научиться доверять своей интуиции. Парадокс: при всём аналитическом уме, интуиция у них феноменальная.

Если хотите узнать, есть ли семёрка в вашей матрице - записывайтесь на разбор.`,
  },
  {
    id: "vk", name: "ВКонтакте", emoji: "🔵", charLimit: 3000,
    text: `Число 7 в нумерологии - разбор для тех, кто узнаёт себя

Давайте поговорим о людях с семёркой. Их легко вычислить: они всегда «в своей голове» и редко довольствуются поверхностными ответами.

Три вещи, которые важно знать о числе 7:

1. Им нужно одиночество для восстановления.
2. Их интуиция работает лучше логики.
3. Их главный урок - доверие к себе и жизни.

Провожу полные разборы матрицы судьбы. Пишите в личные.`,
  },
  {
    id: "dzen", name: "Яндекс Дзен", emoji: "📰", charLimit: 10000,
    text: `Число 7 в нумерологии: полный разбор характера и жизненного пути

Нумерология позволяет через числа понять глубинные черты личности. Число 7 занимает особое место - это число духовного поиска, аналитического ума и внутреннего знания...

[Полная SEO-статья на 3000+ слов будет сгенерирована]`,
  },
  {
    id: "reels", name: "Reels / Скрипт", emoji: "🎬", charLimit: 500,
    text: `[0-3 сек] «Если у вас число 7 - вы это узнаете по одной вещи»

[3-8 сек] «Вы никогда не принимаете ничего на веру»

[8-20 сек] «Семёрка - число людей, которые всегда ищут истину»

[20-35 сек] «3 черты: аналитический ум, сильная интуиция, потребность в уединении»

[35-45 сек] «Главный вызов семёрки - научиться доверять»

[45-60 сек] «Хотите узнать своё число? Ссылка в профиле»`,
  },
];

export default function Result() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("instagram");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [targetChars, setTargetChars] = useState<string>("");

  const cur = platforms.find(p => p.id === activeTab)!;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = () => {
    toast({ description: "Редактирование будет доступно в следующем обновлении" });
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      toast({ description: "Пакет перегенерирован ✨" });
    }, 1200);
  };

  const handlePdf = () => {
    toast({ description: "PDF-гайд будет создан в следующем обновлении 📄" });
  };

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-8">
      <TopBar />

      {/* Header */}
      <div className="px-5 pt-3 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-sapphire" />
            <h1 className="font-display text-xl text-royal">Контент-пакет готов</h1>
          </div>
          <p className="text-sm text-muted-foreground">Число 7: духовный поиск</p>
        </div>
      </div>

      {/* Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="mx-5 mb-4 bg-royal rounded-2xl px-4 py-3.5 flex items-center gap-3">
        <Sparkles size={20} className="text-gold flex-shrink-0" />
        <div>
          <p className="text-base text-swan font-medium">Всё готово для всех площадок</p>
          <p className="text-sm text-swan/60">5 постов · картинка · карусель · PDF-гайд</p>
        </div>
      </motion.div>

      {/* Platform tabs */}
      <div className="mb-4 px-5">
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button key={p.id} onClick={() => setActiveTab(p.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-base font-medium whitespace-nowrap transition-all ${
                activeTab === p.id ? "bg-royal text-swan" : "bg-white text-sapphire border border-border hover:border-sapphire/50 shadow-card"
              }`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Post card */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-background">
            <span className="text-base font-medium text-royal">{cur.name}</span>
            <span className="text-sm text-muted-foreground">{cur.text.length} / {cur.charLimit.toLocaleString()} симв.</span>
          </div>
          <div className="px-4 py-4 max-h-64 overflow-y-auto scrollbar-hide">
            <p className="text-base text-foreground leading-relaxed whitespace-pre-line">{cur.text}</p>
          </div>
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
            {/* Custom char target */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Нужное количество символов:</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 border border-border rounded-xl bg-background px-3 h-11 min-w-0 flex-1">
                  <input
                    type="number"
                    value={targetChars}
                    onChange={(e) => setTargetChars(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && targetChars) {
                        setRegenerating(true);
                        setTimeout(() => { setRegenerating(false); toast({ description: `Текст перегенерирован: ${targetChars} симв. ✨` }); }, 1200);
                      }
                    }}
                    placeholder={cur.charLimit.toString()}
                    className="w-full bg-transparent text-sm text-royal focus:outline-none"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">симв.</span>
                </div>
                <button
                  disabled={!targetChars || regenerating}
                  onClick={() => {
                    if (!targetChars) return;
                    setRegenerating(true);
                    setTimeout(() => { setRegenerating(false); toast({ description: `Текст перегенерирован: ${targetChars} симв. ✨` }); }, 1200);
                  }}
                  className="h-11 px-4 rounded-xl bg-royal text-swan text-sm font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Sparkles size={14} className={regenerating ? "animate-spin" : ""} />
                  Сгенерировать
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleCopy(activeTab, cur.text)}
                className={`py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  copiedId === activeTab ? "bg-sapphire/10 text-sapphire" : "bg-background text-royal border border-border hover:border-sapphire/50"
                }`}>
                {copiedId === activeTab ? <Check size={15} /> : <Copy size={15} />}
                {copiedId === activeTab ? "Скопировано" : "Копировать"}
              </button>
              <button onClick={handleEdit} className="py-3 rounded-xl bg-background text-royal text-sm font-medium flex items-center justify-center gap-1.5 border border-border hover:border-sapphire/50 transition-all active:scale-95">
                <Edit3 size={15} />
                Редактировать
              </button>
              <button onClick={handleRegenerate} className="col-span-2 py-3 rounded-xl bg-background border border-border text-sapphire text-sm font-medium flex items-center justify-center gap-1.5 hover:border-sapphire/50 transition-colors active:scale-95">
                <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Генерируется…" : "Переписать"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Image, Carousel & extra actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/image-editor")}
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 shadow-card active:scale-[0.98] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <Image size={24} className="text-sapphire" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-royal">Картинка</p>
              <p className="text-sm text-muted-foreground">Выбор размера · скачать</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/carousel-editor")}
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 shadow-card active:scale-[0.98] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <LayoutGrid size={24} className="text-sapphire" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-royal">Карусель — 8 слайдов</p>
              <p className="text-sm text-muted-foreground">Редактор текста · шрифт · размер</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>

          <button onClick={handlePdf} className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left hover:border-sapphire/40 shadow-card transition-all active:scale-[0.98]">
            <div className="w-11 h-11 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-sapphire" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-royal">Сделать PDF-гайд</p>
              <p className="text-sm text-muted-foreground">Красивый гайд на 3–7 страниц для привлечения клиентов</p>
            </div>
          </button>

          <button onClick={handleRegenerate} className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left hover:border-sapphire/40 shadow-card transition-all active:scale-[0.98]">
            <div className="w-11 h-11 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={20} className={`text-sapphire ${regenerating ? "animate-spin" : ""}`} />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-royal">Переписать</p>
              <p className="text-sm text-muted-foreground">Создать новый вариант всего пакета</p>
            </div>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
