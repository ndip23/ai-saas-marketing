"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed the broken Textarea import
import LogoUploader from "@/components/dashboard/LogoUploader"; // Fixed default import
import { Loader2, Check, Briefcase, Palette } from "lucide-react";
import api from "@/lib/api-client";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    location: "",
    brandColors: ["#000000"],
    logoUrl: "" // Added to match Step 2 logic
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinalize = async () => {
    if (!formData.name || !formData.industry) {
      return toast.error("Please fill in the business name and industry.");
    }

    setLoading(true);
    try {
      await api.post("/business/create", formData);
      toast.success("Business profile created! Redirecting to dashboard...");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col items-center justify-center p-6 selection:bg-blue-500">
      <div className="w-full max-w-2xl">
        
        {/* Apple-style Progress Indicator */}
        <div className="flex justify-between mb-4 px-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {step === 1 ? "Business Context" : "Visual Identity"}
          </span>
          <span className="text-xs font-bold text-zinc-400">Step {step} of 2</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-xl border border-white dark:border-zinc-800"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Tell us about your business.</h1>
                <p className="text-zinc-500">This helps the AI understand your market positioning.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Business Name" 
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none" 
                  />
                  <Input 
                    placeholder="Industry (e.g. Real Estate)" 
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none" 
                  />
                </div>
                <Input 
                    placeholder="Location (e.g. Lagos, Nigeria)" 
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none" 
                />
                {/* Replaced broken Textarea component with styled standard textarea */}
                <textarea 
                  placeholder="What makes your business unique? (Description)" 
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full min-h-[150px] rounded-[2rem] bg-zinc-50 dark:bg-zinc-800 border-none p-6 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
                />
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!formData.name || !formData.industry}
                className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-lg font-semibold group"
              >
                Next Step <Briefcase className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-xl border border-white dark:border-zinc-800"
            >
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight">Brand Identity.</h1>
                <p className="text-zinc-500">Select your aesthetic to guide the AI flyer engine.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center transition-all bg-zinc-50/50 dark:bg-black/20">
                  <LogoUploader currentLogo={formData.logoUrl} />
                </div>

                <div className="space-y-4 bg-zinc-50 dark:bg-black/20 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 px-2">
                    <Palette size={14} /> Brand Colors
                  </p>
                  <div className="flex flex-wrap gap-3 p-2">
                    {['#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateField("brandColors", [color])}
                        className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                          formData.brandColors.includes(color) 
                            ? 'border-blue-500 scale-110 shadow-lg' 
                            : 'border-white dark:border-zinc-800'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {formData.brandColors.includes(color) && <Check size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)} 
                  className="h-16 px-8 rounded-2xl font-semibold"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleFinalize} 
                  disabled={loading}
                  className="flex-1 h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      <span>Finalizing...</span>
                    </div>
                  ) : (
                    "Finalize Profile"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}