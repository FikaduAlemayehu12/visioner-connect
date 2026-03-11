import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { listings, categories as mockCategories, formatETB } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
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

  const filteredListings = activeCategory
    ? listings.filter((l) => l.category.toLowerCase() === activeCategory.toLowerCase())
    : listings;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Compact hero with search — right-aligned on desktop */}
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
        {/* Categories — at top */}
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
              {activeCategory ? `${activeCategory}` : "Recent Listings"}
            </h2>
            {activeCategory && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground"
                onClick={() => {
                  searchParams.delete("category");
                  setSearchParams(searchParams);
                }}
              >
                Clear filter
              </Button>
            )}
          </div>
          <FilterBar />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p className="text-sm">No listings found in this category yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    searchParams.delete("category");
                    setSearchParams(searchParams);
                  }}
                >
                  Show all listings
                </Button>
              </div>
            )}
          </div>
          {filteredListings.length > 0 && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" size="lg">
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
