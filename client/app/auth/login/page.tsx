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
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  // 1. State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hooks for navigation and global auth state
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 3. Handle Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);

    try {
      // API call to our backend
      const response = await api.post("/auth/login", { email, password });
      
      const { token, data } = response.data;
      
      // Save user and token to Zustand (which persists to localStorage)
      setAuth(data.user, token);
      
      toast.success(`Welcome back, ${data.user.name}!`);
      
      // Redirect to dashboard after short delay for better UX
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-black p-4 selection:bg-blue-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 dark:shadow-none"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome Back</h1>
          <p className="text-zinc-500 mt-2 text-sm">Log in to manage your AI marketing.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
            <Input 
              type="email" 
              placeholder="name@company.com" 
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
              placeholder="••••••••" 
              className="h-14 rounded-2xl bg-zinc-100/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Verifying...</span>
              </div>
            ) : "Log In"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100 dark:border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400 font-medium tracking-widest">Help</span></div>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline underline-offset-4">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}