import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, FileText, Save, ShieldCheck, 
  History, Scale, Copy, Wand2 
} from "lucide-react";
import { toast } from "sonner";

const TermsAndConditionsTab = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Terms and Conditions");

  // 1. Fetch existing terms
  const { data, isLoading } = useQuery({
    queryKey: ["termsData"],
    queryFn: async () => {
      const res = await api.get("/profile/terms");
      if (res.data) {
        setContent(res.data.content || "");
        setTitle(res.data.title || "Terms and Conditions");
      }
      return res.data;
    },
  });

  // 2. Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      return api.post("/profile/terms", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["termsData"] });
      toast.success("Legal documents updated!", {
        className: "bg-brand-gold text-brand-dark border-none",
      });
    },
    onError: () => toast.error("Failed to save terms."),
  });

  const handleAutoGenerate = () => {
    const template = `1. ACCEPTANCE OF TERMS\nBy accessing this profile, you agree to be bound by these terms...\n\n2. SERVICES PROVIDED\nI provide professional services in [Your Field]...\n\n3. PAYMENTS & REFUNDS\nAll payments are due upon receipt unless otherwise agreed...\n\n4. INTELLECTUAL PROPERTY\nAll content shared on this profile remains the property of the owner...`;
    setContent(template);
    toast.info("Template generated. Please customize it!");
  };

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Legal <span className="text-orange-500">Agreement</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Define your boundaries and client expectations.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAutoGenerate}
            className="rounded-xl border-white/10 hover:bg-brand-gold/20 hover:text-brand-gold transition-all"
          >
            <Wand2 className="h-4 w-4 mr-2" /> Magic Template
          </Button>
          <Button 
            onClick={() => saveMutation.mutate({ title, content })}
            disabled={saveMutation.isPending}
            className="bg-brand-gold hover:bg-brand-accent text-brand-dark rounded-xl px-8 shadow-lg"
          >
            {saveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Terms
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Editor Card */}
        <Card className="lg:col-span-2 border-white/10 bg-white/5 rounded-2xl">
          <CardHeader className="border-b border-white/10 bg-white/5">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Document Title</label>
               <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold bg-transparent border-none p-0 focus-visible:ring-0" 
                placeholder="e.g. Terms of Service"
               />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your terms and conditions here..."
              className="min-h-[500px] border-none rounded-none p-8 focus-visible:ring-0 resize-none text-slate-300 leading-relaxed font-medium bg-transparent"
            />
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-brand-gold/30 bg-brand-gold/10 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-orange-600 h-6 w-6" />
              </div>
              <h3 className="font-bold text-white">Why add terms?</h3>
              <p className="text-sm text-slate-400 leading-snug">
                Clear terms protect your business from misunderstandings regarding payments, delivery times, and scope of work.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 font-medium italic">
                <li className="flex items-center gap-2"><Scale className="h-3 w-3" /> Legally binding agreement</li>
                <li className="flex items-center gap-2"><History className="h-3 w-3" /> Defines refund policies</li>
                <li className="flex items-center gap-2"><Copy className="h-3 w-3" /> Protects your IP</li>
              </ul>
            </CardContent>
          </Card>

          <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center text-center space-y-2">
            <FileText className="h-8 w-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview Mode</p>
            <p className="text-[11px] text-slate-500 italic">
              These terms will appear at the bottom of your public landing page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsTab;