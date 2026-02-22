import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserCog, Search, Mail, Calendar, 
  ShieldCheck, Shield, MoreVertical, UserCircle,
  Trash2, UserX, UserCheck, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UsersTab = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // --- 1. FETCH USERS WITH CACHE ---
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // Keep data fresh for 10 minutes
  });

  // --- 2. DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User permanently removed");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  // --- 3. STATUS TOGGLE MUTATION ---
  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => 
      api.patch(`/admin/users/${id}/status`, { is_active }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(`User ${variables.is_active ? 'activated' : 'deactivated'}`);
    },
    onError: () => toast.error("Status update failed"),
  });

  const handleDelete = (id: number) => {
    if (confirm("Permanently delete this account? Data recovery will be impossible.")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = users.filter((u: any) => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center text-orange-500 gap-4">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="font-black italic uppercase tracking-widest text-xs">Accessing User Records...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 p-2 md:p-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="h-4 w-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">User Directory</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Account <span className="text-orange-500">Database</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-11 h-12 rounded-2xl bg-white border-slate-100 shadow-sm focus-visible:ring-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-12 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="col-span-4">Identity</div>
          <div className="col-span-3">Registration Date</div>
          <div className="col-span-2 text-center">Security Role</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Admin Tools</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.map((u: any, idx: number) => (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.02 }}
              className={cn(
                "grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-5 md:p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group",
                !u.is_active && "opacity-60 bg-slate-50/50"
              )}
            >
              {/* Identity */}
              <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-2xl text-white flex items-center justify-center font-black italic text-sm shadow-lg transition-colors",
                  u.is_active ? "bg-slate-900 group-hover:bg-orange-500" : "bg-slate-400"
                )}>
                  {getInitials(u.full_name)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black italic uppercase tracking-tighter text-slate-900 truncate">
                    {u.full_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Mail className="h-3 w-3" /> {u.email}
                  </div>
                </div>
              </div>

              {/* Registration */}
              <div className="col-span-1 md:col-span-3">
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Calendar className="h-4 w-4 text-slate-300" />
                  {new Date(u.created_at).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </div>
              </div>

              {/* Role */}
              <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                <Badge className={cn(
                  "rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[9px] border-none",
                  u.role_id === 1 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"
                )}>
                  {u.role_id === 1 ? <ShieldCheck className="h-3 w-3 mr-1 inline" /> : <Shield className="h-3 w-3 mr-1 inline" />}
                  {u.role_id === 1 ? 'Admin' : 'Customer'}
                </Badge>
              </div>

              {/* Status Badge */}
              <div className="col-span-1 md:col-span-1 flex justify-start md:justify-center">
                <Badge className={cn(
                  "rounded-full h-2 w-2 p-0 min-w-[8px]",
                  u.is_active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"
                )} />
              </div>

              {/* Tools */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-300 hover:text-slate-900">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                    <DropdownMenuItem 
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: u.id, is_active: !u.is_active })}
                      className="rounded-xl font-bold text-xs py-3 cursor-pointer"
                    >
                      {u.is_active ? (
                        <><UserX className="h-4 w-4 mr-2 text-red-500" /> Deactivate User</>
                      ) : (
                        <><UserCheck className="h-4 w-4 mr-2 text-green-500" /> Activate User</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(u.id)}
                      className="rounded-xl font-bold text-xs py-3 text-red-600 cursor-pointer hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Permanent Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersTab;