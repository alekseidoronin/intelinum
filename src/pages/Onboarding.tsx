import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Image, TrendingUp } from "lucide-react";
import logoImg from "@/assets/logo.png";

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
      className="min-h-screen flex flex-col items-center px-6 relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Soft radial glow only — no grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.18) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[-100px] right-[-80px] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.1) 0%, transparent 65%)" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative z-10 flex flex-col min-h-screen pb-10"
        >
          {/* ── Step 0 ── */}
          {step === 0 && (
            <div className="flex flex-col flex-1 pt-14">

              {/* Logo block — large and prominent */}
              <motion.div
                className="flex flex-col items-center mb-8"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={logoImg}
                  alt="ИНТЕЛИНУМ"
                  className="object-contain mb-5"
                  style={{ width: 110, height: 110, filter: "drop-shadow(0 0 24px hsl(var(--gold) / 0.5))" }}
                />

                <span
                  className="font-display font-bold tracking-[0.22em] uppercase"
                  style={{
                    fontSize: 26,
                    background: "var(--gradient-gold)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ИНТЕЛИНУМ
                </span>

                <span
                  className="text-xs tracking-widest uppercase mt-1"
                  style={{ color: "hsl(var(--swan) / 0.4)", letterSpacing: "0.2em" }}
                >
                  AI-платформа для авторов
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <h1
                  className="font-display font-bold leading-[1.1] mb-4"
                  style={{ fontSize: 36, color: "hsl(var(--swan))" }}
                >
                  Готовый контент<br />
                  <span
                    style={{
                      background: "var(--gradient-gold)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    за 2 минуты
                  </span>
                </h1>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "hsl(var(--swan) / 0.6)" }}
                >
                  Тема или запись эфира → пакет постов<br />для всех площадок в вашем стиле
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-3 mb-10">
                {features.map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.45, ease: "easeOut" }}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                    style={{
                      background: "hsl(var(--swan) / 0.06)",
                      border: "1px solid hsl(var(--swan) / 0.1)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(var(--gold) / 0.2)" }}
                    >
                      <Icon size={15} style={{ color: "hsl(var(--gold))" }} />
                    </div>
                    <span className="text-sm" style={{ color: "hsl(var(--swan) / 0.85)" }}>
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                onClick={goNext}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.45 }}
                whileHover={{ scale: 1.015, boxShadow: "0 0 36px hsl(var(--gold) / 0.55), 0 6px 20px hsl(var(--gold) / 0.3)" }}
                whileTap={{ scale: 0.985, boxShadow: "0 0 52px hsl(var(--gold) / 0.75), 0 8px 28px hsl(var(--gold) / 0.5)" }}
                className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                style={{
                  background: "var(--gradient-gold)",
                  color: "hsl(var(--royal))",
                  fontSize: 17,
                }}
              >
                <Sparkles size={18} />
                Начать бесплатно
              </motion.button>

              <p
                className="text-center text-xs mt-3"
                style={{ color: "hsl(var(--swan) / 0.35)" }}
              >
                Без карты · Без обязательств
              </p>
            </div>
          )}

          {/* ── Step 1 — Name ── */}
          {step === 1 && (
            <div className="pt-20">
              {/* Logo small */}
              <div className="flex flex-col items-center mb-10">
                <img src={logoImg} alt="ИНТЕЛИНУМ" className="w-12 h-12 object-contain mb-3" />
                <span
                  className="font-display font-bold tracking-[0.2em] uppercase text-sm"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  ИНТЕЛИНУМ
                </span>
              </div>

              <h2
                className="font-display text-3xl font-bold mb-2"
                style={{ color: "hsl(var(--swan))" }}
              >
                Как вас зовут?
              </h2>
              <p className="text-sm mb-6" style={{ color: "hsl(var(--swan) / 0.55)" }}>
                Мы будем обращаться по имени
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-5 py-4 rounded-2xl text-lg focus:outline-none transition-all"
                style={{
                  background: "hsl(var(--swan) / 0.09)",
                  border: "1.5px solid hsl(var(--swan) / 0.18)",
                  color: "hsl(var(--swan))",
                }}
                onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()}
                autoFocus
              />
              <motion.button
                onClick={goNext}
                disabled={!canProceed()}
                whileHover={canProceed() ? { scale: 1.03 } : {}}
                whileTap={canProceed() ? { scale: 0.97, boxShadow: "0 0 48px hsl(var(--gold) / 0.65)" } : {}}
                className="w-full mt-5 py-4 rounded-2xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "var(--gradient-gold)",
                  color: "hsl(var(--royal))",
                  fontSize: 17,
                }}
              >
                Войти в приложение
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
