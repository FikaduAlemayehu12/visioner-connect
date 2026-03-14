import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/search/external", icon: Search },
  { label: "Post", path: "/post/create", icon: PlusCircle, isCenter: true },
  { label: "Chats", path: "/chats", icon: MessageSquare },
  { label: "Profile", path: "/profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2">
        {items.map((item) => {
          const active = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);

          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-center -mt-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
                  <item.icon className="h-5 w-5" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              <item.icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottom-nav-dot"
                  className="absolute -top-0.5 h-1 w-1 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
