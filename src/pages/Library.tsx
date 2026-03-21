import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Copy, FileText, LayoutGrid, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type LibraryItemType = "pack" | "transcript" | "pdf" | "other";
type FilterType = "all" | "pack" | "transcript" | "pdf";

interface LibraryItem {
  id: string;
  title: string;
  date: string;
  type: LibraryItemType;
  starred: boolean;
}

interface LibraryDashboardResponse {
  items?: Array<{
    id?: string;
    title?: string;
    dateLabel?: string;
    type?: string;
    starred?: boolean;
  }>;
  source?: "db" | "fallback";
}

const fallbackItems: LibraryItem[] = [
  { id: "fallback-1", title: "Число 7: духовный поиск", date: "Сегодня", type: "pack", starred: true },
  { id: "fallback-2", title: "Энергия дня — 8 марта", date: "Вчера", type: "pack", starred: false },
  { id: "fallback-3", title: "Запись эфира 06.03", date: "6 марта", type: "transcript", starred: false },
  { id: "fallback-4", title: "Топ-5 чисел миллионеров", date: "5 марта", type: "pack", starred: true },
  { id: "fallback-5", title: "PDF-гайд: Число судьбы", date: "4 марта", type: "pdf", starred: false },
  { id: "fallback-6", title: "Совместимость по числам", date: "3 марта", type: "pack", starred: false },
];

const typeIcons = {
  pack: LayoutGrid,
  transcript: FileText,
  pdf: FileText,
  other: FileText,
};

const typeLabels = {
  pack: "Контент-пакет",
  transcript: "Расшифровка",
  pdf: "PDF-гайд",
  other: "Материал",
};

const normalizeType = (type: string | undefined): LibraryItemType => {
  if (type === "pack" || type === "transcript" || type === "pdf") return type;
  return "other";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export default function Library() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [items, setItems] = useState<LibraryItem[]>(fallbackItems);
  const [source, setSource] = useState<"db" | "fallback">("fallback");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("library-dashboard", {
        body: { action: "list_items" },
      });
      if (error) throw new Error(error.message);

      const payload = (data ?? {}) as LibraryDashboardResponse;
      const parsed = (payload.items ?? [])
        .map((item): LibraryItem | null => {
          const id = item.id?.trim();
          const title = item.title?.trim();
          if (!id || !title) return null;
          return {
            id,
            title,
            date: item.dateLabel?.trim() || "Без даты",
            type: normalizeType(item.type),
            starred: Boolean(item.starred),
          };
        })
        .filter((item): item is LibraryItem => item !== null);

      if (parsed.length > 0) {
        setItems(parsed);
      } else {
        setItems(fallbackItems);
      }
      setSource(payload.source === "db" ? "db" : "fallback");
    } catch {
      setItems(fallbackItems);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || item.type === filter;
        return matchSearch && matchFilter;
      }),
    [filter, items, search],
  );

  const onToggleStar = async (item: LibraryItem) => {
    const nextStarValue = !item.starred;
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, starred: nextStarValue } : entry,
      ),
    );

    if (source !== "db") {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("library-dashboard", {
        body: {
          action: "toggle_star",
          itemId: item.id,
          isStarred: nextStarValue,
        },
      });
      if (error) throw new Error(error.message);
    } catch (error: unknown) {
      setItems((prev) =>
        prev.map((entry) =>
          entry.id === item.id ? { ...entry, starred: item.starred } : entry,
        ),
      );
      toast({
        description: getErrorMessage(error, "Не удалось обновить избранное"),
        variant: "destructive",
      });
    }
  };

  const onCopyTitle = async (item: LibraryItem) => {
    try {
      await navigator.clipboard.writeText(item.title);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
      toast({ description: "Название скопировано" });
    } catch {
      toast({ description: "Не удалось скопировать", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar />

      <div className="px-5 pt-3 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по материалам..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sapphire transition-all shadow-card"
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Источник: {source === "db" ? "backend" : "fallback"}
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {([["all", "Все"], ["pack", "Пакеты"], ["transcript", "Расшифровки"], ["pdf", "PDF"]] as const).map(
          ([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === val ? "bg-royal text-swan" : "bg-white text-sapphire border border-border shadow-card"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="px-5 space-y-2">
        {loading && (
          <div className="bg-white border border-border rounded-2xl px-4 py-6 flex items-center gap-2 text-sm text-muted-foreground shadow-card">
            <Loader2 size={16} className="animate-spin" />
            Загрузка библиотеки...
          </div>
        )}

        {!loading &&
          filtered.map((item, i) => {
            const Icon = typeIcons[item.type];
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toast({ description: `Открываем: ${item.title}` })}
                style={{ touchAction: "pan-y" }}
                className="w-full bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 shadow-card active:scale-[0.98] transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-sapphire/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-sapphire" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-royal leading-snug line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.date} · {typeLabels[item.type]}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => void onToggleStar(item)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      item.starred ? "text-gold-dark" : "text-muted-foreground hover:text-gold-dark"
                    }`}
                  >
                    <Star size={18} fill={item.starred ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => void onCopyTitle(item)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      copiedId === item.id ? "text-sapphire" : "text-muted-foreground hover:text-sapphire"
                    }`}
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </motion.button>
            );
          })}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Search size={32} className="mx-auto mb-3 text-shell" />
            <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
