"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Briefcase, Lock, Save, Loader2, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import LogoUploader from "@/components/dashboard/LogoUploader";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For eye icon logic
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    location: "",
    logoUrl: "", // Added to track logo
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get("/business/dashboard-summary");
        if (res.data.business) {
          setFormData(res.data.business);
        }
      } catch (err) {
        console.log("No business profile found yet.");
      }
    };
    fetchBusiness();
  }, []);

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/business/update", formData);
      toast.success("Business profile updated");
    } catch (err) {
      toast.error("Failed to update business profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/change-password", passwordData);
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10 selection:bg-blue-500">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">Manage your brand and security.</p>
      </header>

      <div className="grid gap-8">
        
        {/* Account & Security Section */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-3">
            <User size={20} className="text-blue-600" />
            <h2 className="font-bold text-lg">Account Details</h2>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Your Email</label>
              <div className="h-14 rounded-2xl bg-zinc-100 dark:bg-black px-6 flex items-center gap-3 text-zinc-500">
                <Mail size={18} />
                <span className="font-medium">{user?.email || "Loading..."}</span>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
                  <Lock size={18} /> Update Password
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  {showPassword ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Reveal</>}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="h-14 rounded-2xl bg-zinc-50 dark:bg-black border-none"
                />
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="h-14 rounded-2xl bg-zinc-50 dark:bg-black border-none"
                />
              </div>
              <Button type="submit" className="rounded-2xl px-8 h-12 bg-zinc-900 text-white">
                Update Password
              </Button>
            </form>
          </div>
        </section>

        {/* Business Identity Section */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-3">
            <Briefcase size={20} className="text-blue-600" />
            <h2 className="font-bold text-lg">Business Identity</h2>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row gap-10 items-start border-b border-zinc-50 dark:border-zinc-800/50 pb-10">
            <div className="space-y-3 flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Brand Mark</label>
              <LogoUploader currentLogo={formData.logoUrl} />
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <form onSubmit={handleUpdateBusiness} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Business Name</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-14 rounded-2xl bg-zinc-50 dark:bg-black border-none px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Industry</label>
                    <Input 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="h-14 rounded-2xl bg-zinc-50 dark:bg-black border-none px-6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Location</label>
                    <Input 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="h-14 rounded-2xl bg-zinc-50 dark:bg-black border-none px-6"
                    />
                </div>

                <Button disabled={loading} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 text-lg shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                  {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save All Changes</>}
                </Button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}