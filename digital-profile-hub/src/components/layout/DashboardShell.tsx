import { useState, ReactNode } from "react";
import { Menu, X, ChevronRight, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

interface SidebarItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface DashboardShellProps {
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  title: string;
}

const DashboardShell = ({ items, activeTab, onTabChange, children, title }: DashboardShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#020611]">
      <Navbar />
      
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Mobile Toggle - Gold Gradient */}
        <button
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold text-brand-dark shadow-[0_8px_30px_rgb(212,175,55,0.3)] md:hidden active:scale-90 transition-all"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar - Midnight Navy */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-brand-dark transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-[calc(100vh-80px)] shrink-0",
          sidebarOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="flex flex-col h-full py-8 px-4 overflow-hidden">
            
            <div className="px-4 mb-10 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="h-3 w-3 text-brand-gold/50" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Workspace</p>
              </div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase truncate">
                {title}
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => {
                const isActive = activeTab === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => { onTabChange(item.value); setSidebarOpen(false); }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs transition-all duration-300",
                      isActive
                        ? "bg-brand-gold/10 text-brand-gold shadow-[inset_0_0_12px_rgba(212,175,55,0.05)] border border-brand-gold/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-brand-gold" : "text-slate-500 group-hover:text-slate-300"
                      )}>
                        {item.icon || <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                      </span>
                      
                      <span className="truncate text-left block w-full font-black uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    
                    {isActive && (
                       <div className="h-1 w-1 rounded-full bg-brand-gold shadow-[0_0_8px_#D4AF37] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto px-4 pt-6 border-t border-white/5 shrink-0">
               <div className="flex items-center justify-between">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    v2.0.4 Premium
                 </p>
                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
               </div>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content - Contrast Background */}
        <main className="flex-1 min-w-0 bg-[#050B1A] relative">
          {/* Subtle Background Radial Gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-7xl p-6 md:p-10">
              <div className="w-full">
                 {children}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;