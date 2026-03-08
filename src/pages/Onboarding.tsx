import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
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

const steps = [
  { title: "Добро пожаловать", subtitle: "AI-платформа для нумерологов" },
  { title: "Как вас зовут?", subtitle: "Мы будем обращаться по имени" },
  { title: "Стиль визуала", subtitle: "Выберите, как будут выглядеть ваши картинки" },
  { title: "Всё готово!", subtitle: "" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const goNext = () => {
    if (step === 2) {
      setStep(3);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => navigate("/home"), 600);
        }
        setLoadingProgress(Math.min(p, 100));
      }, 400);
    } else {
      setStep(s => s + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return selectedStyle !== "";
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sapphire/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Logo size="lg" vertical />
        </div>

        {step < 4 && (
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-royal w-8" : "bg-shell w-4"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="text-center">
                <h1 className="font-display text-4xl text-royal mb-3 leading-tight">
                  Ваш контент-конвейер<br />на каждый день
                </h1>
                <p className="text-sapphire/80 mb-8 leading-relaxed text-sm">
                  Записи эфиров или актуальные темы → готовый пакет постов для всех площадок за 2 минуты
                </p>
                <div className="space-y-3 mb-8">
                  {["Посты под все площадки в вашем стиле", "Картинки без промптов", "Темы из трендов каждый день"].map(f => (
                    <div key={f} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card border border-border">
                      <Check size={16} className="text-sapphire flex-shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 hover:bg-sapphire"
                >
                  Начать бесплатно
                </button>
              </div>
            )}

            {/* Step 1 — Name */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-2">{steps[step].title}</h2>
                <p className="text-sapphire/80 mb-6 text-sm">{steps[step].subtitle}</p>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
                  onKeyDown={e => e.key === "Enter" && canProceed() && goNext()}
                  autoFocus
                />
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="w-full mt-5 py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sapphire"
                >
                  Продолжить
                </button>
              </div>
            )}


            {/* Step 3 — Style */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-2">{steps[step].title}</h2>
                <p className="text-sapphire/80 mb-5 text-sm">{steps[step].subtitle}</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {styles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`p-4 rounded-2xl text-left transition-all active:scale-95 relative bg-white ${
                        selectedStyle === s.id
                          ? "border-2 border-sapphire shadow-card"
                          : "border border-border hover:border-sapphire/50"
                      }`}
                    >
                      {selectedStyle === s.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sapphire flex items-center justify-center">
                          <Check size={11} className="text-swan" />
                        </div>
                      )}
                      <div className="w-full h-24 rounded-xl overflow-hidden mb-2">
                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire"
                >
                  Готово
                </button>
              </div>
            )}

            {/* Step 4 — Loading */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-shell" />
                  <div className="absolute inset-0 rounded-full border-2 border-sapphire border-t-transparent animate-spin" style={{ animationDuration: "1.5s" }} />
                  <Sparkles className="absolute inset-0 m-auto text-sapphire animate-pulse" size={32} />
                </div>
                <h2 className="font-display text-3xl text-royal mb-3">Изучаем ваш стиль...</h2>
                <p className="text-muted-foreground mb-6 text-sm">Наш помощник анализирует ваши тексты</p>
                <div className="w-full bg-shell rounded-full h-2 mb-2">
                  <motion.div className="h-2 rounded-full bg-sapphire" animate={{ width: `${loadingProgress}%` }} transition={{ duration: 0.4 }} />
                </div>
                <div className="text-xs text-muted-foreground">{Math.round(loadingProgress)}%</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
