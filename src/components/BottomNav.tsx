import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";

const items = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Post", path: "/post/create", icon: PlusCircle },
  { label: "Chats", path: "/chats", icon: MessageSquare },
  { label: "Profile", path: "/profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
