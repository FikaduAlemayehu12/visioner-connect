import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { listings, categories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="container py-10 md:py-16 space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Find what you need, <span className="text-primary">sell what you don't.</span>
            </h1>
            <p className="text-muted-foreground font-body">
              Ethiopia's intelligent marketplace — powered by AI to connect buyers and sellers faster.
            </p>
          </div>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-8">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground">Categories</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:border-primary/30 hover:bg-muted"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-foreground">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">{cat.count} ads</span>
              </button>
            ))}
          </div>
        </section>

        {/* Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground">Recent Listings</h2>
          </div>
          <FilterBar />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
