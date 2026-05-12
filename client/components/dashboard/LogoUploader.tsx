"use client";
import { useState } from "react";
import { Upload, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api-client";

export default function LogoUploader({ currentLogo }: { currentLogo?: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentLogo);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64 for the API
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      setUploading(true);

      try {
        const res = await api.post("/business/upload-logo", { image: base64data });
        setPreview(res.data.logoUrl);
        toast.success("Logo uploaded to Cloudinary!");
      } catch (err) {
        toast.error("Failed to upload logo.");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-all hover:border-blue-500">
        {preview ? (
          <img src={preview} alt="Logo" className="w-full h-full object-contain p-4" />
        ) : (
          <ImageIcon className="text-zinc-300" size={32} />
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="text-white animate-spin" />
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {uploading ? "Uploading..." : "Click to change logo"}
      </p>
    </div>
  );
}