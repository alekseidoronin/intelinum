import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, Download, Copy, FileText, Image, LayoutGrid } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const items = [
  { id: 1, title: "Число 7: духовный поиск", date: "Сегодня", type: "pack", platforms: ["instagram", "telegram", "vk"], starred: true },
  { id: 2, title: "Энергия дня — 8 марта", date: "Вчера", type: "pack", platforms: ["instagram"], starred: false },
  { id: 3, title: "Запись эфира 06.03", date: "6 марта", type: "transcript", platforms: [], starred: false },
  { id: 4, title: "Топ-5 чисел миллионеров", date: "5 марта", type: "pack", platforms: ["instagram", "telegram"], starred: true },
  { id: 5, title: "PDF-гайд: Число судьбы", date: "4 марта", type: "pdf", platforms: [], starred: false },
  { id: 6, title: "Совместимость по числам", date: "3 марта", type: "pack", platforms: ["instagram", "vk"], starred: false },
];

const typeIcons = {
  pack: LayoutGrid,
  transcript: FileText,
  pdf: FileText,
};

const typeLabels = {
  pack: "Контент-пакет",
  transcript: "Расшифровка",
  pdf: "PDF-гайд",
};

export default function Library() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pack" | "transcript" | "pdf">("all");

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || item.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-3xl gradient-text-gold mb-1">Библиотека</h1>
        <p className="text-sm text-muted-foreground">Все ваши материалы</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по материалам..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {([["all", "Все"], ["pack", "Пакеты"], ["transcript", "Расшифровки"], ["pdf", "PDF"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === val ? "bg-primary/15 text-gold border border-primary/30" : "text-muted-foreground border border-border/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="px-5 space-y-2">
        {filtered.map((item, i) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl px-4 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{typeLabels[item.type as keyof typeof typeLabels]}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.starred ? "text-gold" : "text-muted-foreground hover:text-gold"}`}>
                  <Star size={15} fill={item.starred ? "currentColor" : "none"} />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Copy size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
