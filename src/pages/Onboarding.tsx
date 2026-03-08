import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Upload, Check, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
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

type AuthMode = "signup" | "login";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [name, setName] = useState("");
  const [texts, setTexts] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setStep(s => s + 1);
    } catch (err: any) {
      setAuthError(
        err.message === "Invalid login credentials"
          ? "Неверный email или пароль"
          : err.message === "User already registered"
          ? "Этот email уже зарегистрирован"
          : err.message || "Ошибка. Попробуйте снова."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const goNext = () => {
    if (step === 4) {
      setStep(5);
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

  // Steps: 0=welcome, 1=auth, 2=name, 3=texts, 4=style, 5=loading
  const totalSteps = 4; // 0-3 shown in progress
  const progressStep = step <= 4 ? step : 4;

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

        {step > 0 && step < 5 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(i => (
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
                  onClick={() => { setAuthMode("signup"); setStep(1); }}
                  className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 hover:bg-sapphire mb-3"
                >
                  Зарегистрироваться
                </button>
                <button
                  onClick={() => { setAuthMode("login"); setStep(1); }}
                  className="w-full py-3.5 rounded-2xl border border-border bg-white text-royal font-semibold text-base shadow-card transition-all active:scale-95 hover:border-sapphire"
                >
                  Войти
                </button>
              </div>
            )}

            {/* Step 1 — Auth */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-1">
                  {authMode === "signup" ? "Создать аккаунт" : "Добро пожаловать"}
                </h2>
                <p className="text-sapphire/80 mb-6 text-sm">
                  {authMode === "signup" ? "Введите email и пароль" : "Войдите в свой аккаунт"}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email"
                      autoFocus
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Пароль"
                      onKeyDown={e => e.key === "Enter" && email && password.length >= 6 && handleAuth()}
                      className="w-full pl-11 pr-11 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-sm text-destructive mb-3 px-1">{authError}</p>
                )}

                <button
                  onClick={handleAuth}
                  disabled={!email || password.length < 6 || authLoading}
                  className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire mb-4"
                >
                  {authLoading ? "Загрузка..." : authMode === "signup" ? "Зарегистрироваться" : "Войти"}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  {authMode === "signup" ? "Уже есть аккаунт? " : "Нет аккаунта? "}
                  <button
                    onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthError(""); }}
                    className="text-sapphire font-medium underline-offset-2 hover:underline"
                  >
                    {authMode === "signup" ? "Войти" : "Зарегистрироваться"}
                  </button>
                </p>
              </div>
            )}

            {/* Step 2 — Name */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-2">Как вас зовут?</h2>
                <p className="text-sapphire/80 mb-6 text-sm">Мы будем обращаться по имени</p>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
                  onKeyDown={e => e.key === "Enter" && name.trim() && goNext()}
                  autoFocus
                />
                <button
                  onClick={goNext}
                  disabled={!name.trim()}
                  className="w-full mt-5 py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire"
                >
                  Продолжить
                </button>
              </div>
            )}

            {/* Step 3 — Texts */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-2">Ваш стиль письма</h2>
                <p className="text-sapphire/80 mb-6 text-sm">Загрузите 3–5 своих постов или текстов</p>
                <textarea
                  value={texts}
                  onChange={e => setTexts(e.target.value)}
                  placeholder="Вставьте сюда 3–5 ваших постов, статей или текстов. Наш помощник изучит ваш стиль и будет писать именно так, как пишете вы..."
                  rows={8}
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all resize-none leading-relaxed"
                />
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-3 rounded-xl border border-border text-sapphire flex items-center justify-center gap-2 text-sm active:scale-95 transition-all bg-white hover:border-sapphire">
                    <Upload size={15} />
                    Загрузить файл
                  </button>
                  <button
                    onClick={goNext}
                    disabled={texts.trim().length <= 10}
                    className="flex-1 py-3 rounded-xl bg-royal text-swan font-semibold shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire"
                  >
                    Продолжить
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — Style */}
            {step === 4 && (
              <div>
                <h2 className="font-display text-3xl text-royal mb-2">Стиль визуала</h2>
                <p className="text-sapphire/80 mb-5 text-sm">Выберите, как будут выглядеть ваши картинки</p>
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
                  disabled={!selectedStyle}
                  className="w-full py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-40 hover:bg-sapphire"
                >
                  Готово
                </button>
              </div>
            )}

            {/* Step 5 — Loading */}
            {step === 5 && (
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
