import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface SavedSearch {
  id: string;
  user_id: string;
  query: string;
  category: string | null;
  created_at: string;
  last_notified_at: string | null;
}

export function useSavedSearches() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedSearches = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("saved_searches" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSavedSearches((data || []) as unknown as SavedSearch[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  const saveSearch = async (query: string, category?: string) => {
    if (!user || !query.trim()) return;
    const { error } = await supabase
      .from("saved_searches" as any)
      .upsert(
        { user_id: user.id, query: query.trim().toLowerCase(), category: category || null } as any,
        { onConflict: "user_id,lower(query)" as any }
      );
    if (error) {
      if (error.code === "23505") {
        toast.info("You're already tracking this search!");
      } else {
        toast.error("Failed to save search alert");
      }
      return;
    }
    toast.success(`🔔 Alert set for "${query}" — we'll notify you when matching items are posted!`);
    fetchSavedSearches();
  };

  const removeSavedSearch = async (id: string) => {
    await supabase.from("saved_searches" as any).delete().eq("id", id);
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Search alert removed");
  };

  return { savedSearches, loading, saveSearch, removeSavedSearch, refetch: fetchSavedSearches };
}
