import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type AuthMode = "login" | "register";
type AuthMethod = "email" | "phone";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: method === "email" ? email : undefined,
          phone: method === "phone" ? phone : undefined,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email for verification.");
      } else {
        const credentials = method === "email"
          ? { email, password }
          : { phone, password };
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Google sign-in failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pb-20 md:pb-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">V</span>
            Visioner AI
          </Link>
          <p className="text-muted-foreground text-sm">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border bg-muted p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-5">
          {/* Method toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={method === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethod("email")}
              className="flex-1"
            >
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button
              type="button"
              variant={method === "phone" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethod("phone")}
              className="flex-1"
            >
              <Phone className="h-4 w-4" /> Phone
            </Button>
          </div>

          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {method === "email" ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 9XX XXX XXXX"
                  required
                  className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          {/* Social login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogleLogin}>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
