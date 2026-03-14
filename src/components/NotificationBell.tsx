import { Bell, MessageSquare, Search, Package } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function getNotificationIcon(type: string) {
  switch (type) {
    case "message": return <MessageSquare className="h-4 w-4 text-primary" />;
    case "search_match": return <Search className="h-4 w-4 text-secondary" />;
    default: return <Package className="h-4 w-4 text-accent" />;
  }
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (n: typeof notifications[0]) => {
    markAsRead(n.id);
    if (n.type === "message" && n.data?.conversation_id) {
      navigate(`/chats?id=${n.data.conversation_id}`);
    } else if (n.type === "search_match" && n.data?.post_id) {
      navigate(`/listing/${n.data.post_id}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 rounded-xl">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full gradient-bg text-[10px] font-bold text-primary-foreground shadow-md"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden" align="end">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
          <h3 className="text-sm font-heading font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-medium">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 ${
                  !n.read ? "bg-primary/[0.03]" : ""
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                </div>
                {!n.read && (
                  <div className="shrink-0 mt-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
