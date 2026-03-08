import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Download, RefreshCw, Check,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Minus, Plus, Strikethrough, Trash2, ChevronDown,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { SlideCanvas } from "@/components/carousel/SlideCanvas";
import { ColorPicker } from "@/components/carousel/ColorPicker";
import {
  FONTS, TEXT_BG_COLORS, BG_GRADIENTS, BG_SOLID_COLORS,
  DEFAULT_TITLE_STYLE, DEFAULT_BODY_STYLE,
  TextElement, SlideData, TextStyle,
} from "@/components/carousel/types";

const sizes = [
  { id: "square", label: "1:1", desc: "Пост", w: 1, h: 1 },
  { id: "portrait", label: "4:5", desc: "Верт.", w: 4, h: 5 },
  { id: "story", label: "9:16", desc: "Stories", w: 9, h: 16 },
];

let _id = 100;
const uid = () => `el-${++_id}`;

const makeSlide = (id: number, title: string, body: string, bgValue: string): SlideData => ({
  id,
  elements: [
    { id: uid(), text: title, x: 5, y: 22, width: 90, style: { ...DEFAULT_TITLE_STYLE } },
    { id: uid(), text: body, x: 5, y: 46, width: 90, style: { ...DEFAULT_BODY_STYLE } },
  ],
  bg: { type: "gradient", value: bgValue },
});

const initialSlides: SlideData[] = [
  makeSlide(1, "Число 7", "Число духовного поиска. Вы никогда не принимаете ничего на веру.", BG_GRADIENTS[0]),
  makeSlide(2, "3 главные черты", "• Глубокий аналитический ум\n• Феноменальная интуиция\n• Потребность в уединении", BG_GRADIENTS[1]),
  makeSlide(3, "Ваш главный урок", "Научиться доверять своей интуиции. При всём аналитизме — интуиция феноменальная.", BG_GRADIENTS[2]),
  makeSlide(4, "В отношениях", "Семёрки выбирают партнёров с умом. Им важно интеллектуальное родство.", BG_GRADIENTS[0]),
  makeSlide(5, "В деньгах", "Зарабатывают через знание и экспертизу. Плохо переносят рутину.", BG_GRADIENTS[4]),
  makeSlide(6, "Совет дня", "Сегодня — день для размышлений. Позвольте себе побыть в тишине.", BG_GRADIENTS[6]),
  makeSlide(7, "Аффирмация", "«Моя интуиция всегда знает правильный ответ»", BG_GRADIENTS[5]),
  makeSlide(8, "Призыв", "Напишите «7» в комментарии, если это про вас 👇\n\n#нумерология #число7", BG_GRADIENTS[7]),
  makeSlide(9, "Ваш путь", "Семёрки — великие аналитики и исследователи. Ваш путь — через знание к мудрости. 🌟", BG_GRADIENTS[3]),
];

type ActiveTab = "text" | "slide";
type ColorTarget = "textColor" | "textBg" | null;
type BgSubTab = "gradient" | "solid";

const CHECKER =
  "repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,#ccc 0,#ccc 2px,transparent 0,transparent 50%)";

export default function CarouselEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("square");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("text");
  const [colorTarget, setColorTarget] = useState<ColorTarget>(null);
  const [bgSubTab, setBgSubTab] = useState<BgSubTab>("gradient");
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [customGradFrom, setCustomGradFrom] = useState("#112250");
  const [customGradTo, setCustomGradTo] = useState("#3C507D");
  const [customGradDir, setCustomGradDir] = useState("135deg");
  const [customGradActive, setCustomGradActive] = useState<"from" | "to" | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const slide = slides[currentIndex];
  const selectedEl = selectedId ? slide.elements.find((e) => e.id === selectedId) : null;
  const style = selectedEl?.style;

  const size = sizes.find((s) => s.id === selectedSize)!;
  const ratio = size.w / size.h;
  const previewW = ratio >= 1 ? 300 : Math.round(300 * ratio);
  const previewH = ratio >= 1 ? Math.round(300 / ratio) : 300;

  const goTo = (i: number) => {
    setCurrentIndex(i);
    setSelectedId(null);
    setColorTarget(null);
    setShowFontPicker(false);
  };

  const updateElement = useCallback(
    (id: string, updates: Partial<TextElement>) => {
      setSlides((prev) =>
        prev.map((s, i) =>
          i === currentIndex
            ? { ...s, elements: s.elements.map((e) => (e.id === id ? { ...e, ...updates } : e)) }
            : s
        )
      );
    },
    [currentIndex]
  );

  const updateStyle = useCallback(
    (updates: Partial<TextStyle>) => {
      if (!selectedId) return;
      setSlides((prev) =>
        prev.map((s, i) =>
          i === currentIndex
            ? {
                ...s,
                elements: s.elements.map((e) =>
                  e.id === selectedId ? { ...e, style: { ...e.style, ...updates } } : e
                ),
              }
            : s
        )
      );
    },
    [currentIndex, selectedId]
  );

  const updateBg = useCallback(
    (value: string, type: "gradient" | "solid") => {
      setSlides((prev) =>
        prev.map((s, i) => (i === currentIndex ? { ...s, bg: { type, value } } : s))
      );
    },
    [currentIndex]
  );

  const addText = () => {
    const el: TextElement = {
      id: uid(), text: "Новый текст", x: 10, y: 10, width: 80,
      style: { ...DEFAULT_BODY_STYLE },
    };
    setSlides((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, elements: [...s.elements, el] } : s))
    );
    setSelectedId(el.id);
    setActiveTab("text");
    setColorTarget(null);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setSlides((prev) =>
      prev.map((s, i) =>
        i === currentIndex ? { ...s, elements: s.elements.filter((e) => e.id !== selectedId) } : s
      )
    );
    setSelectedId(null);
  };

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    if (id) setActiveTab("text");
    setColorTarget(null);
    setShowFontPicker(false);
  };

  const toggleStyle = (prop: "bold" | "italic" | "underline" | "strikethrough") => {
    if (!style) return;
    updateStyle({ [prop]: !style[prop] });
  };

  return (
    <div className="min-h-screen bg-background pb-6" onClick={() => setShowFontPicker(false)}>
      <TopBar />

      {/* Header */}
      <div className="px-5 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-border bg-white flex items-center justify-center text-sapphire shadow-card">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl text-royal">Карусель</h1>
          <p className="text-xs text-muted-foreground">Слайд {currentIndex + 1} из {slides.length}</p>
        </div>
        <button
          onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2000); toast({ description: "ZIP сохранён 📥" }); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${downloaded ? "bg-sapphire/10 text-sapphire border border-sapphire/30" : "bg-royal text-swan"}`}
        >
          {downloaded ? <Check size={14} /> : <Download size={14} />}
          ZIP
        </button>
      </div>

      {/* Size selector */}
      <div className="px-5 mb-3">
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button key={s.id} onClick={() => setSelectedSize(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
                selectedSize === s.id ? "border-royal bg-royal text-swan" : "border-border bg-white text-royal shadow-card"
              }`}>
              {s.label} <span className={selectedSize === s.id ? "text-swan/60" : "text-muted-foreground"}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide preview */}
      <div className="flex justify-center px-5 mb-3">
        <div className="relative" style={{ width: previewW + 96 }}>
          <button onClick={() => goTo(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border border-border shadow-card flex items-center justify-center text-sapphire disabled:opacity-30 z-10 transition-all active:scale-95">
            <ChevronLeft size={16} />
          </button>
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex + selectedSize}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="mx-12">
              <SlideCanvas slide={slide} selectedId={selectedId} onSelect={handleSelect}
                onUpdateElement={updateElement} width={previewW} height={previewH} />
            </motion.div>
          </AnimatePresence>
          <button onClick={() => goTo(Math.min(slides.length - 1, currentIndex + 1))} disabled={currentIndex === slides.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border border-border shadow-card flex items-center justify-center text-sapphire disabled:opacity-30 z-10 transition-all active:scale-95">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1 mb-3 flex-wrap px-8">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === currentIndex ? "w-5 h-2 bg-royal" : "w-2 h-2 bg-shell hover:bg-sapphire/40"}`} />
        ))}
      </div>

      {/* Toolbar */}
      <div className="mx-5 bg-white border border-border rounded-2xl overflow-hidden shadow-card mb-3" onClick={(e) => e.stopPropagation()}>
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["text", "slide"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-royal/5 text-royal border-b-2 border-royal" : "text-muted-foreground"
              }`}>
              {tab === "text" ? "Текст" : "Слайд"}
            </button>
          ))}
        </div>

        {/* ── TEXT TAB ── */}
        {activeTab === "text" && (
          <div>
            {/* Actions */}
            <div className="px-3 py-2 flex gap-2 border-b border-border">
              <button onClick={addText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-royal text-xs font-medium hover:bg-background transition-colors active:scale-95">
                <Plus size={12} /> Добавить текст
              </button>
              {selectedEl && (
                <button onClick={deleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors active:scale-95">
                  <Trash2 size={12} /> Удалить
                </button>
              )}
            </div>

            {!selectedEl ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Нажмите на текст на слайде чтобы редактировать
              </div>
            ) : (
              <>
                {/* Font picker – dropdown */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowFontPicker((v) => !v); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm w-full transition-all ${
                        showFontPicker ? "border-royal bg-royal/5 text-royal" : "border-border text-foreground hover:border-sapphire/50"
                      }`}
                      style={{ fontFamily: style?.font }}
                    >
                      <span className="flex-1 text-left truncate">{style?.font}</span>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showFontPicker ? "rotate-180" : ""}`} />
                    </button>
                    {showFontPicker && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-card z-30 overflow-hidden max-h-52 overflow-y-auto">
                        {FONTS.map((f) => (
                          <button key={f}
                            onClick={() => { updateStyle({ font: f }); setShowFontPicker(false); }}
                            style={{ fontFamily: f }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-background ${
                              style?.font === f ? "text-royal font-semibold bg-royal/5" : "text-foreground"
                            }`}>
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Size + style + alignment */}
                <div className="px-3 py-2 border-b border-border flex items-center gap-1 flex-wrap">
                  <button onClick={() => updateStyle({ fontSize: Math.max(8, (style?.fontSize || 14) - 1) })}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-royal hover:border-sapphire/50 transition-colors active:scale-90">
                    <Minus size={12} />
                  </button>
                  <span className="text-xs text-royal font-medium w-7 text-center">{style?.fontSize}</span>
                  <button onClick={() => updateStyle({ fontSize: Math.min(72, (style?.fontSize || 14) + 1) })}
                    className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-royal hover:border-sapphire/50 transition-colors active:scale-90">
                    <Plus size={12} />
                  </button>

                  <div className="w-px h-5 bg-border mx-0.5" />

                  {([
                    { icon: Bold, key: "bold" as const },
                    { icon: Italic, key: "italic" as const },
                    { icon: Underline, key: "underline" as const },
                    { icon: Strikethrough, key: "strikethrough" as const },
                  ] as const).map(({ icon: Icon, key }) => (
                    <button key={key} onClick={() => toggleStyle(key)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                        style?.[key] ? "border-royal bg-royal text-swan" : "border-border text-royal hover:border-sapphire/50"
                      }`}>
                      <Icon size={13} />
                    </button>
                  ))}

                  <div className="w-px h-5 bg-border mx-0.5" />

                  {([
                    { icon: AlignLeft, val: "left" as const },
                    { icon: AlignCenter, val: "center" as const },
                    { icon: AlignRight, val: "right" as const },
                  ] as const).map(({ icon: Icon, val }) => (
                    <button key={val} onClick={() => updateStyle({ align: val })}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
                        style?.align === val ? "border-royal bg-royal text-swan" : "border-border text-royal hover:border-sapphire/50"
                      }`}>
                      <Icon size={13} />
                    </button>
                  ))}
                </div>

                {/* Color controls */}
                <div className="px-3 py-2 border-b border-border">
                  {/* Toggle buttons */}
                  <div className="flex gap-2 mb-2.5">
                    <button onClick={() => setColorTarget((v) => (v === "textColor" ? null : "textColor"))}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        colorTarget === "textColor" ? "border-royal bg-royal/5 text-royal" : "border-border text-foreground"
                      }`}>
                      <div className="w-3.5 h-3.5 rounded-sm border border-black/20" style={{ backgroundColor: style?.color || "#fff" }} />
                      Цвет текста
                    </button>
                    <button onClick={() => setColorTarget((v) => (v === "textBg" ? null : "textBg"))}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        colorTarget === "textBg" ? "border-royal bg-royal/5 text-royal" : "border-border text-foreground"
                      }`}>
                      <div className="w-3.5 h-3.5 rounded-sm border border-black/20"
                        style={{
                          backgroundColor: style?.bgColor === "transparent" ? undefined : style?.bgColor,
                          backgroundImage: style?.bgColor === "transparent" ? CHECKER : undefined,
                          backgroundSize: "6px 6px",
                        }} />
                      Подложка
                    </button>
                  </div>

                  {/* Full color picker for text color */}
                  {colorTarget === "textColor" && (
                    <ColorPicker
                      key={selectedId + "-color"}
                      color={style?.color || "#ffffff"}
                      onChange={(c) => updateStyle({ color: c })}
                    />
                  )}

                  {/* Full color picker for text background */}
                  {colorTarget === "textBg" && (
                    <div className="space-y-2">
                      <button
                        onClick={() => updateStyle({ bgColor: "transparent" })}
                        className={`w-full h-9 rounded-xl border-2 flex items-center justify-center text-xs text-muted-foreground transition-all ${
                          style?.bgColor === "transparent" ? "border-royal text-royal font-medium" : "border-border hover:border-sapphire/50"
                        }`}
                        style={{ backgroundImage: CHECKER, backgroundSize: "8px 8px" }}
                      >
                        Прозрачный
                      </button>
                      <ColorPicker
                        key={selectedId + "-bg"}
                        color={style?.bgColor === "transparent" ? "#000000" : (style?.bgColor || "#000000")}
                        onChange={(c) => updateStyle({ bgColor: c })}
                      />
                    </div>
                  )}
                </div>

                {/* Textarea */}
                <textarea
                  value={selectedEl.text}
                  onChange={(e) => updateElement(selectedId!, { text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-foreground bg-white focus:outline-none resize-none placeholder:text-muted-foreground"
                  style={{ fontFamily: style?.font, textAlign: style?.align }}
                  placeholder="Текст элемента…"
                />
              </>
            )}
          </div>
        )}

        {/* ── SLIDE TAB ── */}
        {activeTab === "slide" && (
          <div className="p-3">
            <div className="flex gap-1 bg-background rounded-xl p-1 mb-3">
              {(["gradient", "solid"] as const).map((t) => (
                <button key={t} onClick={() => setBgSubTab(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    bgSubTab === t ? "bg-white text-royal shadow-card" : "text-muted-foreground"
                  }`}>
                  {t === "gradient" ? "Градиент" : "Цвет"}
                </button>
              ))}
            </div>

            {bgSubTab === "gradient" && (
              <div className="grid grid-cols-4 gap-2">
                {BG_GRADIENTS.map((g) => (
                  <button key={g} onClick={() => updateBg(g, "gradient")}
                    style={{ background: g }}
                    className={`h-14 rounded-xl border-2 transition-all ${
                      slide.bg.value === g ? "border-royal scale-105 shadow-card" : "border-transparent hover:border-border"
                    }`} />
                ))}
              </div>
            )}

            {bgSubTab === "solid" && (
              <ColorPicker
                key={`bg-${currentIndex}`}
                color={slide.bg.type === "solid" ? slide.bg.value : "#112250"}
                onChange={(c) => updateBg(c, "solid")}
              />
            )}
          </div>
        )}
      </div>

      {/* Regenerate */}
      <div className="px-5">
        <button
          onClick={() => { setRegenerating(true); setTimeout(() => { setRegenerating(false); toast({ description: "Карусель перегенерирована ✨" }); }, 1400); }}
          disabled={regenerating}
          className="w-full py-3.5 rounded-2xl bg-white border border-border text-sapphire text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-card">
          <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Генерируется…" : "Перегенерировать карусель"}
        </button>
      </div>
    </div>
  );
}
