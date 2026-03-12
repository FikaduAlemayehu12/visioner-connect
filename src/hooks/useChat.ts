import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Conversation {
  id: string;
  post_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  other_user_name: string;
  other_user_avatar: string | null;
  post_title: string | null;
  last_message: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: convos, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
      return;
    }

    const enriched: Conversation[] = await Promise.all(
      (convos || []).map(async (c: any) => {
        const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;

        const [profileRes, postRes, msgRes, unreadRes] = await Promise.all([
          supabase.from("profiles").select("full_name, avatar_url").eq("user_id", otherId).maybeSingle(),
          c.post_id ? supabase.from("posts").select("title").eq("id", c.post_id).maybeSingle() : Promise.resolve({ data: null }),
          supabase.from("messages").select("content").eq("conversation_id", c.id).order("created_at", { ascending: false }).limit(1),
          supabase.from("messages").select("id", { count: "exact", head: true }).eq("conversation_id", c.id).eq("read", false).neq("sender_id", user.id),
        ]);

        return {
          id: c.id,
          post_id: c.post_id,
          buyer_id: c.buyer_id,
          seller_id: c.seller_id,
          last_message_at: c.last_message_at,
          created_at: c.created_at,
          other_user_name: profileRes.data?.full_name || "User",
          other_user_avatar: profileRes.data?.avatar_url || null,
          post_title: postRes.data?.title || null,
          last_message: msgRes.data?.[0]?.content || null,
          unread_count: unreadRes.count || 0,
        };
      })
    );

    setConversations(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching messages:", error);
      setMessages((data as Message[]) || []);
      setLoading(false);

      // Mark as read
      if (user) {
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("conversation_id", conversationId)
          .neq("sender_id", user.id)
          .eq("read", false);
      }
    };

    fetchMessages();
  }, [conversationId, user]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => [...prev, newMsg]);

        // Auto-mark as read if we're viewing
        if (user && newMsg.sender_id !== user.id) {
          supabase.from("messages").update({ read: true }).eq("id", newMsg.id).then();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !conversationId || !content.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
      console.error(error);
      return;
    }

    // Update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  };

  return { messages, loading, sendMessage };
}

export async function getOrCreateConversation(postId: string, sellerId: string, buyerId: string): Promise<string | null> {
  // Check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("post_id", postId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ post_id: postId, buyer_id: buyerId, seller_id: sellerId })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    toast.error("Failed to start conversation");
    return null;
  }

  return created.id;
}
