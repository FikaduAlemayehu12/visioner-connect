import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";

type AuthMode = "login" | "register";
type AuthMethod = "email" | "phone";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          {/* Method toggle */}
          <div className="flex gap-2">
            <Button
              variant={method === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setMethod("email")}
              className="flex-1"
            >
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button
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
                placeholder="Enter your full name"
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
                  placeholder="you@example.com"
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
                  placeholder="+251 9XX XXX XXXX"
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
                placeholder="Enter your password"
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

          <Button className="w-full" size="lg">
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

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" size="sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              Facebook
            </Button>
          </div>

          <Button variant="outline" className="w-full" size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            Continue with Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}
