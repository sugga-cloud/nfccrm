import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Clock, Copy, CalendarDays, Pencil, X } from "lucide-react";
import api from "@/api/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BusinessHoursTab = () => {
  const queryClient = useQueryClient();
  
  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [localHours, setLocalHours] = useState<any[]>([]);

  // 1. Fetching with React Query (Permanent Cache)
  const { data, isLoading } = useQuery({
    queryKey: ["businessHours"],
    queryFn: async () => {
      const res = await api.get("/profile/hours");
      // If API is empty, return default 9-6 schedule
      return (res.data && res.data.length > 0) 
        ? res.data 
        : daysOfWeek.map(d => ({ day: d, open: "09:00", close: "18:00", isOpen: true }));
    },
    staleTime: Infinity, // Keep in memory
  });

  // 2. CRITICAL FIX: Sync local state whenever 'data' is loaded or changed
  useEffect(() => {
    if (data) {
      setLocalHours(data);
    }
  }, [data]);

  // 3. Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (hours: any[]) => {
      return api.post("/profile/hours", { hours });
    },
    onSuccess: () => {
      // Update the cache with our new data
      queryClient.setQueryData(["businessHours"], localHours);
      setIsEditing(false);
      toast.success("Schedule updated successfully!", {
        className: "bg-brand-gold text-brand-dark border-none shadow-lg",
      });
    },
    onError: () => {
      toast.error("Failed to save schedule.");
    }
  });

  const updateDay = (index: number, field: string, value: any) => {
    const newHours = [...localHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setLocalHours(newHours);
  };

  const copyToAll = (index: number) => {
    const sourceDay = localHours[index];
    const newHours = localHours.map(h => ({
      ...h,
      open: sourceDay.open,
      close: sourceDay.close,
      isOpen: sourceDay.isOpen
    }));
    setLocalHours(newHours);
    toast.info(`Applied ${sourceDay.day} settings to all days`, {
        icon: <Copy className="h-4 w-4" />
    });
  };

  const handleCancel = () => {
    // Revert local state to whatever is currently in the cache
    if (data) setLocalHours(data);
    setIsEditing(false);
  };

  // Loading State
  if (isLoading || localHours.length === 0) return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
      <p className="text-slate-400 font-medium animate-pulse">Loading Schedule...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operating Hours</h1>
          <p className="text-slate-500 font-medium">Manage your weekly business availability.</p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-xl px-6 flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Pencil className="h-4 w-4" /> Edit Schedule
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
      </div>

      {/* Main Schedule Card */}
      <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
        {/* <CardHeader className="bg-white/5 border-b border-white/10 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-brand-gold" />
            <CardTitle className="text-base font-bold text-white">Weekly Planner</CardTitle>
          </div>
        </CardHeader> */}
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {localHours.map((item, idx) => (
              <div 
                key={item.day} 
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-4 p-5 lg:px-8 transition-colors",
                  !item.isOpen && "bg-white/5"
                )}
              >
                {/* Day Toggle Column */}
                <div className="flex items-center justify-between sm:w-48">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{item.day}</span>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      item.isOpen ? "text-orange-500" : "text-slate-400"
                    )}>
                      {item.isOpen ? "Status: Open" : "Status: Closed"}
                    </p>
                  </div>
                  <Switch 
                    disabled={!isEditing}
                    checked={item.isOpen} 
                    onCheckedChange={(val) => updateDay(idx, "isOpen", val)}
                    className="data-[state=checked]:bg-brand-gold"
                  />
                </div>

                {/* Time Input Column */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1">
                    <Clock className={cn(
                      "absolute left-3 top-2.5 h-4 w-4 transition-colors",
                      isEditing && item.isOpen ? "text-orange-400" : "text-white"
                    )} />
                    <Input 
                      type="time" 
                      value={item.open} 
                      disabled={!item.isOpen || !isEditing}
                      onChange={(e) => updateDay(idx, "open", e.target.value)} 
                      className="pl-10 h-10 rounded-xl border-white/10 bg-white/5 focus-visible:ring-brand-gold disabled:opacity-100 disabled:bg-white/5 text-white disabled:text-white font-medium"
                    />
                  </div>
                  
                  <span className="text-slate-300 font-black text-[10px] uppercase">to</span>
                  
                  <div className="relative flex-1">
                    <Clock className={cn(
                      "absolute left-3 top-2.5 h-4 w-4 transition-colors",
                      isEditing && item.isOpen ? "text-orange-400" : "text-slate-300"
                    )} />
                    <Input 
                      type="time" 
                      value={item.close} 
                      disabled={!item.isOpen || !isEditing}
                      onChange={(e) => updateDay(idx, "close", e.target.value)} 
                      className="pl-10 h-10 rounded-xl border-white/10 bg-white/5 focus-visible:ring-brand-gold disabled:opacity-100 disabled:bg-white/5 text-white disabled:text-white font-medium"
                    />
                  </div>
                </div>

                {/* Batch Action Column */}
                <div className="w-full sm:w-auto flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!item.isOpen || !isEditing}
                    onClick={() => copyToAll(idx)}
                    className="h-9 px-4 rounded-lg text-slate-400 hover:text-brand-gold hover:bg-brand-gold/20 transition-all"
                  >
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">Sync All</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Save Action */}
          {isEditing && (
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end animate-in slide-in-from-bottom-2">
              <Button 
                onClick={() => saveMutation.mutate(localHours)} 
                disabled={saveMutation.isPending}
                className="bg-brand-gold hover:bg-brand-accent text-brand-dark font-bold py-6 px-10 rounded-xl shadow-lg shadow-brand-gold/20 flex items-center gap-2 transition-all active:scale-95"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Commit Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-center text-slate-400 text-xs">
        Note: Changes will be visible to customers immediately after saving.
      </p>
    </div>
  );
};

export default BusinessHoursTab;