import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Image, TrendingUp } from "lucide-react";
import { Logo } from "@/components/Logo";

const features = [
  { icon: Zap, text: "Посты под все площадки в вашем стиле" },
  { icon: Image, text: "Картинки без промптов" },
  { icon: TrendingUp, text: "Темы из трендов каждый день" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const goNext = () => {
    if (step === 1) {
      localStorage.setItem("userName", name.trim());
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
    <div
      className="min-h-screen flex flex-col items-center px-5 relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold)) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold)) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 left-[-80px] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(var(--sapphire)) 0%, transparent 70%)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--swan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--swan)) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
      </div>

      {/* Logo */}
      <div className="mt-14 mb-10 flex items-center justify-center relative z-10">
        <Logo size="lg" vertical />
      </div>

      <div className="w-full max-w-sm relative z-10 flex-1 flex flex-col pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1"
          >
            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="flex flex-col flex-1">
                {/* Headline */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border"
                    style={{
                      background: "hsl(var(--gold) / 0.12)",
                      borderColor: "hsl(var(--gold) / 0.3)",
                    }}>
                    <Sparkles size={13} style={{ color: "hsl(var(--gold))" }} />
                    <span className="text-xs font-medium" style={{ color: "hsl(var(--gold))" }}>
                      AI-платформа для авторов
                    </span>
                  </div>

                  <h1
                    className="font-display text-4xl leading-[1.15] mb-4"
                    style={{ color: "hsl(var(--swan))" }}
                  >
                    Контент за<br />
                    <span style={{
                      background: "var(--gradient-gold)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      2 минуты
                    </span>
                  </h1>

                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--swan) / 0.65)" }}>
                    Запись эфира или тема → готовый пакет постов<br />для всех площадок
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-10">
                  {features.map(({ icon: Icon, text }, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                      className="flex items-center gap-4 rounded-2xl px-5 py-4"
                      style={{
                        background: "hsl(var(--swan) / 0.07)",
                        border: "1px solid hsl(var(--swan) / 0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "hsl(var(--gold) / 0.18)" }}>
                        <Icon size={16} style={{ color: "hsl(var(--gold))" }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: "hsl(var(--swan) / 0.9)" }}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  onClick={goNext}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-5 rounded-2xl font-bold text-lg relative overflow-hidden"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "hsl(var(--royal))",
                    boxShadow: "var(--shadow-gold), 0 0 60px hsl(var(--gold) / 0.35)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles size={18} />
                    Начать бесплатно
                  </span>
                </motion.button>

                <p className="text-center text-xs mt-4" style={{ color: "hsl(var(--swan) / 0.4)" }}>
                  Без карты. Без обязательств.
                </p>
              </div>
            )}

            {/* Step 1 — Name */}
            {step === 1 && (
              <div>
                <h2
                  className="font-display text-3xl mb-2"
                  style={{ color: "hsl(var(--swan))" }}
                >
                  Как вас зовут?
                </h2>
                <p className="text-sm mb-6" style={{ color: "hsl(var(--swan) / 0.6)" }}>
                  Мы будем обращаться по имени
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-5 py-4 rounded-2xl text-lg focus:outline-none transition-all"
                  style={{
                    background: "hsl(var(--swan) / 0.1)",
                    border: "1px solid hsl(var(--swan) / 0.2)",
                    color: "hsl(var(--swan))",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
                  autoFocus
                />
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="w-full mt-5 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "hsl(var(--royal))",
                    boxShadow: canProceed() ? "var(--shadow-gold)" : "none",
                  }}
                >
                  Войти в приложение
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
