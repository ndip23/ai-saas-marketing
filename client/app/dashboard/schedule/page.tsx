"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Plus, Sparkles, Loader2, X } from "lucide-react";
import api from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PipelinePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentContent, setRecentContent] = useState([]);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedule");
      setSchedules(res.data);
    } catch (err) {
      console.error("Pipeline fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    const res = await api.get("/business/dashboard-summary");
    setRecentContent(res.data.recent);
  };

  useEffect(() => {
    fetchSchedules();
    fetchRecent();
  }, []);

  const handleScheduleSubmit = async (contentId: string) => {
    try {
      await api.post("/schedule/create", {
        contentId,
        scheduledFor: new Date(Date.now() + 86400000), // Default to tomorrow
      });
      toast.success("Added to Pipeline & Google Calendar synced!");
      setIsModalOpen(false);
      fetchSchedules();
    } catch (err) {
      toast.error("Scheduling failed");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-zinc-500 text-lg font-medium italic">Your upcoming brand presence.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white gap-2 h-14 px-8 shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Schedule Post
        </Button>
      </header>

      {/* Pipeline List */}
      <div className="space-y-6">
        {schedules.length === 0 ? (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-20 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 cursor-pointer hover:border-blue-500 transition-all group"
          >
             <Calendar className="mx-auto text-zinc-300 group-hover:text-blue-500 transition-colors mb-4" size={48} />
             <p className="text-zinc-400 font-medium italic">"Click here to schedule your first post."</p>
          </div>
        ) : (
          schedules.map((item: any, i: number) => (
             <PipelineCard key={item.id} item={item} i={i} />
          ))
        )}
      </div>

      {/* Scheduling Modal (Apple Style) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Select Content</h2>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {recentContent.map((c: any) => (
                  <div 
                    key={c.id} 
                    onClick={() => handleScheduleSubmit(c.id)}
                    className="p-5 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all"
                  >
                    <p className="font-bold text-sm truncate">{c.topic}</p>
                    <p className="text-[10px] text-zinc-400 uppercase mt-1 tracking-widest">{c.platform}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineCard({ item, i }: any) {
    return (
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="group flex items-center justify-between p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-sm hover:shadow-xl"
      >
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{item.content.topic}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                {new Date(item.scheduledFor).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="w-1 h-1 bg-zinc-300 rounded-full" />
              <span className="text-xs font-bold text-blue-600 uppercase">{item.status}</span>
            </div>
          </div>
        </div>
        <div className="h-10 px-6 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center text-[10px] font-black tracking-widest text-zinc-500 uppercase">
            {item.platform}
        </div>
      </motion.div>
    )
}