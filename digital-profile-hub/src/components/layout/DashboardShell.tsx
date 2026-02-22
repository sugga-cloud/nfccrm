import { useState, ReactNode } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar />
      
      <div className="flex flex-1 relative overflow-hidden"> {/* Added overflow-hidden to parent */}
        
        {/* Mobile Toggle */}
        <button
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f97316] text-white shadow-xl md:hidden active:scale-90 transition-transform"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-100 bg-white transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-[calc(100vh-64px)] shrink-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="flex flex-col h-full py-6 px-4 overflow-hidden"> {/* Added overflow-hidden here */}
            
            <div className="px-4 mb-8 shrink-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Console</p>
              <h2 className="mt-1 text-xl font-black text-slate-900 italic tracking-tighter uppercase truncate">
                {title}
              </h2>
            </div>

            {/* Navigation - Logic for Truncation added here */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => {
                const isActive = activeTab === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => { onTabChange(item.value); setSidebarOpen(false); }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-200",
                      isActive
                        ? "bg-orange-50 text-[#f97316] font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0"> {/* min-w-0 is the secret for truncation */}
                      <span className={isActive ? "text-[#f97316] shrink-0" : "text-slate-400 shrink-0"}>
                        {item.icon || <ChevronRight className="h-4 w-4 opacity-50" />}
                      </span>
                      
                      {/* TRUNCATED LABEL */}
                      <span className="truncate text-left block w-full">
                        {item.label}
                      </span>
                    </div>
                    
                    {isActive && (
                       <div className="h-1.5 w-1.5 rounded-full bg-[#f97316] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto px-4 pt-4 border-t border-slate-50 shrink-0">
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">
                 v2.0.4 Premium
               </p>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content - Fixed overflow behavior */}
        <main className="flex-1 min-w-0 bg-[#fafafa]"> {/* min-w-0 prevents content from pushing layout wide */}
          <div className="mx-auto max-w-7xl p-4 md:p-8">
             <div className="w-full overflow-hidden"> {/* Double wrapper for safety */}
                {children}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;