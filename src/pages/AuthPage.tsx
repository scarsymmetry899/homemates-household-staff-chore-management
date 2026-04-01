import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  signInWithGoogle,
  signInWithEmail,
  createAccount,
  checkRedirectResult,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { toast } from "sonner";

interface AuthPageProps {
  onLogin: (name?: string) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Google redirect result on page load (after signInWithRedirect returns)
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    checkRedirectResult().then(({ user, error }) => {
      if (cancelled) return;
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "there";
        onLogin(name.charAt(0).toUpperCase() + name.slice(1));
      } else if (error) {
        // Only surface if it's a real error (not just "no redirect result")
        if (error.code !== "unknown" && error.code !== "") {
          toast.error(error.message);
        }
      }
    });
    return () => { cancelled = true; };
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        let result;
        if (isSignUp) {
          if (!fullName.trim()) { toast.error("Please enter your name"); return; }
          result = await createAccount(email, password, fullName.trim());
        } else {
          result = await signInWithEmail(email, password);
        }
        if (result.user) {
          const name = result.user.displayName || email.split("@")[0];
          onLogin(name.charAt(0).toUpperCase() + name.slice(1));
        } else if (result.error) {
          toast.error(result.error.message);
        }
      } else {
        // Fallback: local auth (no Firebase keys set)
        const name = isSignUp && fullName ? fullName : email.split("@")[0];
        onLogin(name.charAt(0).toUpperCase() + name.slice(1));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        const { user, error } = await signInWithGoogle();
        if (user) {
          const name = user.displayName || user.email?.split("@")[0] || "there";
          onLogin(name.charAt(0).toUpperCase() + name.slice(1));
        } else if (error) {
          // null error + null user = redirect in progress (page navigating away)
          toast.error(error.message, {
            description: error.code === "auth/unauthorized-domain"
              ? "Open Firebase Console → Authentication → Settings → Authorized Domains and add this domain."
              : undefined,
            duration: 8000,
          });
          setLoading(false);
        }
        // If both null → redirect is happening, keep loading spinner while page navigates
      } else {
        onLogin("there");
        toast.info("Firebase not configured", {
          description: "Add VITE_FIREBASE_* keys to .env.local to enable Google sign-in.",
        });
        setLoading(false);
      }
    } catch {
      toast.error("Unexpected error during Google sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-3">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            src={logo}
            alt="Homemaker"
            className="w-32 h-32 mx-auto object-contain"
          />
          <p className="text-sm text-muted-foreground">Your household, simplified.</p>
          {!isFirebaseConfigured && (
            <p className="text-[10px] text-muted-foreground/60 bg-muted/30 rounded-lg px-3 py-1.5">
              Demo mode — add Firebase keys to enable persistent auth
            </p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full glass-card rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          <span className="text-sm font-semibold text-foreground">Continue with Google</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full glass-card rounded-2xl py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full glass-card rounded-2xl py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full glass-card rounded-2xl py-3.5 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full btn-estate text-primary-foreground font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isSignUp ? "Create Account" : "Sign In"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-secondary font-semibold">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
