import { Link, useLocation } from "react-router-dom";
import { MessageSquare, PlusCircle, Heart, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/NotificationBell";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Browse", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-heading text-xl font-bold text-foreground group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-primary-foreground text-sm font-black shadow-md group-hover:shadow-lg transition-shadow">
            V
          </span>
          <span className="hidden sm:inline">Visioner AI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                location.pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          {user ? (
            <>
              <NotificationBell />
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link to="/favorites"><Heart className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link to="/chats"><MessageSquare className="h-4 w-4" /></Link>
              </Button>
              <Button size="sm" className="gap-1.5 rounded-xl gradient-bg border-0 shadow-md hover:shadow-lg transition-shadow" asChild>
                <Link to="/post/create"><PlusCircle className="h-4 w-4" /> Post</Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link to="/profile"><User className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="rounded-xl gradient-bg border-0 shadow-md" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-card overflow-hidden md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.path ? "text-primary bg-primary/5" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3 mt-2 border-t border-border">
                {user ? (
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => { signOut(); setMobileOpen(false); }}>
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" className="flex-1 rounded-xl gradient-bg border-0" asChild>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
