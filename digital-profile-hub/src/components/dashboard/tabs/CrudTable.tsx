import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Trash2, Edit, Plus, Upload, Loader2, FileText, Package, Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CrudTableProps {
  title: "Products" | "Blogs" | "Services";
  endpoint: string;
}

const CrudTable = ({ title, endpoint }: CrudTableProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper flags for dynamic UI
  const isProduct = title === "Products";
  const isBlog = title === "Blogs";
  const isService = title === "Services";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", name: "", description: "", price: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- GET Data ---
  const { data = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // --- CREATE / UPDATE Logic ---
  const upsertMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
      // Note: We use POST for both. If editing, Laravel requires _method=PUT in FormData.
      return api.post(url, payload, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success(`${title.slice(0, -1)} saved successfully!`);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.log(error.response.data.message)
      toast.error(error.response?.data?.message || "Failed to save item.");
    }
  });

  // --- DELETE Logic ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success("Item deleted.");
    },
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        title: item.title || "", 
        name: item.name || "", 
        description: item.description || "", 
        price: item.price || "" 
      });
      // Handle various backend image naming conventions
      setPreviewUrl(item.image || item.image_url || item.media_url || item.featured_image || null);
    } else {
      setEditingItem(null);
      setFormData({ title: "", name: "", description: "", price: "" });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    
    // Switch between name (Products) and title (Blogs/Services)
    if (isProduct) {
      payload.append("name", formData.name);
      payload.append("price", formData.price);
    } else {
      payload.append("title", formData.title);
    }
    
    payload.append("description", formData.description);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    // Laravel Method Spoofing for Multipart Updates
    if (editingItem) {
      payload.append("_method", "PUT");
    }

    upsertMutation.mutate(payload);
  };

  if (isLoading) return (
    <div className="flex h-60 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#f97316]" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-2">
      {/* Header Area */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            {isBlog && <FileText className="h-5 w-5 text-[#f97316]" />}
            {isProduct && <Package className="h-5 w-5 text-[#f97316]" />}
            {isService && <Briefcase className="h-5 w-5 text-[#f97316]" />}
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          size="sm" 
          className="bg-[#f97316] hover:bg-black text-white rounded-xl px-4 font-bold transition-all"
        >
          <Plus className="h-4 w-4 mr-1" /> Add {title.slice(0, -1)}
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-10">
              <TableHead className="pl-6 text-[10px] font-bold uppercase text-slate-400">Preview</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">
                {isProduct ? "Product Name" : "Title"}
              </TableHead>
              {isProduct && <TableHead className="text-[10px] font-bold uppercase text-slate-400">Price</TableHead>}
              <TableHead className="text-right pr-6 text-[10px] font-bold uppercase text-slate-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id} className="h-14 hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 py-2">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img 
                      src={item.image || item.image_url || item.featured_image || "/placeholder.svg"} 
                      className="h-full w-full object-cover" 
                      alt="preview"
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-sm text-slate-700">
                  {item.title || item.name}
                </TableCell>
                {isProduct && (
                  <TableCell className="font-bold text-[#f97316] text-sm">
                    ₹{item.price}
                  </TableCell>
                )}
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenModal(item)} 
                      className="h-9 w-9 rounded-lg hover:bg-orange-50 hover:text-[#f97316]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => confirm(`Are you sure you want to delete this ${title.slice(0, -1)}?`) && deleteMutation.mutate(item.id)} 
                      className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Item Dialog (Create/Edit) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <DialogHeader className="px-6 py-4 bg-slate-900 text-white">
            <DialogTitle className="text-lg font-bold tracking-tight uppercase flex items-center gap-2">
              {editingItem ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingItem ? "Update" : "Create"} {title.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="bg-white">
            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Image Upload Area */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feature Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-56 w-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#f97316] bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all"
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} className="h-full w-full object-cover" alt="preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="text-white h-8 w-8" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-2 mx-auto w-fit">
                        <Upload className="h-6 w-6 group-hover:text-[#f97316] transition-colors" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-tighter">Click to upload</p>
                      <p className="text-[9px] mt-1">JPG, PNG or WEBP</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              {/* Form Fields Area */}
              <div className="md:col-span-3 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Information</label>
                    <Input 
                      value={isProduct ? formData.name : formData.title} 
                      onChange={(e) => setFormData({ ...formData, [isProduct ? "name" : "title"]: e.target.value })} 
                      placeholder={isProduct ? "Product Name" : isBlog ? "Article Title" : "Service Name"}
                      className="h-11 rounded-xl bg-slate-50 border-none font-bold focus-visible:ring-2 focus-visible:ring-[#f97316]/20 transition-all"
                      required 
                    />
                  </div>

                  {isProduct && (
                    <div className="space-y-1">
                      <Input 
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                        className="h-11 rounded-xl bg-slate-50 border-none font-black text-[#f97316] focus-visible:ring-2 focus-visible:ring-[#f97316]/20"
                        placeholder="Price (₹)"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      placeholder={isBlog ? "Write your blog content or excerpt..." : "Short description for customers..."}
                      className={cn(
                        "rounded-xl bg-slate-50 border-none px-4 py-3 focus-visible:ring-2 focus-visible:ring-[#f97316]/20 resize-none text-sm min-h-[120px] transition-all",
                        isBlog ? "h-48" : "h-28"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-slate-50/80 border-t flex gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)} 
                className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
              >
                Discard
              </Button>
              <Button 
                type="submit" 
                disabled={upsertMutation.isPending} 
                className="h-11 bg-[#f97316] hover:bg-black text-white rounded-xl px-8 font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
              >
                {upsertMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingItem ? "Update" : "Save"} Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrudTable;