import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ChevronLeft, FileAudio, X, Sparkles, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

type Step = "upload" | "transcribing" | "transcript" | "generating" | "done";

const mockTranscript = `[00:00] Добрый день, друзья. Сегодня я хочу поговорить о числе 7 и о том, как оно влияет на нашу жизнь.

[00:15] Семёрка — это число духовного поиска, это число людей, которые всегда задают вопросы. Они не могут просто принять на веру — им нужно понять, исследовать, докопаться до сути.

[01:02] Если в вашей матрице судьбы есть семёрка, вы наверняка знаете это ощущение — вам всегда мало поверхностных ответов. Вы хотите знать, почему именно так устроен мир.

[02:30] И это прекрасно! Именно такие люди становятся настоящими исследователями — в науке, в духовности, в творчестве.

[03:45] Главный вызов семёрки — это научиться доверять. Доверять людям, доверять процессу, доверять своей интуиции.`;

export default function RailA() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const startTranscription = () => {
    setStep("transcribing");
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setStep("transcript"), 600);
      }
      setProgress(Math.min(p, 100));
    }, 350);
  };

  const startGeneration = () => {
    setStep("generating");
    setTimeout(() => navigate("/result"), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl gradient-text-gold">У меня есть запись</h1>
          <p className="text-xs text-muted-foreground">Загрузите аудио или видео</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-1">
          {(["upload", "transcribing", "transcript", "generating", "done"] as Step[]).map((s, i) => {
            const stepIndex = ["upload", "transcribing", "transcript", "generating", "done"].indexOf(step);
            const isActive = i <= stepIndex;
            return (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${isActive ? "bg-primary" : "bg-border"}`} />
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {step === "upload" && "Шаг 1: Загрузка файла"}
          {step === "transcribing" && "Шаг 2: Расшифровка записи..."}
          {step === "transcript" && "Шаг 3: Текст готов"}
          {step === "generating" && "Шаг 4: Создаём контент..."}
        </div>
      </div>

      <div className="px-5">
        <AnimatePresence mode="wait">
          {/* Upload */}
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <input
                ref={inputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => !file && inputRef.current?.click()}
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  dragOver ? "border-primary bg-primary/10" : file ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-border bg-muted/20"
                }`}
              >
                {file ? (
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                      <FileAudio size={28} className="text-gold" />
                    </div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="mt-3 text-xs text-muted-foreground flex items-center gap-1 mx-auto hover:text-destructive"
                    >
                      <X size={12} /> Удалить
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Upload size={28} className="text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Перетащите файл или нажмите</p>
                    <p className="text-sm text-muted-foreground">mp3, m4a, wav, ogg, mp4, mov · до 500 МБ</p>
                  </div>
                )}
              </div>

              {file && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={startTranscription}
                  className="w-full mt-4 py-4 rounded-2xl bg-gradient-gold text-background font-semibold text-lg shadow-gold transition-all active:scale-95"
                >
                  Расшифровать запись
                </motion.button>
              )}

              <div className="mt-6 glass-card rounded-2xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-3">Поддерживаемые форматы</p>
                {[
                  { icon: "🎵", formats: "MP3, M4A, WAV, OGG", label: "Аудио" },
                  { icon: "🎬", formats: "MP4, MOV, WEBM", label: "Видео" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="text-lg">{f.icon}</span>
                    <div>
                      <div className="text-xs text-foreground">{f.label}</div>
                      <div className="text-xs text-muted-foreground">{f.formats}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Transcribing */}
          {step === "transcribing" && (
            <motion.div key="transcribing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <FileAudio className="absolute inset-0 m-auto text-gold" size={32} />
              </div>
              <h2 className="font-display text-2xl gradient-text-gold mb-2">Расшифровываем вашу запись...</h2>
              <p className="text-sm text-muted-foreground mb-8">Наш помощник переводит речь в текст</p>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-gold"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{Math.round(progress)}%</div>
            </motion.div>
          )}

          {/* Transcript */}
          {step === "transcript" && (
            <motion.div key="transcript" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-gold" />
                <span className="text-sm text-foreground font-medium">Расшифровка готова</span>
                <span className="ml-auto text-xs text-muted-foreground">{file?.name}</span>
              </div>
              <div className="glass-card rounded-2xl p-4 mb-4 max-h-64 overflow-y-auto scrollbar-hide">
                <pre className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-body">
                  {mockTranscript}
                </pre>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Редактировать
                </button>
                <button className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Скачать
                </button>
              </div>
              <button
                onClick={startGeneration}
                className="w-full py-4 rounded-2xl bg-gradient-gold text-background font-semibold text-lg shadow-gold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Создать пост →
              </button>
            </motion.div>
          )}

          {/* Generating */}
          {step === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-6 opacity-80"
              >
                <div className="w-full h-full rounded-full border-2 border-primary/40 flex items-center justify-center relative">
                  <Sparkles size={32} className="text-gold" />
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <div
                      key={deg}
                      className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${deg}deg) translateX(36px) translateY(-50%)`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              <h2 className="font-display text-2xl gradient-text-gold mb-3">Создаём контент...</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Пишем посты в вашем стиле для всех площадок, генерируем картинку и карусель
              </p>
              <div className="mt-8 space-y-2 text-left max-w-xs mx-auto">
                {["Instagram, Telegram, ВКонтакте", "Яндекс Дзен, Reels-скрипт", "Картинка в вашем стиле", "Карусель из 8 слайдов"].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.7 + 0.5 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.7 + 0.5 }}
                    >
                      <CheckCircle2 size={14} className="text-gold" />
                    </motion.div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
