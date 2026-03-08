import { useRef, useState, useCallback } from "react";
import { TextElement, SlideData } from "./types";

interface DragState {
  id: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}

interface Props {
  slide: SlideData;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<TextElement>) => void;
  width: number;
  height: number;
}

export function SlideCanvas({ slide, selectedId, onSelect, onUpdateElement, width, height }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const getBgStyle = (): React.CSSProperties =>
    slide.bg.type === "gradient"
      ? { background: slide.bg.value }
      : { backgroundColor: slide.bg.value };

  const startDrag = (id: string, clientX: number, clientY: number, el: TextElement) => {
    onSelect(id);
    setDrag({ id, startX: clientX, startY: clientY, origX: el.x, origY: el.y });
  };

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!drag || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = ((clientX - drag.startX) / rect.width) * 100;
    const dy = ((clientY - drag.startY) / rect.height) * 100;
    onUpdateElement(drag.id, {
      x: Math.max(0, Math.min(85, drag.origX + dx)),
      y: Math.max(0, Math.min(90, drag.origY + dy)),
    });
  }, [drag, onUpdateElement]);

  const stopDrag = () => setDrag(null);

  return (
    <div
      ref={canvasRef}
      style={{ width, height, ...getBgStyle() }}
      className="relative rounded-2xl overflow-hidden border border-border shadow-card select-none"
      onClick={(e) => { if (e.target === canvasRef.current) onSelect(null); }}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={stopDrag}
    >
      {slide.elements.map((el) => {
        const isSelected = selectedId === el.id;
        const textDeco = [
          el.style.underline && "underline",
          el.style.strikethrough && "line-through",
        ].filter(Boolean).join(" ") || "none";

        const hasBg = el.style.bgColor !== "transparent";

        return (
          <div
            key={el.id}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startDrag(el.id, e.clientX, e.clientY, el); }}
            onTouchStart={(e) => { e.stopPropagation(); startDrag(el.id, e.touches[0].clientX, e.touches[0].clientY, el); }}
            style={{
              position: "absolute",
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.width}%`,
              fontFamily: el.style.font,
              fontSize: el.style.fontSize,
              fontWeight: el.style.bold ? "bold" : "normal",
              fontStyle: el.style.italic ? "italic" : "normal",
              textDecoration: textDeco,
              textAlign: el.style.align,
              color: el.style.color,
              backgroundColor: hasBg ? el.style.bgColor : undefined,
              padding: hasBg ? "4px 8px" : undefined,
              borderRadius: hasBg ? "4px" : undefined,
              cursor: drag?.id === el.id ? "grabbing" : "grab",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              outline: isSelected ? "2px dashed rgba(255,255,255,0.8)" : "2px solid transparent",
              outlineOffset: "3px",
              lineHeight: 1.35,
            }}
          >
            {el.text}
          </div>
        );
      })}
    </div>
  );
}
