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
  Calendar, 
  MessageSquare, 
  ExternalLink,
  Inbox,
  UserCheck,
  Badge
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EnquiriesTab = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const res = await api.get("/enquiries");
      return res.data;
    },
    refetchInterval: 30000, 
  });

  if (isLoading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4 bg-brand-dark/50 rounded-[3rem] border border-white/5 mt-8">
      <Loader2 className="h-12 w-12 animate-spin text-brand-gold" />
      <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Lead Database...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <Badge className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full px-4 py-1 mb-4 font-black uppercase tracking-widest text-[9px]">
            Inbound Intelligence
          </Badge>
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            Lead <span className="text-brand-gold">Console</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Manage and respond to high-intent inquiries.</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-md text-white px-6 py-4 rounded-[2rem] border border-white/10 flex items-center gap-4 shadow-2xl">
          <div className="h-10 w-10 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold">
             <Inbox className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Leads</p>
            <p className="text-2xl font-black italic tracking-tighter">{enquiries.length}</p>
          </div>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-slate-400 font-black uppercase tracking-widest text-[10px] py-6 pl-8">Sender Entity</TableHead>
              <TableHead className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Communication</TableHead>
              <TableHead className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Timestamp</TableHead>
              <TableHead className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Brief</TableHead>
              <TableHead className="text-right text-slate-400 font-black uppercase tracking-widest text-[10px] pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                    <Mail className="h-16 w-16 text-white" />
                    <p className="font-black uppercase tracking-[0.4em] text-white text-xs">Inbox Cleared</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((e: any) => (
                <TableRow key={e.id} className="group border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 group-hover:scale-110 transition-transform">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <span className="font-black italic uppercase tracking-tighter text-white text-sm">{e.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-slate-300 font-bold text-xs">{e.email}</span>
                      {e.phone && <span className="text-slate-500 text-[10px] font-medium">{e.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                      <Calendar className="h-3 w-3 text-brand-gold" />
                      {format(new Date(e.created_at || Date.now()), "dd MMM yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-500 max-w-[240px] truncate font-medium">
                      {e.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedEnquiry(e)}
                      className="text-brand-gold hover:bg-brand-gold/10 rounded-xl font-black uppercase tracking-widest text-[10px] px-4"
                    >
                      Audit Lead
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
        <DialogContent className="sm:max-w-[550px] bg-brand-dark rounded-[3rem] p-0 overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
          <DialogHeader className="p-10 bg-white/[0.03] border-b border-white/5">
            <div className="flex items-center gap-5 mb-2">
               <div className="p-4 bg-brand-gold rounded-[1.5rem] shadow-lg shadow-brand-gold/20">
                  <MessageSquare className="h-6 w-6 text-brand-dark" />
               </div>
               <div>
                  <DialogTitle className="text-3xl font-black italic tracking-tighter text-white uppercase">Inquiry Dossier</DialogTitle>
                  <DialogDescription className="text-brand-gold font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                    Verified Lead Access
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Direct Channel</p>
                <div className="flex items-center gap-2 text-white font-black text-sm italic tracking-tighter">
                  <Mail className="h-4 w-4 text-brand-gold" />
                  {selectedEnquiry?.email}
                </div>
              </div>
              {selectedEnquiry?.phone && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Voice Secure</p>
                  <p className="text-white font-black text-sm italic tracking-tighter">{selectedEnquiry.phone}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em]">Communication Log</p>
              <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 italic text-slate-300 text-sm leading-relaxed relative">
                <span className="absolute -top-4 left-6 text-6xl text-brand-gold/20 font-serif">“</span>
                {selectedEnquiry?.message}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                asChild
                className="btn-gold flex-1 rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-[10px]"
              >
                <a href={`mailto:${selectedEnquiry?.email}`}>Initiate Response</a>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-2xl h-14 px-8 border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesTab;