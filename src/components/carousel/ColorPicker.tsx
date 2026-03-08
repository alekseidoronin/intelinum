import { useRef, useState, useCallback } from "react";

interface Props {
  color: string;
  onChange: (color: string) => void;
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round(255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

function safeToHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m)
    return `#${[m[1], m[2], m[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, "0"))
      .join("")}`;
  return "#ffffff";
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [h, s, v];
}

export function ColorPicker({ color, onChange }: Props) {
  const hex0 = safeToHex(color);
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(hex0));
  const [hexInput, setHexInput] = useState(hex0);

  const squareRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const applyHsv = useCallback(
    (h: number, s: number, v: number) => {
      setHsv([h, s, v]);
      const hex = hsvToHex(h, s, v);
      setHexInput(hex);
      onChange(hex);
    },
    [onChange]
  );

  const handleSquare = useCallback(
    (clientX: number, clientY: number) => {
      if (!squareRef.current) return;
      const rect = squareRef.current.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      applyHsv(hsv[0], s, v);
    },
    [hsv, applyHsv]
  );

  const handleHue = useCallback(
    (clientX: number) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const h = Math.max(0, Math.min(359, ((clientX - rect.left) / rect.width) * 360));
      applyHsv(h, hsv[1], hsv[2]);
    },
    [hsv, applyHsv]
  );

  const pureHue = hsvToHex(hsv[0], 1, 1);
  const currentHex = hsvToHex(...hsv);

  return (
    <div className="space-y-2.5">
      {/* Saturation / Value square */}
      <div
        ref={squareRef}
        className="relative w-full rounded-xl overflow-hidden cursor-crosshair"
        style={{ height: 160 }}
        onMouseDown={(e) => handleSquare(e.clientX, e.clientY)}
        onMouseMove={(e) => { if (e.buttons === 1) handleSquare(e.clientX, e.clientY); }}
        onTouchStart={(e) => { e.preventDefault(); handleSquare(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchMove={(e) => { e.preventDefault(); handleSquare(e.touches[0].clientX, e.touches[0].clientY); }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: pureHue }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, white, transparent)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, black)" }} />
        {/* Cursor */}
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `${hsv[1] * 100}%`,
            top: `${(1 - hsv[2]) * 100}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: currentHex,
            boxShadow: "0 0 0 2px white, 0 0 0 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Hue bar */}
      <div
        ref={hueRef}
        className="relative h-6 rounded-xl cursor-pointer"
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
        onMouseDown={(e) => handleHue(e.clientX)}
        onMouseMove={(e) => { if (e.buttons === 1) handleHue(e.clientX); }}
        onTouchStart={(e) => { e.preventDefault(); handleHue(e.touches[0].clientX); }}
        onTouchMove={(e) => { e.preventDefault(); handleHue(e.touches[0].clientX); }}
      >
        <div
          className="absolute top-0.5 bottom-0.5 w-2 rounded-sm pointer-events-none"
          style={{
            left: `${(hsv[0] / 360) * 100}%`,
            transform: "translateX(-50%)",
            backgroundColor: "white",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
          }}
        />
      </div>

      {/* Preview + hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-9 rounded-xl border border-border flex-shrink-0"
          style={{ backgroundColor: currentHex }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              const [h, s, v] = hexToHsv(e.target.value);
              setHsv([h, s, v]);
              onChange(e.target.value);
            }
          }}
          className="flex-1 px-3 py-2 rounded-xl border border-border text-sm font-mono text-foreground bg-background focus:outline-none focus:border-royal"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
