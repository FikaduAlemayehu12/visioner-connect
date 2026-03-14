import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, useMessages, type Conversation } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ChevronLeft, Loader2, Smile } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { timeAgo } from "@/hooks/usePosts";
import { motion } from "framer-motion";

export default function Chats() {
  const { user, loading: authLoading } = useAuth();
  const [activeConvo, setActiveConvo] = useState<string | undefined>();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container py-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm" style={{ height: "calc(100vh - 8rem)" }}>
          <div className="flex h-full">
            {/* Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${activeConvo ? "hidden md:flex" : "flex"}`}>
              <div className="p-4 border-b border-border">
                <h1 className="text-lg font-heading font-bold text-foreground">Messages</h1>
              </div>
              <ConversationList activeId={activeConvo} onSelect={setActiveConvo} />
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${activeConvo ? "flex" : "hidden md:flex"}`}>
              {activeConvo ? (
                <ChatThread conversationId={activeConvo} onBack={() => setActiveConvo(undefined)} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                      <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationList({ activeId, onSelect }: { activeId?: string; onSelect: (id: string) => void }) {
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-2 text-muted-foreground">
          <p className="text-sm">No conversations yet</p>
          <Button size="sm" variant="outline" className="rounded-xl" asChild>
            <Link to="/">Browse listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/50 transition-all ${
            activeId === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm overflow-hidden">
              {c.other_user_avatar ? (
                <img src={c.other_user_avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                c.other_user_name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-foreground truncate">{c.other_user_name}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(c.last_message_at)}</span>
              </div>
              {c.post_title && (
                <p className="text-[11px] text-primary truncate">Re: {c.post_title}</p>
              )}
              <p className="text-xs text-muted-foreground truncate">{c.last_message || "No messages yet"}</p>
            </div>
            {c.unread_count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full gradient-bg text-primary-foreground text-[10px] font-bold shrink-0 shadow-sm">
                {c.unread_count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatThread({ conversationId, onBack }: { conversationId: string; onBack: () => void }) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useMessages(conversationId);
  const [input, setInput] = useState("");
  const { conversations } = useConversations();
  const convo = conversations.find((c) => c.id === conversationId);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-3 bg-muted/20">
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs overflow-hidden">
          {convo?.other_user_avatar ? (
            <img src={convo.other_user_avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            (convo?.other_user_name || "?").charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{convo?.other_user_name || "Chat"}</p>
          {convo?.post_title && (
            <p className="text-[11px] text-muted-foreground truncate">Re: {convo.post_title}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <Smile className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user?.id;
            return (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "gradient-bg text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex gap-2 bg-muted/10">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          className="flex-1 rounded-xl"
        />
        <Button size="icon" className="rounded-xl gradient-bg border-0 h-10 w-10 shadow-md" onClick={handleSend} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
