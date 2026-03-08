import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import logoImg from "@/assets/logo.png";

const features = [
  {
    emoji: "⚡",
    title: "Пишет вашим языком",
    desc: "Платформа изучает ваш стиль и создаёт тексты, которые звучат как вы",
  },
  {
    emoji: "🎴",
    title: "Красивые картинки сами",
    desc: "Выбираете стиль один раз — дальше картинки создаются автоматически",
  },
  {
    emoji: "🔮",
    title: "Каждое утро — готовая тема",
    desc: "Не надо думать «о чём сегодня писать» — тема дня уже ждёт вас",
  },
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
      {/* Ambient glows */}
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
            <div className="flex flex-col flex-1 pt-12">

              {/* Logo */}
              <motion.div
                className="flex flex-col items-center mb-8"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={logoImg}
                  alt="ИНТЕЛИНУМ"
                  className="object-contain mb-4"
                  style={{
                    width: 110,
                    height: 110,
                    filter: "drop-shadow(0 0 24px hsl(var(--gold) / 0.5))",
                  }}
                />
                <span
                  className="font-display font-bold tracking-[0.22em] uppercase mb-1"
                  style={{
                    fontSize: 24,
                    background: "var(--gradient-gold)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ИНТЕЛИНУМ
                </span>
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "hsl(var(--swan) / 0.45)", letterSpacing: "0.18em" }}
                >
                  AI-платформа для нумерологов
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                className="text-center mb-7"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <h1
                  className="font-display font-bold leading-[1.15] mb-3"
                  style={{ fontSize: 32, color: "hsl(var(--swan))" }}
                >
                  Пишет как вы.<br />
                  <span
                    style={{
                      background: "var(--gradient-gold)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Только быстрее.
                  </span>
                </h1>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "hsl(var(--swan) / 0.6)" }}
                >
                  Больше не нужно часами сидеть над текстами и картинками. Загрузите запись эфира или выберите тему — и получите готовые публикации в вашем стиле
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-2.5 mb-8">
                {features.map(({ emoji, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.45, ease: "easeOut" }}
                    className="flex items-start gap-4 rounded-2xl px-4 py-3.5"
                    style={{
                      background: "hsl(var(--swan) / 0.06)",
                      border: "1px solid hsl(var(--swan) / 0.1)",
                    }}
                  >
                    <span className="text-xl leading-none mt-0.5 flex-shrink-0">{emoji}</span>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "hsl(var(--swan) / 0.95)" }}>
                        {title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--swan) / 0.5)" }}>
                        {desc}
                      </p>
                    </div>
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
                className="w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
                style={{
                  background: "var(--gradient-gold)",
                  color: "hsl(var(--royal))",
                  fontSize: 17,
                }}
              >
                <Sparkles size={18} />
                Попробовать бесплатно
              </motion.button>

              <p
                className="text-center text-xs mt-3"
                style={{ color: "hsl(var(--swan) / 0.35)" }}
              >
                Без карты · 3 публикации в подарок
              </p>
            </div>
          )}

          {/* ── Step 1 — Name ── */}
          {step === 1 && (
            <div className="pt-20">
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
                whileHover={canProceed() ? { scale: 1.015, boxShadow: "0 0 36px hsl(var(--gold) / 0.55), 0 6px 20px hsl(var(--gold) / 0.3)" } : {}}
                whileTap={canProceed() ? { scale: 0.985, boxShadow: "0 0 52px hsl(var(--gold) / 0.75)" } : {}}
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
