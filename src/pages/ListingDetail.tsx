import { useParams, Link, useNavigate } from "react-router-dom";
import { usePost, formatETB, timeAgo } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { getOrCreateConversation } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: listing, isLoading } = usePost(id);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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

  const images = listing.images.length > 0
    ? listing.images
    : ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"];

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Please sign in to send messages");
      navigate("/login");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    const convoId = await getOrCreateConversation(listing.id, listing.user_id, user.id);
    if (!convoId) return;
    
    // Send first message
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("messages").insert({
      conversation_id: convoId,
      sender_id: user.id,
      content: message.trim(),
    });
    
    if (error) {
      toast.error("Failed to send message");
      return;
    }
    
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convoId);
    
    toast.success("Message sent! Opening chat...");
    setMessage("");
    setShowMessageBox(false);
    navigate("/chats");
  };

  const handleShowPhone = () => {
    if (!user) {
      toast.error("Please sign in to view phone numbers");
      navigate("/login");
      return;
    }
    setShowPhone(true);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: listing.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container py-4 md:py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="rounded-lg overflow-hidden border border-border bg-card">
              <div className="aspect-video relative">
                <img
                  src={images[activeImage]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {listing.is_urgent && (
                    <span className="rounded-sm bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">Urgent</span>
                  )}
                  {listing.is_featured && (
                    <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">Featured</span>
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i > 0 ? i - 1 : images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1.5 text-foreground hover:bg-card"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i < images.length - 1 ? i + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1.5 text-foreground hover:bg-card"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 ${
                        i === activeImage ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">{listing.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
                </div>
              </div>

              <p className="text-2xl font-heading font-bold text-primary">
                {formatETB(listing.price)}
                {listing.negotiable && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">Negotiable</span>
                )}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location || "Ethiopia"}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views} views</span>
                <span>{timeAgo(listing.created_at)}</span>
              </div>

              {listing.description && (
                <div className="border-t border-border pt-4">
                  <h2 className="text-base font-heading font-semibold text-foreground mb-2">Description</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <h2 className="text-base font-heading font-semibold text-foreground mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {listing.category_name && (
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">{listing.category_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground capitalize">{listing.type.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Negotiable</span>
                    <span className="font-medium text-foreground">{listing.negotiable ? "Yes" : "No"}</span>
                  </div>
                  {listing.address && (
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-medium text-foreground">{listing.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Seller & Actions */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <h2 className="text-base font-heading font-semibold text-foreground">Seller</h2>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold text-lg overflow-hidden">
                    {listing.seller_avatar ? (
                      <img src={listing.seller_avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      listing.seller_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{listing.seller_name}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                      <span className="text-foreground font-medium">{listing.seller_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">· {listing.seller_trade_count} trades</span>
                    </div>
                  </div>
                </div>
                {listing.seller_verified && (
                  <div className="flex items-center gap-1.5 text-sm text-success">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Verified Seller</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={() => setShowMessageBox(!showMessageBox)}>
                    <MessageSquare className="h-4 w-4" /> Send Message
                  </Button>

                  {showMessageBox && (
                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <Textarea
                        placeholder={`Hi, I'm interested in "${listing.title}"...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                      <Button size="sm" className="w-full" onClick={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                  )}

                  <Button variant="outline" className="w-full" size="lg" onClick={handleShowPhone}>
                    <Phone className="h-4 w-4" />
                    {showPhone && listing.seller_phone
                      ? listing.seller_phone
                      : showPhone && listing.contact_phone
                      ? listing.contact_phone
                      : "Show Phone"}
                  </Button>
                </div>
              </div>

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
        <Button className="flex-1" size="lg" onClick={() => setShowMessageBox(true)}>
          <MessageSquare className="h-4 w-4" /> Message
        </Button>
        <Button variant="outline" size="lg" onClick={handleShowPhone}>
          <Phone className="h-4 w-4" />
          {showPhone && (listing.seller_phone || listing.contact_phone) ? (
            <span className="text-xs ml-1">{listing.seller_phone || listing.contact_phone}</span>
          ) : null}
        </Button>
      </div>
    </div>
  );
}
