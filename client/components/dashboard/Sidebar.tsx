"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PenTool, 
  ImageIcon, 
  TrendingUp, 
  Calendar, 
  Brain, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: PenTool, label: "Content Lab", href: "/dashboard/generate" },
  { icon: ImageIcon, label: "Visual Engine", href: "/dashboard/flyers" },
  { icon: TrendingUp, label: "Local Trends", href: "/dashboard/trends" },
  { icon: Calendar, label: "Pipeline", href: "/dashboard/schedule" },
  { icon: Brain, label: "AI DNA", href: "/dashboard/settings/ai-memory" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/auth/login");
  };

  return (
    <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 h-screen flex flex-col p-6 fixed bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl italic shadow-lg shadow-blue-500/30">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight leading-none">AI MARKETER</span>
          <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] mt-1 uppercase">Intelligence</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300",
                isActive 
                  ? "text-blue-600" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
              )}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10 border border-blue-100 dark:border-blue-800/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon size={20} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
              )} />
              
              {item.label}

              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <Link 
          href="/dashboard/settings" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
            pathname === "/dashboard/settings" ? "text-blue-600" : "text-zinc-500 hover:text-black hover:bg-zinc-100/50"
          )}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

      {/* Pro Badge (Visual Polish) */}
      <div className="mt-6 p-4 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-300 rounded-[2rem] text-white dark:text-black overflow-hidden relative group">
        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-widest opacity-60 uppercase mb-1">Current Plan</p>
          <p className="text-sm font-bold flex items-center gap-2">
            Pro Intelligence <Sparkles size={14} className="text-blue-400" />
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      </div>
    </aside>
  );
}