import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Star, Trash2, Eye, EyeOff, 
  MessageSquareQuote, Plus, X, Save, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TestimonialsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);

  // 1. Fetch Testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonialsData"],
    queryFn: async () => {
      const res = await api.get("/my-testimonials");
      return res.data.testimonials;
    },
  });

  // 2. Create Testimonial Mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonialsData"] });
      toast({ title: "Success", description: "Testimonial added!", className: "bg-orange-600 text-white" });
      setShowForm(false);
      setRating(5);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add testimonial", variant: "destructive" });
    },
  });

  // 3. Toggle Visibility & Delete (Same as before)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: number; is_visible: boolean }) => {
      return api.patch(`/testimonials/${id}`, { is_visible: !is_visible });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonialsData"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/testimonials/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonialsData"] }),
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      reviewer_name: formData.get("reviewer_name"),
      content: formData.get("content"),
      rating: rating,
      is_visible: true,
    };
    createMutation.mutate(data);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Client <span className="text-orange-500">Testimonials</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your social proof.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className={`rounded-xl px-6 font-bold transition-all ${showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
        >
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Add New"}
        </Button>
      </div>

      {/* Create Form Section */}
      {showForm && (
        <Card className="mb-8 border-2 border-orange-100 shadow-xl shadow-orange-500/5 animate-in zoom-in-95 duration-200">
          <CardContent className="p-6">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Client Name</label>
                  <Input name="reviewer_name" placeholder="e.g. John Doe" required className="rounded-lg border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-6 w-6 cursor-pointer transition-colors ${star <= rating ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Testimonial Content</label>
                <Textarea name="content" placeholder="Paste the client's feedback here..." required rows={3} className="rounded-lg border-slate-200 resize-none" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={createMutation.isPending} className="bg-slate-900 text-white rounded-xl px-8">
                  {createMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Testimonial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Badge */}
      <div className="mb-4">
        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 px-4 py-1 rounded-full">
          {testimonials?.length || 0} Total Reviews
        </Badge>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {testimonials?.length === 0 && !showForm ? (
           <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
             <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
               <MessageSquareQuote className="h-12 w-12 mb-4 opacity-20" />
               <p className="font-bold uppercase tracking-widest text-xs">No testimonials yet</p>
             </CardContent>
           </Card>
        ) : (
          testimonials?.map((t: any) => (
            <Card key={t.id} className={`group border-slate-200 transition-all hover:shadow-md ${!t.is_visible ? 'opacity-60 grayscale bg-slate-50' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        {t.reviewer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black italic uppercase text-slate-900 leading-tight">
                          {t.reviewer_name}
                        </h4>
                        <div className="flex text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      "{t.content}"
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions (Toggle & Delete) */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMutation.mutate({ id: t.id, is_visible: t.is_visible })}
                      className={`rounded-xl border-slate-200 flex items-center gap-2 ${t.is_visible ? 'hover:bg-slate-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                    >
                      {t.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="hidden sm:inline font-bold">{t.is_visible ? "Hide" : "Show"}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if(confirm("Permanently delete this?")) deleteMutation.mutate(t.id);
                      }}
                      className="rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsTab;