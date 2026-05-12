"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin, Zap, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "sonner";

interface Trend {
  topic: string;
  growth: string;
}

interface TrendData {
  location: string;
  industry: string;
  trends: Trend[];
}

export default function TrendsPage() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTrends = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Calling the REAL Backend connected to SerpApi
      const res = await api.get("/trends");
      setData(res.data);
      if (isRefresh) toast.success("Trends updated with live data.");
    } catch (err) {
      console.error("Trends Error:", err);
      toast.error("Unable to reach Google Trends. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleGenerate = (topic: string) => {
    // Encodes the trend topic and sends it to the Content Lab
    router.push(`/dashboard/generate?topic=${encodeURIComponent(topic)}`);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-black">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-zinc-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Scanning Global Markets...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-8 selection:bg-blue-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">Local Pulse</h1>
          <p className="text-zinc-500 flex items-center gap-2 font-medium text-lg">
            <MapPin size={20} className="text-blue-600" /> 
            Live opportunities for <span className="text-zinc-900 dark:text-white underline decoration-blue-500/30 underline-offset-4">{data?.location || "Your Area"}</span>
          </p>
        </div>
        <Button 
          onClick={() => fetchTrends(true)} 
          disabled={refreshing}
          className="rounded-full h-12 px-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 gap-2 font-bold shadow-sm"
        >
          {refreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
          Refresh Trends
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data?.trends.map((trend, i) => (
          <motion.div
            key={trend.topic}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3.5rem] hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Background Decorative Icon */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
              <TrendingUp size={120} />
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-blue-600">
                <Zap size={16} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Trend</span>
              </div>
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-xs font-black italic">
                {trend.growth}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold leading-tight mb-10 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors h-20 overflow-hidden line-clamp-3">
              {trend.topic}
            </h3>
            
            <Button 
              onClick={() => handleGenerate(trend.topic)}
              variant="secondary" 
              className="w-full h-14 rounded-2xl text-sm font-bold gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"
            >
              Generate Post <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Analytics Insight Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-10 bg-zinc-900 dark:bg-white rounded-[3.5rem] text-white dark:text-black flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight">Market Intelligence</h2>
          <p className="text-zinc-400 dark:text-zinc-500 max-w-lg leading-relaxed">
            We've identified these rising searches in your industry. Using these topics increases your content relevance score by up to 40%.
          </p>
        </div>
        <div className="relative z-10">
          <div className="px-8 py-4 bg-white/10 dark:bg-black/5 rounded-2xl backdrop-blur-xl border border-white/10 dark:border-black/5 font-bold text-sm tracking-widest uppercase">
            Industry: {data?.industry || "Marketing"}
          </div>
        </div>
        {/* Animated Glow */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px]" />
      </motion.div>
    </div>
  );
}