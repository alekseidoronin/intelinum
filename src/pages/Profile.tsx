import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Crown, Palette, FileText, Bell, LogOut, Shield, HelpCircle, Pencil, Check, X, Eye, EyeOff, Camera } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AVATARS = ["🔮", "🌙", "⭐", "🌟", "🦋", "🌸", "🔥", "💎", "🌊", "🦄", "🌺", "✨"];

const menuItems = [
  { icon: FileText, label: "Мой стиль письма", desc: "Обновить тексты-примеры", path: "/profile/style" },
  { icon: Palette, label: "Стиль визуала", desc: "Изменить визуальный стиль картинок", path: "/profile/visual" },
  { icon: Bell, label: "Уведомления", desc: "Настройки напоминаний", path: "/profile/notifications" },
  { icon: Shield, label: "Безопасность", desc: "Пароль и данные", path: "/profile/security" },
  { icon: HelpCircle, label: "Поддержка", desc: "Написать нам", path: "/profile/support" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, displayName, refreshProfile } = useAuth();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [avatarEmoji, setAvatarEmoji] = useState(() => localStorage.getItem("avatarEmoji") || "🔮");
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(() => localStorage.getItem("avatarPhoto") || null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use localStorage name as fallback for non-auth users
  const shownName = displayName || localStorage.getItem("userName") || "Пользователь";
  const email = user?.email || "";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPhoto(dataUrl);
      localStorage.setItem("avatarPhoto", dataUrl);
      setShowAvatarPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEmoji = (emoji: string) => {
    setAvatarEmoji(emoji);
    setAvatarPhoto(null);
    localStorage.setItem("avatarEmoji", emoji);
    localStorage.removeItem("avatarPhoto");
    setShowAvatarPicker(false);
  };

  const startEditName = () => {
    setNewName(shownName);
    setEditingName(true);
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ display_name: newName.trim() })
          .eq("user_id", user.id);
        if (error) throw error;
        await refreshProfile();
      } else {
        localStorage.setItem("userName", newName.trim());
      }
      setEditingName(false);
      toast({ description: "Имя обновлено ✓" });
    } catch {
      toast({ description: "Ошибка при сохранении", variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async () => {
    if (newPassword.length < 6) {
      toast({ description: "Пароль должен быть не менее 6 символов", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ description: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ description: "Пароль изменён ✓" });
      setChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ description: err.message, variant: "destructive" });
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userName");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      {/* User card */}
      <div className="px-5 pt-3 mb-5">
        <div
          className="rounded-3xl p-5"
          style={{ background: "linear-gradient(145deg, hsl(224 65% 19%), hsl(221 35% 30%))" }}>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl border border-white/20 flex-shrink-0">
              🔮
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveName()}
                    autoFocus
                    className="flex-1 min-w-0 bg-white/15 border border-white/30 rounded-xl px-3 py-1.5 text-base text-swan focus:outline-none"
                  />
                  <button onClick={saveName} disabled={savingName} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 text-swan">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-swan/60">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl text-swan truncate">{shownName}</h2>
                  <button onClick={startEditName} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-swan/60 hover:text-swan flex-shrink-0">
                    <Pencil size={13} />
                  </button>
                </div>
              )}
              {email ? (
                <p className="text-sm text-swan/50 truncate mt-0.5">{email}</p>
              ) : null}
              <div className="flex items-center gap-1.5 mt-1 w-fit px-2.5 py-1 rounded-lg bg-white/15 border border-white/20">
                
                <span className="text-xs text-gold font-medium whitespace-nowrap">Бесплатный</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-swan/60">Контент-пакеты в этом месяце</span>
              <span className="text-sm text-gold font-medium">2 / 3</span>
            </div>
            <div className="w-full bg-white/15 rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-gold" style={{ width: "67%" }} />
            </div>
            <button onClick={() => navigate("/pricing")}
              className="mt-3 w-full py-3 rounded-xl bg-white/15 border border-white/20 text-swan text-base font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/25">
              <Crown size={16} className="text-gold" />
              Улучшить план
            </button>
          </div>
        </div>
      </div>

      {/* Change password block */}
      {user && (
        <div className="px-5 mb-2">
          {changingPassword ? (
            <div className="bg-white border border-border rounded-2xl px-4 py-4 shadow-card space-y-3">
              <p className="text-base font-medium text-royal">Изменить пароль</p>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Новый пароль"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-background border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sapphire transition-all"
                />
                <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && savePassword()}
                placeholder="Повторите пароль"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sapphire transition-all"
              />
              <div className="flex gap-2">
                <button onClick={savePassword} disabled={savingPw}
                  className="flex-1 py-3 rounded-xl bg-royal text-swan text-base font-semibold active:scale-95 transition-all disabled:opacity-50">
                  {savingPw ? "Сохраняем..." : "Сохранить"}
                </button>
                <button onClick={() => setChangingPassword(false)}
                  className="py-3 px-4 rounded-xl border border-border text-muted-foreground text-base active:scale-95 transition-all">
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setChangingPassword(true)}
              className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left shadow-card hover:border-sapphire/40 transition-all active:scale-[0.98]">
              <div className="w-11 h-11 rounded-xl bg-background flex items-center justify-center border border-border flex-shrink-0">
                <Shield size={22} className="text-sapphire" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-royal">Изменить пароль</p>
                <p className="text-sm text-muted-foreground">Обновите пароль аккаунта</p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* Menu */}
      <div className="px-5 space-y-2">
        {menuItems.filter(i => i.path !== "/profile/security").map((item) => (
          <button key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left shadow-card hover:border-sapphire/40 transition-all active:scale-[0.98]">
            <div className="w-11 h-11 rounded-xl bg-background flex items-center justify-center border border-border flex-shrink-0">
              <item.icon size={22} className="text-sapphire" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-royal leading-snug">{item.label}</p>
              <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
          </button>
        ))}

        <button onClick={handleLogout}
          className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left shadow-card hover:border-destructive/30 transition-all active:scale-[0.98]">
          <div className="w-11 h-11 rounded-xl bg-destructive/5 flex items-center justify-center border border-destructive/10 flex-shrink-0">
            <LogOut size={20} className="text-destructive/70" />
          </div>
          <span className="text-base font-medium text-destructive/70">Выйти из аккаунта</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
