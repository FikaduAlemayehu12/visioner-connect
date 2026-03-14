import { Search, Mic, X, Bell, BellOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [focused, setFocused] = useState(false);
  const { user } = useAuth();
  const { savedSearches, saveSearch, removeSavedSearch } = useSavedSearches();

  const isQuerySaved = savedSearches.some(
    (s) => s.query.toLowerCase() === query.trim().toLowerCase()
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchParams.set("q", query.trim());
      } else {
        searchParams.delete("q");
      }
      setSearchParams(searchParams, { replace: true });
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSaveSearch = () => {
    if (!user) {
      toast.error("Sign in to set search alerts");
      return;
    }
    if (!query.trim()) return;

    if (isQuerySaved) {
      const saved = savedSearches.find(
        (s) => s.query.toLowerCase() === query.trim().toLowerCase()
      );
      if (saved) removeSavedSearch(saved.id);
    } else {
      saveSearch(query.trim());
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-xl border bg-card transition-all duration-300 ${
          focused
            ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
            : "border-border hover:border-primary/30"
        }`}
      >
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder='Search "Samsung phone", "laptop"...'
          className="h-11 w-full bg-transparent pl-10 pr-24 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="absolute right-2 flex items-center gap-0.5">
          <AnimatePresence>
            {query.trim() && user && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={handleSaveSearch}
                className={`p-1.5 rounded-lg transition-colors ${
                  isQuerySaved
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
                title={isQuerySaved ? "Remove alert" : "Alert me when new items match"}
              >
                {isQuerySaved ? (
                  <Bell className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            aria-label="Voice search"
          >
            <Mic className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Saved searches dropdown */}
      <AnimatePresence>
        {focused && savedSearches.length > 0 && !query && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                🔔 Active Alerts
              </p>
            </div>
            {savedSearches.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => setQuery(s.query)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  {s.query}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSavedSearch(s.id);
                  }}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
