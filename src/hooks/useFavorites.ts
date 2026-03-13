import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();

  const { data: favoriteIds = [], ...rest } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("post_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data || []).map((f: any) => f.post_id as string);
    },
  });

  return { favoriteIds, ...rest };
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isFavorited }: { postId: string; isFavorited: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, post_id: postId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isFavorited }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
    },
    onError: () => {
      toast.error("Failed to update favorites");
    },
  });
}
