import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ExternalLink, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

interface MarketplaceResult {
  title: string;
  price: number;
  source: string;
  location?: string;
  condition?: string;
  url?: string;
  description: string;
}

const sourceColors: Record<string, string> = {
  Jiji: "bg-green-500/10 text-green-700 border-green-200",
  AliExpress: "bg-orange-500/10 text-orange-700 border-orange-200",
  "Facebook Marketplace": "bg-blue-500/10 text-blue-700 border-blue-200",
  HuluMarket: "bg-purple-500/10 text-purple-700 border-purple-200",
};

export default function ExternalSearch() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<MarketplaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke("search-marketplaces", {
        body: { query: query.trim() },
      });

      if (error) throw error;

      if (data?.success) {
        setResults(data.results || []);
        if (data.results?.length === 0) {
          toast.info("No results found. Try a different search term.");
        }
      } else {
        toast.error(data?.error || "Search failed");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      toast.error("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">
            Search Other Marketplaces
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered search across Jiji, AliExpress, Facebook Marketplace, HuluMarket & more
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='Search for "Samsung Galaxy", "Sofa set", "Toyota"...'
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Searching across marketplaces...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No results found. Try a different search term.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {r.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-sm border px-2 py-0.5 text-[10px] font-medium ${
                      sourceColors[r.source] || "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {r.source}
                  </span>
                </div>

                <p className="font-heading text-lg font-bold text-primary">
                  ETB {r.price.toLocaleString()}
                </p>

                <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {r.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.location}
                    </span>
                  )}
                  {r.condition && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {r.condition}
                    </span>
                  )}
                </div>

                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View on {r.source} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
