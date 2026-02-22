import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  User, 
  MoreHorizontal,
  CalendarCheck
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AppointmentsTab = () => {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await api.get("/appointments");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return api.patch(`/appointments/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(`Appointment ${variables.status} updated!`);
    },
  });

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-[#f97316]" />
      <p className="text-slate-400 font-medium">Loading your schedule...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      
      {/* Header with forced orange theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your bookings and client meetings.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                <CalendarCheck className="h-4 w-4 text-[#f97316]" />
                <span className="text-[#f97316]">{appointments.filter((a: any) => a.status === 'pending').length}</span> Pending
            </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-b border-slate-200">
              <TableHead className="font-bold text-slate-700 py-4 px-6">Customer</TableHead>
              <TableHead className="font-bold text-slate-700">Schedule</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <Calendar className="h-12 w-12 mb-2" />
                    <p className="font-semibold text-lg">No appointments found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((a: any) => (
                <TableRow key={a.id} className="hover:bg-orange-50/30 transition-all border-b border-slate-100 last:border-0">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold border border-orange-200">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 leading-none mb-1">{a.customer_name}</span>
                        <span className="text-xs text-slate-400 font-medium">{a.customer_email || 'No email'}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Calendar className="h-3.5 w-3.5 text-[#f97316]" />
                        {format(parseISO(a.appointment_date), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {a.appointment_time || "Not Set"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        a.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        a.status === 'pending' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {a.status}
                    </div>
                  </TableCell>

                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-orange-100 rounded-full">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-2xl border-slate-100 p-1">
                        <DropdownMenuItem 
                          onClick={() => statusMutation.mutate({ id: a.id, status: 'confirmed' })}
                          className="flex items-center px-3 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => statusMutation.mutate({ id: a.id, status: 'cancelled' })}
                          className="flex items-center px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest pt-4">
        <span className="w-8 h-[1px] bg-slate-200"></span>
        End of Appointments
        <span className="w-8 h-[1px] bg-slate-200"></span>
      </div>
    </div>
  );
};

export default AppointmentsTab;