import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, X, Loader2, Plus, Trash2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MediaTab = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localGallery, setLocalGallery] = useState<any[]>([]);

  // 1. Permanent Cache Fetching
  const { data, isLoading } = useQuery({
    queryKey: ["galleryData"],
    queryFn: async () => {
      const res = await api.get("/my-profile");
      return res.data.profile.gallery || [];
    },
    staleTime: Infinity,
  });

  // Sync local state when query data arrives
  useEffect(() => {
    if (data) setLocalGallery(data);
  }, [data]);

  // 2. Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images[]", file));
      return api.post("/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryData"] });
      toast.success("Gallery updated!", {
        className: "bg-orange-600 text-white border-none",
      });
    },
    onError: () => toast.error("Failed to upload images"),
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/gallery/${id}`),
    onSuccess: (_, id) => {
      // Optimistically update local UI
      setLocalGallery((prev) => prev.filter((item) => item.id !== id));
      queryClient.setQueryData(["galleryData"], (old: any) => 
        old?.filter((item: any) => item.id !== id)
      );
      toast.success("Image removed");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadMutation.mutate(Array.from(e.target.files));
    }
  };

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      <p className="text-slate-400 font-medium">Loading Gallery...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Gallery</h1>
          <p className="text-slate-500 font-medium">Showcase your products, services, or office space.</p>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={uploadMutation.isPending}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Photos
        </Button>
        
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileSelect} 
        />
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base font-bold text-slate-700">Manage Media</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          {localGallery.length === 0 ? (
            /* Empty State / Dropzone */
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-200 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="h-10 w-10 text-orange-400" />
              </div>
              <p className="text-slate-900 font-bold">No images uploaded yet</p>
              <p className="text-slate-400 text-sm mt-1">Click to browse your business photos</p>
            </div>
          ) : (
            /* Gallery Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {localGallery.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-sm"
                >
                  <img 
                    src={item.media_url} 
                    alt="Business Gallery" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  {/* Glassmorphism Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                      className="bg-white/90 backdrop-blur-md p-3 rounded-xl text-red-600 shadow-xl hover:bg-red-50 transition-colors active:scale-90"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Loading overlay for specifically being deleted */}
                  {deleteMutation.isPending && deleteMutation.variables === item.id && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                       <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* "Add More" Square */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50/50 transition-all"
              >
                <Plus className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Add More</span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-orange-50 rounded-2xl p-4 flex items-start gap-3 border border-orange-100">
        <div className="mt-0.5">
          <ImageIcon className="h-4 w-4 text-orange-600" />
        </div>
        <p className="text-xs text-orange-800 leading-relaxed font-medium">
          <strong>Tip:</strong> High-quality square images (1:1 ratio) look best in your business profile. You can upload multiple files at once.
        </p>
      </div>
    </div>
  );
};

export default MediaTab;