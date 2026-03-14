import { MapPin, Star, Eye, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { type PostWithDetails, formatETB, timeAgo } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: PostWithDetails;
}

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";
  const { user } = useAuth();
  const { favoriteIds } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorited = favoriteIds.includes(listing.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleFavorite.mutate({ postId: listing.id, isFavorited });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/listing/${listing.id}`}
        className="group block rounded-2xl border border-border bg-card overflow-hidden card-hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {listing.is_urgent && (
              <span className="rounded-lg bg-warning px-2.5 py-1 text-[10px] font-bold text-warning-foreground shadow-sm backdrop-blur-sm">
                🔥 Urgent
              </span>
            )}
            {listing.is_featured && (
              <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm backdrop-blur-sm">
                ⭐ Featured
              </span>
            )}
            {listing.type === "buy" && (
              <span className="rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-bold text-secondary-foreground shadow-sm backdrop-blur-sm">
                Wanted
              </span>
            )}
          </div>
          {user && (
            <button
              onClick={handleFavorite}
              className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
                isFavorited
                  ? "bg-destructive/90 text-destructive-foreground shadow-md"
                  : "bg-card/70 text-muted-foreground hover:bg-card hover:text-destructive"
              }`}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
            </button>
          )}
          
          {/* Price tag */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center rounded-lg bg-card/90 backdrop-blur-md px-3 py-1.5 text-sm font-heading font-bold text-foreground shadow-sm">
              {formatETB(listing.price)}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-2">
          <h3 className="font-heading text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
            <span className="truncate">{listing.location || "Ethiopia"}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Star className="h-3 w-3 fill-current" />
              </div>
              <span className="font-medium text-foreground">{listing.seller_rating.toFixed(1)}</span>
              {listing.seller_verified && (
                <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">✓</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
