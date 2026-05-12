"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-zinc-900 dark:text-white selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white italic">A</div>
          AI Marketer
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="rounded-full px-6">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-full px-6 bg-black dark:bg-white text-white dark:text-black cursor-pointer">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto pt-20 pb-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
            <Sparkles size={16} />
            <span>Localized AI Marketing is here</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Content that <span className="text-blue-600">understands</span> your business.
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The first AI marketing platform that learns your brand voice, analyzes local trends, and generates visuals with intent.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="rounded-full cursor-pointer px-10 h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-xl shadow-blue-500/20">
                Start Generating Free <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Abstract UI Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-24 relative"
        >
          <div className="relative z-10 mx-auto max-w-4xl aspect-[16/10] bg-white dark:bg-zinc-900 rounded-[3rem] border-8 border-white dark:border-zinc-800 shadow-2xl overflow-hidden">
             {/* Mock Dashboard Content */}
             <div className="p-8 flex flex-col h-full bg-zinc-50 dark:bg-black/50">
                <div className="flex gap-4 mb-8">
                  <div className="w-1/3 h-32 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800" />
                  <div className="w-1/3 h-32 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800" />
                  <div className="w-1/3 h-32 bg-blue-600 rounded-3xl" />
                </div>
                <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800" />
             </div>
          </div>
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-[120px] -z-10 rounded-full" />
        </motion.div>
      </main>
    </div>
  );
}