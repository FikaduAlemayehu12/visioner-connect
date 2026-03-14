import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { categories as mockCategories } from "@/lib/mockData";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Globe, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

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
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container relative py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 shrink-0 max-w-lg"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> AI-Powered Marketplace
              </div>
              <h1 className="text-2xl md:text-4xl font-heading font-black text-foreground leading-tight">
                Find what you need,{" "}
                <span className="gradient-text">sell what you don't.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base font-body">
                Ethiopia's smartest marketplace — search, chat, and trade with confidence.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full md:max-w-md space-y-2"
            >
              <SearchBar />
              <div className="flex items-center gap-3">
                <Link
                  to={`/search/external${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Globe className="h-3 w-3" /> Search other marketplaces
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container py-6 space-y-8">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Categories
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-8 rounded-lg">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 md:grid-cols-8 gap-2.5"
          >
            {displayCategories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                  activeCategory === cat.name
                    ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                    : "border-border bg-card text-foreground hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-semibold leading-tight">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">{cat.count}</span>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground">
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
                className="text-xs h-8 text-muted-foreground rounded-lg"
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
            <div className="flex justify-center py-20">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Finding the best deals...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {posts.length > 0 ? (
                posts.map((post) => <ListingCard key={post.id} listing={post} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-heading font-semibold mb-1">No listings found</p>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
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
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
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
