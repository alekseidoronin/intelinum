import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (mode === "signup" && !name.trim()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ description: "Аккаунт создан! Проверьте почту для подтверждения." });
        navigate("/home");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        navigate("/home");
      }
    } catch (err: any) {
      toast({
        description: err.message === "Invalid login credentials"
          ? "Неверный email или пароль"
          : err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-5 pt-12 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sapphire/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="mb-10 relative z-10">
        <Logo size="lg" vertical />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Toggle */}
        <div className="flex bg-white border border-border rounded-2xl p-1 mb-6 shadow-card">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all ${
              mode === "login" ? "bg-royal text-swan" : "text-muted-foreground"
            }`}
          >
            Войти
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all ${
              mode === "signup" ? "bg-royal text-swan" : "text-muted-foreground"
            }`}
          >
            Регистрация
          </button>
        </div>

        <div className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
              autoFocus={mode === "signup"}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-5 py-4 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
            autoFocus={mode === "login"}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full px-5 py-4 pr-12 rounded-2xl bg-white border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 py-4 rounded-2xl bg-royal text-swan font-semibold text-lg shadow-card transition-all active:scale-95 disabled:opacity-50 hover:bg-sapphire"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
