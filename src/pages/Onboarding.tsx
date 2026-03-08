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
{ id: "geo", name: "Геометрический", desc: "Мандалы, нумерологические разборы", img: styleGeo }];


const steps = [
{ title: "Добро пожаловать", subtitle: "AI-платформа для нумерологов" },
{ title: "Как вас зовут?", subtitle: "Мы будем обращаться по имени" }];


export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const goNext = () => {
    if (step === 1) {
      navigate("/home");
    } else {
      setStep((s) => s + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-5 relative overflow-hidden pt-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sapphire/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="mb-10 flex items-center justify-center relative z-10">
        <Logo size="lg" vertical />
      </div>

      <div className="w-full max-w-md relative z-10">

        {step === 1





        }

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.4 }}>

            {/* Step 0 — Welcome */}
            {step === 0 &&
            <div className="text-center">
                <h1 className="font-display text-4xl text-royal mb-3 leading-tight">
                  Ваш контент-конвейер<br />на каждый день
                </h1>
                <p className="text-sapphire/80 mb-8 leading-relaxed text-sm">
                  Записи эфиров или актуальные темы → готовый пакет постов для всех площадок за 2 минуты
                </p>
                <div className="space-y-3 mb-8">
                  {["Посты под все площадки в вашем стиле", "Картинки без промптов", "Темы из трендов каждый день"].map((f) =>
                <div key={f} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card border border-border">
                      <Check size={16} className="text-sapphire flex-shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                )}
                </div>
                <button onClick={goNext} className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 hover:bg-sapphire">
                  Начать бесплатно
                </button>
              </div>
            }

            {/* Step 1 — Name */}
            {step === 1 &&
            <div>
                <h2 className="font-display text-3xl text-royal mb-2">{steps[1].title}</h2>
                <p className="text-sapphire/80 mb-6 text-sm">{steps[1].subtitle}</p>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
                onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
                autoFocus />
              
                <button onClick={goNext} disabled={!canProceed()}
              className="w-full mt-5 py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sapphire">
                  Войти в приложение
                </button>
              </div>
            }

          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}