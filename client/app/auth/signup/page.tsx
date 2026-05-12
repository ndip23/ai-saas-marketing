"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Sparkles } from "lucide-react";

export default function SignupPage() {
  // 1. Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hooks
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 3. Handle Signup Logic
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      // API call to backend signup endpoint
      const response = await api.post("/auth/signup", { 
        name, 
        email, 
        password 
      });
      
      const { token, data } = response.data;
      
      // Save user to Zustand and localStorage
      setAuth(data.user, token);
      
      toast.success("Account created successfully!");
      
      // Redirect to onboarding to setup their business identity
      setTimeout(() => {
        router.push("/onboarding");
      }, 1200);

    } catch (error: any) {
      console.error("Signup error:", error);
      const message = error.response?.data?.message || "Something went wrong. Try a different email.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-black p-4 selection:bg-blue-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] space-y-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-zinc-800"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">Start generating conversion-focused AI content.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Full Name</label>
            <Input 
              placeholder="John Doe" 
              className="h-14 rounded-2xl bg-zinc-100/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
            <Input 
              type="email" 
              placeholder="john@example.com" 
              className="h-14 rounded-2xl bg-zinc-100/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Password</label>
            <Input 
              type="password" 
              placeholder="Min. 6 characters" 
              className="h-14 rounded-2xl bg-zinc-100/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Creating account...</span>
              </div>
            ) : "Join AI Marketer"}
          </Button>
        </form>

        <div className="space-y-4">
          <p className="text-center text-[11px] text-zinc-400 px-6">
            By clicking "Join AI Marketer", you agree to our Terms of Service and Privacy Policy.
          </p>
          
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-center text-sm text-zinc-500">
              Already have an account? <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline underline-offset-4">Log in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}