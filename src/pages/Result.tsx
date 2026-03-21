import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Edit3, RefreshCw, ChevronLeft, ChevronRight, Check, LayoutGrid, Sparkles, Image } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fallbackPack, generateContentPack, type ContentPack, type PlatformId } from "@/lib/content-pack";

type GenerationInput = {
  topic: string;
  transcript?: string;
};

type ResultLocationState = {
  contentPack?: ContentPack;
  generationInput?: GenerationInput;
};

const emojiByPlatform: Record<PlatformId, string> = {
  instagram: "📸",
  telegram: "✈️",
  vk: "🔵",
  dzen: "📰",
  reels: "🎬",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

const toTextMap = (pack: ContentPack) =>
  Object.fromEntries(pack.platforms.map((platform) => [platform.id, platform.text]));

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = (location.state as ResultLocationState | null) ?? null;

  const initialPack = state?.contentPack ?? fallbackPack("Число 7: духовный поиск");
  const initialInput: GenerationInput = state?.generationInput ?? { topic: initialPack.topic };

  const [pack, setPack] = useState<ContentPack>(initialPack);
  const [generationInput, setGenerationInput] = useState<GenerationInput>(initialInput);
  const [activeTab, setActiveTab] = useState<PlatformId>(initialPack.platforms[0]?.id ?? "instagram");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [targetChars, setTargetChars] = useState<string>("");
  const [texts, setTexts] = useState<Record<string, string>>(toTextMap(initialPack));
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");

  const currentPlatform =
    pack.platforms.find((platform) => platform.id === activeTab) ?? pack.platforms[0] ?? fallbackPack("Контент").platforms[0];
  const currentText = texts[activeTab] ?? currentPlatform.text;
  const sourceLabel = pack.source === "backend" ? "backend" : "fallback";
  const tabs = useMemo(() => pack.platforms, [pack.platforms]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = () => {
    setEditDraft(currentText);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    setTexts((prev) => ({ ...prev, [activeTab]: editDraft }));
    setEditOpen(false);
    toast({ description: "Текст сохранён ✅" });
  };


  const handleRegenerate = async () => {
    setRegenerating(true);
    const nextPack = await generateContentPack(generationInput);
    setPack(nextPack);
    setTexts(toTextMap(nextPack));
    setActiveTab(nextPack.platforms[0]?.id ?? "instagram");
    setGenerationInput({ topic: nextPack.topic, transcript: generationInput.transcript });
    setRegenerating(false);
    toast({
      description: `Пакет перегенерирован (${nextPack.source === "backend" ? "backend" : "fallback"}) ✨`,
    });
  };

  const handleGenerateByChars = async () => {
    if (!targetChars) return;
    setRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("rewrite-text", {
        body: { text: currentText, targetChars: Number(targetChars), platform: currentPlatform.name }
      });
      if (error) throw error;
      if (data?.error) throw new Error(String(data.error));
      const rewrittenText = typeof data?.text === "string" ? data.text : currentText;
      setTexts((prev) => ({ ...prev, [activeTab]: rewrittenText }));
      toast({ description: `Текст переписан: ${rewrittenText.length} симв. ✨` });
      setTargetChars("");
    } catch (error) {
      toast({ description: getErrorMessage(error, "Ошибка генерации"), variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
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
          <p className="text-sm text-muted-foreground">{pack.title}</p>
        </div>
      </div>

      {/* Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="mx-5 mb-4 bg-royal rounded-2xl px-4 py-3.5 flex items-center gap-3">
        <Sparkles size={20} className="text-gold flex-shrink-0" />
        <div>
          <p className="text-base text-swan font-medium">Всё готово для всех площадок</p>
          <p className="text-sm text-swan/60">
            {tabs.length} постов · картинка · карусель · источник: {sourceLabel}
          </p>
        </div>
      </motion.div>

      {/* Platform tabs */}
      <div className="mb-4 px-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((platform) => (
          <button key={platform.id} onClick={() => setActiveTab(platform.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-base font-medium whitespace-nowrap transition-all ${
          activeTab === platform.id ? "bg-royal text-swan" : "bg-white text-sapphire border border-border hover:border-sapphire/50 shadow-card"}`
          }>
              <span>{emojiByPlatform[platform.id]}</span>
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Post card */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-background">
            <span className="text-base font-medium text-royal">{currentPlatform.name}</span>
            <span className="text-sm text-muted-foreground">{currentText.length} / {currentPlatform.charLimit.toLocaleString()} симв.</span>
          </div>
          <div className="px-4 py-4 max-h-64 overflow-y-auto scrollbar-hide">
            <p className="text-base text-foreground leading-relaxed whitespace-pre-line">{currentText}</p>
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
                    onKeyDown={(e) => {if (e.key === "Enter") handleGenerateByChars();}}
                    placeholder={currentPlatform.charLimit.toString()}
                    className="w-full bg-transparent text-sm text-royal focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  
                  <span className="text-xs text-muted-foreground shrink-0">симв.</span>
                </div>
                <button
                  disabled={!targetChars || regenerating}
                  onClick={handleGenerateByChars}
                  className="h-11 px-4 rounded-xl bg-royal text-swan text-sm font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
                  
                  <Sparkles size={14} className={regenerating ? "animate-spin" : ""} />
                  {regenerating ? "Пишу…" : "Сгенерировать"}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleCopy(activeTab, currentText)}
              className={`py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              copiedId === activeTab ? "bg-sapphire/10 text-sapphire" : "bg-background text-royal border border-border hover:border-sapphire/50"}`
              }>
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
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 shadow-card active:scale-[0.98] transition-all text-left">
            
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
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 shadow-card active:scale-[0.98] transition-all text-left">
            
            <div className="w-12 h-12 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
              <LayoutGrid size={24} className="text-sapphire" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-royal">Карусель — 9 слайдов</p>
              <p className="text-sm text-muted-foreground">Редактор текста · шрифт · размер</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
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

      {/* Edit sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="h-[92dvh] flex flex-col rounded-t-2xl px-0 pb-0">
          <SheetHeader className="px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold text-royal">Редактировать текст</SheetTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{editDraft.length} симв.</span>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-xl bg-royal text-swan text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-all">
                  <Check size={14} /> Сохранить
                </button>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 min-h-0 px-5 py-4 overflow-y-auto">
            <textarea
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              className="w-full min-h-full resize-none bg-transparent text-base text-foreground leading-relaxed focus:outline-none"
              style={{ minHeight: "100%" }}
              autoFocus
              spellCheck />
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>);

}