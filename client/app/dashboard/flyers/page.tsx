"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Wand2, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from '@/lib/api-client';

// 1. Define a proper Type for the flyer to fix the "any" red line
interface FlyerData {
  id: string;
  imageUrl: string;
  topic: string;
  platform: string;
}

export default function FlyerPage() {
  const [topic, setTopic] = useState<string>("");
  const [intent, setIntent] = useState<string>("Sales");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use the Interface here instead of <any>
  const [flyer, setFlyer] = useState<FlyerData | null>(null);

  const handleGenerate = async () => {
    if (!topic) {
      return toast.error("Please describe what the flyer is for.");
    }

    setLoading(true);
    try {
      const res = await api.post('/flyer/generate', { 
        topic, 
        intent,
        emotion: intent === "Sales" ? "Urgency" : "Trust"
      });
      
      setFlyer(res.data);
      toast.success("Visual generated successfully!");
    } catch (err: unknown) {
      // Use proper error handling for TypeScript
      const errorMessage = (err as any).response?.data?.message || "Visual engine is busy.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

 const handleDownload = async () => {
  if (!flyer?.imageUrl) return;

  try {
    toast.loading("Preparing your download...");

    // 1. Fetch the image as a blob (This allows true 'one-click' download)
    const response = await fetch(flyer.imageUrl);
    const blob = await response.blob();
    
    // 2. Create a local URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // 3. Trigger the browser download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `AI-Flyer-${Date.now()}.png`; // Custom filename
    document.body.appendChild(link);
    link.click();
    
    // 4. Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
    toast.dismiss();
    toast.success("Flyer saved to your device!");
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: Just open the URL in a new tab if blob fails
    window.open(flyer.imageUrl, "_blank");
  }
};

  return (
    <div className="max-w-6xl mx-auto py-12 px-8 selection:bg-blue-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left: Settings */}
        <div className="space-y-10">
          <header className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">Visual Engine</h1>
            <p className="text-zinc-500 text-lg">Generate purpose-driven marketing visuals.</p>
          </header>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Marketing Intent</label>
              <div className="flex flex-wrap gap-2">
                {["Sales", "Trust", "Announcement", "Educational"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setIntent(opt)}
                    className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                      intent === opt 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Context & Details</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. A premium discount for our new organic skincare line launching this Friday."
                className="w-full h-44 p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-lg shadow-sm"
              />
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full h-16 rounded-[2rem] bg-black dark:bg-white text-white dark:text-black text-xl font-bold gap-3 shadow-xl hover:opacity-90 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="animate-pulse" /> Designing...
                </span>
              ) : (
                <><Wand2 size={22} /> Generate Visual</>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Preview Area */}
        <div className="sticky top-12">
          <AnimatePresence mode="wait">
            {!flyer && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 gap-6 bg-zinc-50/50 dark:bg-zinc-900/20"
              >
                <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center shadow-inner">
                   <ImageIcon size={40} className="opacity-20" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-zinc-500 tracking-tight text-lg">Canvas is empty</p>
                  <p className="text-sm">Describe your promo to start designing.</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-[4rem] bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-8 relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase animate-pulse">Orchestrating Pixels</p>
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 bg-blue-500 blur-[100px]" 
                />
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="group relative aspect-square rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-[12px] border-white dark:border-zinc-800 bg-white"
              >
                {/* 2. Added key attributes to stop the Yellow warnings and Referrer errors */}
              <img 
  src={flyer.imageUrl} 
  alt="AI Flyer" 
  className="w-full h-full object-cover" 
/>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDownload} size="lg" className="rounded-full bg-white text-black hover:bg-zinc-100 gap-2 font-bold px-8">
                      <Download size={20} /> Download
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}