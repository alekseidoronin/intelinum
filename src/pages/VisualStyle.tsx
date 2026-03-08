import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import styleRealistic from "@/assets/style-realistic.jpg";
import styleMinimal from "@/assets/style-minimal.jpg";
import styleCozy from "@/assets/style-cozy.jpg";
import styleGloss from "@/assets/style-gloss.jpg";
import styleCosmic from "@/assets/style-cosmic.jpg";
import styleGeo from "@/assets/style-geo.jpg";

const styles = [
  { id: "realistic", name: "Реалистичный", desc: "Живые люди, природа, доверие", img: styleRealistic },
  { id: "minimal", name: "Минимализм", desc: "Чистые линии, пространство", img: styleMinimal },
  { id: "cozy", name: "Тёплый уют", desc: "Свечи, текстуры, личные истории", img: styleCozy },
  { id: "gloss", name: "Глянец", desc: "Яркие градиенты, продажи", img: styleGloss },
  { id: "cosmic", name: "Космический", desc: "Звёзды, прогнозы, предсказания", img: styleCosmic },
  { id: "geo", name: "Геометрический", desc: "Мандалы, нумерологические разборы", img: styleGeo },
];

export default function VisualStyle() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />
      <div className="px-5 pt-4">
        <button onClick={() => navigate("/profile")}
          className="flex items-center gap-1.5 text-sm text-sapphire mb-5 active:opacity-60 transition-opacity">
          <ArrowLeft size={16} />
          Назад
        </button>

        <h1 className="font-display text-2xl text-royal mb-1">Стиль визуала</h1>
        <p className="text-sm text-muted-foreground mb-6">Выберите, как будут выглядеть ваши картинки и карусели</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {styles.map((s, i) => (
            <motion.button key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(s.id)}
              className={`p-4 rounded-2xl text-left transition-all active:scale-95 relative bg-white ${
                selected === s.id ? "border-2 border-sapphire shadow-card" : "border border-border hover:border-sapphire/50"
              }`}>
              {selected === s.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sapphire flex items-center justify-center">
                  <Check size={11} className="text-swan" />
                </div>
              )}
              <div className="w-full h-24 rounded-xl overflow-hidden mb-2">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-sm font-medium text-foreground">{s.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
            </motion.button>
          ))}
        </div>

        <button onClick={handleSave} disabled={!selected}
          className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire flex items-center justify-center gap-2">
          {saved ? <><Check size={16} /> Сохранено!</> : "Сохранить"}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
