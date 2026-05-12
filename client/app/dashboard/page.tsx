"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  ImageIcon, 
  Zap, 
  BarChart3, 
  Loader2, 
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react";
import api from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/business/dashboard-summary");
        // Your logic: res.data.stats contains contentCount and flyerCount
        setStats(res.data);
        setRecent(res.data.recent);
      } catch (err) {
        console.error("Failed to fetch real data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-black">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-zinc-500 font-medium animate-pulse">Syncing your brand engine...</p>
    </div>
  );

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 selection:bg-blue-500">
      {/* Premium Header with Brand Identity Logic */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Greetings, <span className="text-blue-600">{stats?.business?.name || "Brand Owner"}</span>.
          </h1>
          <p className="text-zinc-500 text-lg font-medium">
            Everything is ready for <span className="text-zinc-900 dark:text-white underline underline-offset-4 decoration-blue-500/30">{stats?.business?.industry || "your industry"}</span> today.
          </p>
        </motion.div>

        {/* Real-time Logo Display */}
        {stats?.business?.logoUrl && (
          <motion.div 
            initial={{ scale: 0, rotate: -10 }} 
            animate={{ scale: 1, rotate: 0 }} 
            className="relative group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/40 transition-all duration-700" />
            <img 
              src={stats.business.logoUrl} 
              className="relative w-24 h-24 object-contain rounded-3xl bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white dark:border-zinc-800" 
              alt="Brand Logo"
            />
          </motion.div>
        )}
      </header>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Content" value={stats?.stats?.contentCount || 0} icon={MessageSquare} color="text-blue-500" delay={0.1} />
        <StatCard label="Flyers" value={stats?.stats?.flyerCount || 0} icon={ImageIcon} color="text-purple-500" delay={0.2} />
        <StatCard label="Trends" value="Active" icon={Zap} color="text-amber-500" delay={0.3} />
        <StatCard label="Memory" value="Synced" icon={BarChart3} color="text-green-500" delay={0.4} />
      </div>

      {/* Main Content: Recent Activity & AI Pro-Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold tracking-tight">Recent Generations</h2>
            <Link href="/dashboard/generate" className="text-sm font-bold text-blue-600 hover:opacity-70 flex items-center gap-1 transition-all">
              Create New <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recent.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="p-16 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Sparkles className="text-zinc-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white">No content generated yet</h3>
                <p className="text-zinc-500 text-sm mt-1">Start by using the Content Lab or Visual Engine.</p>
              </motion.div>
            ) : (
              recent.map((item: any, i: number) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-default"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                      {item.platform === 'FLYER' 
                        ? <ImageIcon size={20} className="text-purple-500" /> 
                        : <MessageSquare size={20} className="text-blue-500" />
                      }
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {item.topic.length > 40 ? item.topic.substring(0, 40) + "..." : item.topic}
                      </h4>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {item.platform} • {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* AI Insight Sidebar Widget */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold tracking-tight px-2">Market Pulse</h2>
           <div className="bg-zinc-900 dark:bg-white p-8 rounded-[3rem] text-white dark:text-black shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 dark:bg-black/5 font-bold rounded-2xl flex items-center justify-center">
                   <TrendingUp className="text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Local Growth Alert</h3>
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed">
                    Search volume for <span className="text-white dark:text-black font-bold italic">"{stats?.business?.industry || 'Services'}"</span> is up 24% in your area this week. 
                  </p>
                </div>
                <Link href="/dashboard/generate" className="block">
                  <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    Capture Trend
                  </button>
                </Link>
              </div>
              {/* Animated Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-8 rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500 group border-b-4 hover:border-b-blue-500">
        <div className={`${color} mb-6 w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
        <h3 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">{value}</h3>
      </Card>
    </motion.div>
  );
}