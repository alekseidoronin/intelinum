import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Download, RefreshCw, Check,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, Minus, Plus, Strikethrough } from
"lucide-react";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";

const sizes = [
{ id: "square", label: "1:1", desc: "Пост", w: 1, h: 1 },
{ id: "portrait", label: "4:5", desc: "Верт.", w: 4, h: 5 },
{ id: "story", label: "9:16", desc: "Stories", w: 9, h: 16 }];


const fonts = ["Inter", "Raleway", "Georgia", "Courier New", "Arial"];

const defaultSlides = [
{ id: 1, title: "Число 7", body: "Число духовного поиска. Вы никогда не принимаете ничего на веру." },
{ id: 2, title: "3 главные черты", body: "• Глубокий аналитический ум\n• Феноменальная интуиция\n• Потребность в уединении" },
{ id: 3, title: "Ваш главный урок", body: "Научиться доверять своей интуиции. Парадокс: при всём аналитизме — интуиция феноменальная." },
{ id: 4, title: "В отношениях", body: "Семёрки выбирают партнёров с умом. Им важно интеллектуальное родство." },
{ id: 5, title: "В деньгах", body: "Зарабатывают через знание и экспертизу. Плохо переносят рутину." },
{ id: 6, title: "Совет дня", body: "Сегодня — день для размышлений. Позвольте себе побыть в тишине." },
{ id: 7, title: "Аффирмация", body: "«Моя интуиция всегда знает правильный ответ»" },
{ id: 8, title: "Призыв", body: "Напишите «7» в комментарии, если это про вас 👇\n\n#нумерология #число7" }];


interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: "left" | "center" | "right";
  fontSize: number;
  font: string;
}

interface Slide {
  id: number;
  title: string;
  body: string;
  titleStyle?: Partial<TextStyle>;
  bodyStyle?: Partial<TextStyle>;
}

const defaultStyle: TextStyle = {
  bold: false, italic: false, underline: false, strikethrough: false,
  align: "center", fontSize: 14, font: "Inter"
};

export default function CarouselEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("square");
  const [activeField, setActiveField] = useState<"title" | "body">("body");
  const [regenerating, setRegenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const slide = slides[currentIndex];
  const size = sizes.find((s) => s.id === selectedSize)!;

  const getTitleStyle = (): TextStyle => ({ ...defaultStyle, bold: true, fontSize: 18, font: "Raleway", ...(slide.titleStyle || {}) });
  const getBodyStyle = (): TextStyle => ({ ...defaultStyle, ...(slide.bodyStyle || {}) });
  const currentStyle = activeField === "title" ? getTitleStyle() : getBodyStyle();

  const updateSlide = (field: "title" | "body", value: string) => {
    setSlides((prev) => prev.map((s, i) => i === currentIndex ? { ...s, [field]: value } : s));
  };

  const updateStyle = (field: "title" | "body", update: Partial<TextStyle>) => {
    const key = field === "title" ? "titleStyle" : "bodyStyle";
    setSlides((prev) => prev.map((s, i) =>
    i === currentIndex ? { ...s, [key]: { ...(s[key] || {}), ...update } } : s
    ));
  };

  const toggleStyle = (prop: keyof TextStyle) => {
    updateStyle(activeField, { [prop]: !(currentStyle as any)[prop] });
  };

  const ratio = size.w / size.h;
  const previewW = ratio >= 1 ? 300 : Math.round(300 * ratio);
  const previewH = ratio >= 1 ? Math.round(300 / ratio) : 300;

  const buildTextClass = (style: TextStyle) => {
    const parts: string[] = [];
    if (style.bold) parts.push("font-bold");
    if (style.italic) parts.push("italic");
    if (style.underline && style.strikethrough) parts.push("underline line-through");else
    if (style.underline) parts.push("underline");else
    if (style.strikethrough) parts.push("line-through");
    if (style.align === "left") parts.push("text-left");
    if (style.align === "center") parts.push("text-center");
    if (style.align === "right") parts.push("text-right");
    return parts.join(" ");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
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
          onClick={() => {setDownloaded(true);setTimeout(() => setDownloaded(false), 2000);toast({ description: "ZIP сохранён 📥" });}}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${downloaded ? "bg-sapphire/10 text-sapphire border border-sapphire/30" : "bg-royal text-swan"}`}>
          
          {downloaded ? <Check size={14} /> : <Download size={14} />}
          ZIP
        </button>
      </div>

      {/* Size selector */}
      <div className="px-5 mb-3">
        <div className="flex gap-2">
          {sizes.map((s) =>
          <button key={s.id} onClick={() => setSelectedSize(s.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
          selectedSize === s.id ? "border-royal bg-royal text-swan" : "border-border bg-white text-royal shadow-card"}`
          }>
              {s.label} <span className={selectedSize === s.id ? "text-swan/60" : "text-muted-foreground"}>{s.desc}</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide preview */}
      <div className="flex justify-center px-5 mb-3">
        <div className="relative" style={{ width: previewW + 96 }}>
          {/* Prev */}
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border border-border shadow-card flex items-center justify-center text-sapphire disabled:opacity-30 z-10 transition-all active:scale-95">
            
            <ChevronLeft size={16} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + selectedSize}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ width: previewW, height: previewH }}
              className="mx-12 rounded-2xl bg-gradient-to-br from-royal via-sapphire to-royal/80 border border-border shadow-card flex flex-col justify-center p-5 overflow-hidden">
              
              <div
                className={`text-swan mb-2 ${buildTextClass(getTitleStyle())}`}
                style={{ fontSize: getTitleStyle().fontSize, fontFamily: getTitleStyle().font }}>
                
                {slide.title}
              </div>
              <div
                className={`text-swan/80 whitespace-pre-line ${buildTextClass(getBodyStyle())}`}
                style={{ fontSize: getBodyStyle().fontSize, fontFamily: getBodyStyle().font }}>
                
                {slide.body}
              </div>
              {/* Slide number */}
              
            </motion.div>
          </AnimatePresence>

          {/* Next */}
          <button
            onClick={() => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={currentIndex === slides.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white border border-border shadow-card flex items-center justify-center text-sapphire disabled:opacity-30 z-10 transition-all active:scale-95">
            
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {slides.map((_, i) =>
        <button key={i} onClick={() => setCurrentIndex(i)}
        className={`rounded-full transition-all ${i === currentIndex ? "w-5 h-2 bg-royal" : "w-2 h-2 bg-shell hover:bg-sapphire/40"}`} />

        )}
      </div>

      {/* Text editor panel */}
      <div className="mx-5 bg-white border border-border rounded-2xl overflow-hidden shadow-card mb-3">
        {/* Field selector */}
        <div className="flex border-b border-border">
          {(["title", "body"] as const).map((f) =>
          <button key={f} onClick={() => setActiveField(f)}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeField === f ? "bg-royal/5 text-royal border-b-2 border-royal" : "text-muted-foreground"}`}>
              {f === "title" ? "Заголовок" : "Текст"}
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="px-3 py-2 border-b border-border flex items-center gap-1 flex-wrap">
          {/* Font family */}
          <div className="relative">
            <button onClick={() => setShowFontPicker((v) => !v)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border transition-all ${showFontPicker ? "border-royal bg-royal/5 text-royal" : "border-border text-royal hover:border-sapphire/50"}`}>
              <Type size={12} />
              <span style={{ fontFamily: currentStyle.font }} className="max-w-[56px] truncate">{currentStyle.font}</span>
            </button>
            {showFontPicker &&
            <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-card z-20 overflow-hidden min-w-[130px]">
                {fonts.map((f) =>
              <button key={f} onClick={() => {updateStyle(activeField, { font: f });setShowFontPicker(false);}}
              className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-background ${currentStyle.font === f ? "text-royal font-medium" : "text-foreground"}`}
              style={{ fontFamily: f }}>
                    {f}
                  </button>
              )}
              </div>
            }
          </div>

          <div className="w-px h-5 bg-border mx-0.5" />

          {/* Font size */}
          <button onClick={() => updateStyle(activeField, { fontSize: Math.max(8, currentStyle.fontSize - 1) })}
          className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-royal hover:border-sapphire/50 transition-colors active:scale-90">
            <Minus size={12} />
          </button>
          <span className="text-xs text-royal font-medium w-7 text-center">{currentStyle.fontSize}</span>
          <button onClick={() => updateStyle(activeField, { fontSize: Math.min(48, currentStyle.fontSize + 1) })}
          className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-royal hover:border-sapphire/50 transition-colors active:scale-90">
            <Plus size={12} />
          </button>

          <div className="w-px h-5 bg-border mx-0.5" />

          {/* Style toggles */}
          {[
          { icon: Bold, key: "bold" as const, label: "B" },
          { icon: Italic, key: "italic" as const },
          { icon: Underline, key: "underline" as const },
          { icon: Strikethrough, key: "strikethrough" as const }].
          map(({ icon: Icon, key }) =>
          <button key={key} onClick={() => toggleStyle(key)}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
          currentStyle[key] ? "border-royal bg-royal text-swan" : "border-border text-royal hover:border-sapphire/50"}`
          }>
              <Icon size={13} />
            </button>
          )}

          <div className="w-px h-5 bg-border mx-0.5" />

          {/* Alignment */}
          {[
          { icon: AlignLeft, val: "left" as const },
          { icon: AlignCenter, val: "center" as const },
          { icon: AlignRight, val: "right" as const }].
          map(({ icon: Icon, val }) =>
          <button key={val} onClick={() => updateStyle(activeField, { align: val })}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
          currentStyle.align === val ? "border-royal bg-royal text-swan" : "border-border text-royal hover:border-sapphire/50"}`
          }>
              <Icon size={13} />
            </button>
          )}
        </div>

        {/* Text input */}
        <textarea
          value={activeField === "title" ? slide.title : slide.body}
          onChange={(e) => updateSlide(activeField, e.target.value)}
          rows={activeField === "title" ? 1 : 4}
          className="w-full px-4 py-3 text-sm text-foreground bg-white focus:outline-none resize-none placeholder:text-muted-foreground"
          style={{
            fontFamily: currentStyle.font,
            fontSize: currentStyle.fontSize,
            fontWeight: currentStyle.bold ? "bold" : "normal",
            fontStyle: currentStyle.italic ? "italic" : "normal",
            textDecoration: [currentStyle.underline && "underline", currentStyle.strikethrough && "line-through"].filter(Boolean).join(" ") || "none",
            textAlign: currentStyle.align
          }}
          placeholder={activeField === "title" ? "Заголовок слайда…" : "Текст слайда…"} />
        
      </div>

      {/* Regenerate */}
      <div className="px-5">
        <button
          onClick={() => {setRegenerating(true);setTimeout(() => {setRegenerating(false);toast({ description: "Карусель перегенерирована ✨" });}, 1400);}}
          disabled={regenerating}
          className="w-full py-3.5 rounded-2xl bg-white border border-border text-sapphire text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-card">
          
          <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Генерируется…" : "Перегенерировать карусель"}
        </button>
      </div>
    </div>);

}