import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { categories as mockCategories } from "@/lib/mockData";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data && data.length > 0) setDbCategories(data);
      });
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, searchQuery, typeFilter]);

  const { data, isLoading, isFetching } = usePosts({
    category: activeCategory,
    search: searchQuery,
    type: typeFilter,
    page,
    pageSize: 12,
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const hasMore = page * 12 < total;

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon || "📦", count: c.post_count }))
    : mockCategories;

  const handleCategoryClick = (catName: string) => {
    if (activeCategory === catName) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <section className="border-b border-border bg-card">
        <div className="container py-5 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1 shrink-0">
              <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                Find what you need, <span className="text-primary">sell what you don't.</span>
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm font-body">
                Ethiopia's intelligent marketplace — powered by AI.
              </p>
            </div>
            <div className="w-full md:max-w-sm">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5 space-y-6">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-bold text-foreground">Categories</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-8">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-colors ${
                  activeCategory === cat.name
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[11px] font-medium leading-tight">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">{cat.count} ads</span>
              </button>
            ))}
          </div>
        </section>

        {/* Listings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-bold text-foreground">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory
                ? activeCategory
                : "Recent Listings"}
              {total > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({total})</span>
              )}
            </h2>
            {(activeCategory || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground"
                onClick={() => {
                  searchParams.delete("category");
                  searchParams.delete("q");
                  setSearchParams(searchParams);
                }}
              >
                Clear filter
              </Button>
            )}
          </div>
          <FilterBar active={typeFilter} onChange={setTypeFilter} />

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {posts.length > 0 ? (
                posts.map((post) => <ListingCard key={post.id} listing={post} />)
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-sm">No listings found.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      searchParams.delete("category");
                      searchParams.delete("q");
                      setSearchParams(searchParams);
                      setTypeFilter("all");
                    }}
                  >
                    Show all listings
                  </Button>
                </div>
              )}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
              >
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Load More
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
