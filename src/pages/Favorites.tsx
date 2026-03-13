import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ListingCard } from "@/components/ListingCard";
import { type PostWithDetails } from "@/hooks/usePosts";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { user } = useAuth();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["favorite-posts", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PostWithDetails[]> => {
      const { data: favs } = await supabase
        .from("favorites")
        .select("post_id")
        .eq("user_id", user!.id);

      if (!favs || favs.length === 0) return [];

      const ids = favs.map((f: any) => f.post_id);
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories!posts_category_id_fkey(name, icon),
          profiles!posts_user_id_profiles_fkey(full_name, business_verified, rating, trade_count, avatar_url, phone, email),
          post_images(image_url, sort_order)
        `)
        .in("id", ids);

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id, title: p.title, description: p.description, price: p.price,
        location: p.location, address: p.address, type: p.type, status: p.status,
        is_urgent: p.is_urgent, is_featured: p.is_featured, negotiable: p.negotiable,
        views: p.views, contact_phone: p.contact_phone, created_at: p.created_at,
        user_id: p.user_id, category_id: p.category_id,
        category_name: p.categories?.name || null, category_icon: p.categories?.icon || null,
        seller_name: p.profiles?.full_name || "Unknown",
        seller_verified: p.profiles?.business_verified || false,
        seller_rating: Number(p.profiles?.rating) || 0,
        seller_trade_count: p.profiles?.trade_count || 0,
        seller_avatar: p.profiles?.avatar_url || null,
        seller_phone: p.profiles?.phone || null,
        seller_email: p.profiles?.email || null,
        images: (p.post_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.image_url),
      }));
    },
  });

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-heading font-bold text-foreground mb-2">Sign in to view favorites</h1>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">My Favorites</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No favorites yet. Browse listings to save items you like.</p>
          <Button className="mt-4" asChild><Link to="/">Browse Listings</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <ListingCard key={post.id} listing={post} />
          ))}
        </div>
      )}
    </div>
  );
}
