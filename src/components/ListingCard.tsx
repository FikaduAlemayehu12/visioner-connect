import { MapPin, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { type PostWithDetails, formatETB, timeAgo } from "@/hooks/usePosts";

interface ListingCardProps {
  listing: PostWithDetails;
}

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block rounded-lg border border-border bg-card overflow-hidden card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing.is_urgent && (
            <span className="rounded-sm bg-warning px-2 py-0.5 text-xs font-medium text-warning-foreground">Urgent</span>
          )}
          {listing.is_featured && (
            <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">Featured</span>
          )}
          {listing.type === "buy" && (
            <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">Wanted</span>
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-heading text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {listing.title}
        </h3>
        <p className="font-heading text-lg font-bold text-primary">
          {formatETB(listing.price)}
          {listing.negotiable && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">Negotiable</span>
          )}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location || "Ethiopia"}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-warning fill-warning" />
            <span>{listing.seller_rating.toFixed(1)}</span>
            {listing.seller_verified && (
              <span className="ml-1 text-success text-[10px]">✓ Verified</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{timeAgo(listing.created_at)}</span>
            <Eye className="h-3 w-3" />
            <span>{listing.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
