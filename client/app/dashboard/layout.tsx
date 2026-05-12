import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F5F5F7] dark:bg-black overflow-hidden">
      {/* 1. Permanent Sidebar */}
      <Sidebar />
      
      {/* 2. Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto pl-72"> 
        {children}
      </main>
    </div>
  );
}