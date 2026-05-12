"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, Sparkles, Sliders, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api-client";
import { toast } from "sonner";

export default function AIDNAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dna, setDna] = useState({
    preferredTone: "Professional",
    humorScore: 0.5,
    emojiDensity: 0.3
  });

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const res = await api.get("/ai/dna");
        setDna(res.data);
      } catch (err) {
        console.error("Failed to load DNA");
      } finally {
        setLoading(false);
      }
    };
    fetchDNA();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/ai/dna", dna);
      toast.success("AI DNA updated successfully!");
    } catch (err) {
      toast.error("Failed to sync personality.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4">
          <BrainCircuit className="text-blue-600" size={48} /> AI DNA
        </h1>
        <p className="text-zinc-500 text-lg font-medium">Fine-tune your brand's unique AI personality.</p>
      </header>

      <div className="grid gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] shadow-sm space-y-10"
        >
          {/* Tone Selector */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Target Tone</label>
            <div className="flex flex-wrap gap-2">
              {["Professional", "Witty", "Aggressive", "Luxury", "Minimalist"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDna({...dna, preferredTone: t})}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                    dna.preferredTone === t ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Personality Sliders */}
          <div className="space-y-8">
             <DNASlider 
                label="Humor & Wit" 
                value={dna.humorScore} 
                onChange={(v) => setDna({...dna, humorScore: v})} 
             />
             <DNASlider 
                label="Emoji Usage" 
                value={dna.emojiDensity} 
                onChange={(v) => setDna({...dna, emojiDensity: v})} 
             />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full h-16 rounded-[2rem] bg-black dark:bg-white text-white dark:text-black text-xl font-bold gap-3"
          >
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Sync Personality</>}
          </Button>
        </motion.div>

        {/* AI Insight Box */}
        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-[2.5rem] flex gap-6 items-center">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
               <Sparkles size={28} />
            </div>
            <p className="text-blue-800 dark:text-blue-300 font-medium italic">
              "When you sync your DNA, I will adjust my vocabulary and sentence structure to match your brand's specific frequency."
            </p>
        </div>
      </div>
    </div>
  );
}

function DNASlider({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-zinc-400">
                <span>{label}</span>
                <span className="text-blue-600">{Math.round(value * 100)}%</span>
            </div>
            <input 
                type="range" min="0" max="1" step="0.01" 
                value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    )
}