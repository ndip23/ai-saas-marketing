"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      // Simulate Whisper processing
      setTimeout(() => {
        setIsProcessing(false);
        setComplete(true);
      }, 3000);
    } else {
      setIsRecording(true);
      setComplete(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center text-center">
      <h3 className="text-xl font-semibold mb-2">Record Marketing Context</h3>
      <p className="text-zinc-500 text-sm mb-8">Speak naturally about a recent customer success or a common complaint.</p>

      <div className="relative mb-8">
        {isRecording && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full"
          />
        )}
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "secondary"}
          className="relative w-20 h-20 rounded-full shadow-lg"
        >
          {isRecording ? <Square fill="white" /> : <Mic size={32} />}
        </Button>
      </div>

      <div className="min-h-[40px]">
        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-600 animate-pulse">
            <Loader2 className="animate-spin" />
            <span className="font-medium text-sm">Whisper is transcribing...</span>
          </div>
        )}
        {complete && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">Insight stored in Memory</span>
          </div>
        )}
      </div>
    </div>
  );
};