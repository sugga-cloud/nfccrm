import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Mail, 
  User, 
  Calendar, 
  MessageSquare, 
  ExternalLink,
  Inbox
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EnquiriesTab = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  // 1. Fetching with React Query (Syncs with your Orange dashboard theme)
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const res = await api.get("/enquiries");
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds to check for new leads
  });

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      <p className="text-slate-400 font-medium animate-pulse">Checking for new leads...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Enquiries</h1>
          <p className="text-slate-500 font-medium">Respond to potential clients and grow your business.</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Inbox className="h-4 w-4" />
          {enquiries.length} Total Leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px] font-bold py-4">Sender</TableHead>
              <TableHead className="font-bold">Contact Info</TableHead>
              <TableHead className="font-bold">Received On</TableHead>
              <TableHead className="font-bold">Message Preview</TableHead>
              <TableHead className="text-right font-bold px-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                    <Mail className="h-12 w-12" />
                    <p className="font-bold text-lg">No enquiries yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((e: any) => (
                <TableRow key={e.id} className="group hover:bg-orange-50/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 uppercase">
                        {e.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{e.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs space-y-1">
                      <span className="text-slate-600 font-medium">{e.email}</span>
                      {e.phone && <span className="text-slate-400">{e.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(e.created_at || Date.now()), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-500 max-w-[280px] truncate italic">
                      "{e.message}"
                    </p>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedEnquiry(e)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg font-bold transition-all"
                    >
                      View Details
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-slate-900 text-white">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-orange-500 rounded-2xl">
                  <MessageSquare className="h-6 w-6 text-white" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black">Message from {selectedEnquiry?.name}</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium">
                    Received on {selectedEnquiry && format(new Date(selectedEnquiry.created_at || Date.now()), "PPPP")}
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Mail className="h-4 w-4 text-orange-500" />
                  {selectedEnquiry?.email}
                </div>
              </div>
              {selectedEnquiry?.phone && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Phone Number</p>
                  <p className="text-slate-700 font-bold">{selectedEnquiry.phone}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Full Inquiry Message</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed relative">
                <span className="absolute -top-3 left-4 text-4xl text-slate-200 font-serif">“</span>
                {selectedEnquiry?.message}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                asChild
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-bold"
              >
                <a href={`mailto:${selectedEnquiry?.email}`}>Reply via Email</a>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-xl h-12 px-6 border-slate-200 font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesTab;