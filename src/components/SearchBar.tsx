import { Search, Mic, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

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

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Try "affordable smartphones near Bole"'
        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-16 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
          aria-label="Voice search"
        >
          <Mic className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
