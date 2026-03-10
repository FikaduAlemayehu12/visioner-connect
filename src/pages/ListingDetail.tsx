import { useParams, Link } from "react-router-dom";
import { listings, formatETB } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Eye, MessageSquare, Phone, Share2, Heart, ChevronLeft, Shield } from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams();
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-heading font-bold text-foreground">Listing not found</h1>
          <Button asChild><Link to="/">Back to Home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container py-4 md:py-8">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-lg overflow-hidden border border-border bg-card">
              <div className="aspect-video relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {listing.isUrgent && (
                    <span className="rounded-sm bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">Urgent</span>
                  )}
                  {listing.isFeatured && (
                    <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">Featured</span>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">{listing.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
                </div>
              </div>

              <p className="text-2xl font-heading font-bold text-primary">
                {formatETB(listing.price)}
                {listing.negotiable && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">Negotiable</span>
                )}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views} views</span>
                <span className="flex items-center gap-1">{listing.createdAt}</span>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-base font-heading font-semibold text-foreground mb-2">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a high-quality listing in excellent condition. The item has been well-maintained and comes with all original accessories. Perfect for anyone looking for a great deal in {listing.location}. Contact the seller for more details or to arrange a viewing.
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-base font-heading font-semibold text-foreground mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium text-foreground">{listing.category}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground capitalize">{listing.type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium text-foreground">Used - Like New</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Negotiable</span>
                    <span className="font-medium text-foreground">{listing.negotiable ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Transaction Panel */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Seller Card */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <h2 className="text-base font-heading font-semibold text-foreground">Seller</h2>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold text-lg">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{listing.sellerName}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                      <span className="text-foreground font-medium">{listing.rating}</span>
                      <span className="text-muted-foreground">· 23 trades</span>
                    </div>
                  </div>
                </div>
                {listing.sellerVerified && (
                  <div className="flex items-center gap-1.5 text-sm text-success">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Verified Seller</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4" /> Send Message
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="h-4 w-4" /> Show Phone
                  </Button>
                </div>
              </div>

              {/* Safety */}
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                <h3 className="text-sm font-heading font-semibold text-foreground">Safety Tips</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Meet in a public, well-lit place</li>
                  <li>• Inspect the item before paying</li>
                  <li>• Don't send payment in advance</li>
                  <li>• Report suspicious listings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-border bg-card p-3 flex gap-2 md:hidden">
        <Button className="flex-1" size="lg">
          <MessageSquare className="h-4 w-4" /> Message
        </Button>
        <Button variant="outline" size="lg">
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
