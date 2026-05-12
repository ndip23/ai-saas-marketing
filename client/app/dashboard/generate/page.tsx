"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Layout, Megaphone, Target, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAIContent } from "@/services/contentService";
import { toast } from "sonner";

// Main Component with Suspense for SearchParams
export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Sparkles className="animate-spin text-blue-600" /></div>}>
      <GeneratorContent />
    </Suspense>
  );
}

function GeneratorContent() {
  const searchParams = useSearchParams();
  
  // 1. State Management
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [mode, setMode] = useState("PROBLEM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // 2. Sync topic from URL (Local Trend Engine Integration)
  useEffect(() => {
    const trendTopic = searchParams.get("topic");
    if (trendTopic) {
      setTopic(trendTopic);
      setMode("TREND"); // Auto-switch to Trend mode if coming from Trends page
    }
  }, [searchParams]);

  // 3. Generation Logic
  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a topic first.");
    
    setLoading(true);
    setResult(null); // Clear old result for entrance animation

    try {
      const data = await generateAIContent({ platform, topic, mode });
      setResult(data.content);
      toast.success(`${platform} content ready!`);
    } catch (err: any) {
      toast.error("Gemini is currently busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `${result.hook}\n\n${result.body}\n\n${result.cta}\n\n${result.hashtags?.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 selection:bg-blue-500">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold tracking-tighter">Content Lab</h1>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">Select your platform and let Gemini AI craft your message.</p>
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 p-2 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
           {/* Platform Selector */}
           <div className="flex p-1 bg-zinc-100 dark:bg-black rounded-[2rem] gap-1">
              {["Instagram", "Facebook", "WhatsApp", "X"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all ${
                    platform === p ? "bg-white dark:bg-zinc-800 text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {p}
                </button>
              ))}
           </div>

           {/* Mode Selector */}
           <div className="flex p-1 bg-zinc-100 dark:bg-black rounded-[2rem] gap-1">
              {[
                { id: "PROBLEM", label: "Problem", icon: Target },
                { id: "AUTHORITY", label: "Authority", icon: Megaphone },
                { id: "TREND", label: "Trend", icon: Sparkles },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all ${
                    mode === m.id ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400"
                  }`}
                >
                  <m.icon size={12} /> {m.label}
                </button>
              ))}
           </div>
        </div>

        {/* Main Input Box */}
        <div className="space-y-8 text-center pt-4">
          <div className="relative group">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What are we promoting today?"
              className="w-full text-3xl font-semibold bg-transparent border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-blue-500 outline-none pb-8 text-center transition-all placeholder:opacity-20"
            />
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="rounded-full px-16 h-16 bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-all text-lg font-bold shadow-2xl shadow-blue-500/10"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>AI is Thinking...</span>
              </div>
            ) : <><Sparkles className="mr-2" size={20} /> Generate Content</>}
          </Button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group"
            >
              <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-blue-600">
                      <Layout size={14} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Hook</span>
                   </div>
                   <p className="text-3xl font-bold tracking-tight leading-tight text-zinc-900 dark:text-white">
                      {result.hook}
                   </p>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-zinc-400">
                      <Target size={14} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Value</span>
                   </div>
                   <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                      {result.body}
                   </p>
                </div>

                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Call to Action</p>
                     <p className="text-xl font-bold text-zinc-900 dark:text-white underline decoration-blue-500 underline-offset-8 decoration-2">{result.cta}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {result.hashtags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 tracking-tight">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={copyToClipboard} 
                    className="rounded-2xl h-16 w-16 bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white transition-all shadow-inner"
                  >
                    {copied ? <Check className="text-green-500" /> : <Copy size={24} />}
                  </Button>
                </div>
              </div>

              {/* Decorative Apple-style Background Elements */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}