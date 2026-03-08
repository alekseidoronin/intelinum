export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: "left" | "center" | "right";
  fontSize: number;
  font: string;
  color: string;
  bgColor: string;
}

export interface TextElement {
  id: string;
  text: string;
  x: number; // % of canvas width
  y: number; // % of canvas height
  width: number; // % of canvas width
  style: TextStyle;
}

export interface SlideBackground {
  type: "gradient" | "solid";
  value: string;
}

export interface SlideData {
  id: number;
  elements: TextElement[];
  bg: SlideBackground;
}

export const FONTS = [
  "Inter", "Raleway", "Georgia", "Arial",
  "Courier New", "Montserrat", "Oswald", "Lato",
  "Nunito", "Poppins", "Playfair Display", "Merriweather",
];

export const TEXT_COLORS = [
  "#FFFFFF", "#F5F0E9", "#BFDBFE", "#93C5FD",
  "#000000", "#112250", "#3C507D", "#1E40AF",
  "#E0C58F", "#FCD34D", "#F59E0B", "#EF4444",
  "#22C55E", "#A855F7", "#EC4899", "#64748B",
];

export const TEXT_BG_COLORS = [
  "transparent",
  "rgba(0,0,0,0.4)",
  "rgba(0,0,0,0.65)",
  "rgba(255,255,255,0.15)",
  "rgba(255,255,255,0.3)",
  "rgba(17,34,80,0.75)",
  "rgba(60,80,125,0.6)",
  "rgba(224,197,143,0.65)",
];

export const BG_GRADIENTS = [
  "linear-gradient(135deg, #112250 0%, #3C507D 100%)",
  "linear-gradient(135deg, #0a1628 0%, #112250 100%)",
  "linear-gradient(160deg, #0f1a2e 0%, #1a2e50 50%, #3C507D 100%)",
  "linear-gradient(135deg, #3C507D 0%, #93C5FD 100%)",
  "linear-gradient(135deg, #112250 0%, #E0C58F 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #3C507D 100%)",
  "linear-gradient(135deg, #000000 0%, #112250 100%)",
  "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
  "linear-gradient(135deg, #0f766e 0%, #3C507D 100%)",
  "linear-gradient(135deg, #F5F0E9 0%, #D9CBC2 100%)",
  "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
  "linear-gradient(135deg, #E0C58F 0%, #FCD34D 100%)",
];

export const BG_SOLID_COLORS = [
  "#112250", "#0a1628", "#000000", "#18181B",
  "#3C507D", "#1E40AF", "#7C3AED", "#0f766e",
  "#FFFFFF", "#F5F0E9", "#D9CBC2", "#E0C58F",
  "#EF4444", "#F97316", "#22C55E", "#EC4899",
];

export const DEFAULT_TITLE_STYLE: TextStyle = {
  bold: true, italic: false, underline: false, strikethrough: false,
  align: "center", fontSize: 22, font: "Raleway",
  color: "#FFFFFF", bgColor: "transparent",
};

export const DEFAULT_BODY_STYLE: TextStyle = {
  bold: false, italic: false, underline: false, strikethrough: false,
  align: "center", fontSize: 14, font: "Inter",
  color: "rgba(255,255,255,0.85)", bgColor: "transparent",
};

export const DEFAULT_BG: SlideBackground = {
  type: "gradient",
  value: "linear-gradient(135deg, #112250 0%, #3C507D 100%)",
};
