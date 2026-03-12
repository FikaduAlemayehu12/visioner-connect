import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PostWithDetails {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  location: string | null;
  address: string | null;
  type: "sell" | "buy" | "service_offer" | "service_need";
  status: string;
  is_urgent: boolean;
  is_featured: boolean;
  negotiable: boolean;
  views: number;
  contact_phone: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  seller_name: string;
  seller_verified: boolean;
  seller_rating: number;
  seller_trade_count: number;
  seller_avatar: string | null;
  seller_phone: string | null;
  seller_email: string | null;
  images: string[];
}

interface UsePostsOptions {
  category?: string;
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

export function usePosts({ category, search, type, page = 1, pageSize = 12 }: UsePostsOptions = {}) {
  return useQuery({
    queryKey: ["posts", { category, search, type, page, pageSize }],
    queryFn: async (): Promise<{ posts: PostWithDetails[]; total: number }> => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          categories!posts_category_id_fkey(name, icon),
          profiles!inner(full_name, business_verified, rating, trade_count, avatar_url, phone, email),
          post_images(image_url, sort_order)
        `, { count: "exact" })
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("categories.name", category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (type && type !== "all") {
        if (type === "services") {
          query = query.in("type", ["service_offer" as const, "service_need" as const]);
        } else {
          query = query.eq("type", type as "sell" | "buy" | "service_offer" | "service_need");
        }
      }

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const posts: PostWithDetails[] = (data || [])
        .filter((p: any) => !category || p.categories?.name)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          address: p.address,
          type: p.type,
          status: p.status,
          is_urgent: p.is_urgent,
          is_featured: p.is_featured,
          negotiable: p.negotiable,
          views: p.views,
          contact_phone: p.contact_phone,
          created_at: p.created_at,
          user_id: p.user_id,
          category_id: p.category_id,
          category_name: p.categories?.name || null,
          category_icon: p.categories?.icon || null,
          seller_name: p.profiles?.full_name || "Unknown",
          seller_verified: p.profiles?.business_verified || false,
          seller_rating: Number(p.profiles?.rating) || 0,
          seller_trade_count: p.profiles?.trade_count || 0,
          seller_avatar: p.profiles?.avatar_url || null,
          seller_phone: p.profiles?.phone || null,
          seller_email: p.profiles?.email || null,
          images: (p.post_images || [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((img: any) => img.image_url),
        }));

      return { posts, total: count || 0 };
    },
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["post", id],
    enabled: !!id,
    queryFn: async (): Promise<PostWithDetails | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories!posts_category_id_fkey(name, icon),
          profiles!inner(full_name, business_verified, rating, trade_count, avatar_url, phone, email, show_phone_to_verified, allow_chat_messages),
          post_images(image_url, sort_order)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Increment views
      supabase.from("posts").update({ views: (data.views || 0) + 1 }).eq("id", id).then();

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        address: data.address,
        type: data.type,
        status: data.status,
        is_urgent: data.is_urgent,
        is_featured: data.is_featured,
        negotiable: data.negotiable,
        views: data.views,
        contact_phone: data.contact_phone,
        created_at: data.created_at,
        user_id: data.user_id,
        category_id: data.category_id,
        category_name: (data as any).categories?.name || null,
        category_icon: (data as any).categories?.icon || null,
        seller_name: (data as any).profiles?.full_name || "Unknown",
        seller_verified: (data as any).profiles?.business_verified || false,
        seller_rating: Number((data as any).profiles?.rating) || 0,
        seller_trade_count: (data as any).profiles?.trade_count || 0,
        seller_avatar: (data as any).profiles?.avatar_url || null,
        seller_phone: (data as any).profiles?.show_phone_to_verified ? (data as any).profiles?.phone : null,
        seller_email: (data as any).profiles?.email || null,
        images: ((data as any).post_images || [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((img: any) => img.image_url),
      };
    },
  });
}

export function formatETB(price: number | null): string {
  if (price === null || price === 0) return "Contact for price";
  return `ETB ${price.toLocaleString()}`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
