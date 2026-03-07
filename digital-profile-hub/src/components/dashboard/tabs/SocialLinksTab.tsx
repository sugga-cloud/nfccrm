import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Instagram, Facebook, Linkedin, Youtube, Twitter, 
  Loader2, Save, Pencil, X, Share2, ExternalLink, Plus, Trash2, Globe 
} from "lucide-react";
import { toast } from "sonner";

const fixedPlatforms = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { id: "twitter", label: "Twitter", icon: Twitter, color: "text-sky-500" },
];

const SocialLinksTab = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // localLinks will now store { platform: url }
  const [localLinks, setLocalLinks] = useState<Record<string, string>>({});
  // customLinks stores the temporary new link being added
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const { data: links, isLoading } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      const res = await api.get("/profile/social-links");
      setLocalLinks(res.data || {});
      console.log(res.data)
      return res.data;
    },
    staleTime: Infinity,
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedLinks: Record<string, string>) => {
      return api.post("/profile/social-links", { links: updatedLinks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      setIsEditing(false);
      toast.success("Social links updated!", { className: "bg-orange-600 text-white" });
    },
  });

  const addCustomLink = () => {
    if (!newLabel || !newUrl) return toast.error("Please fill both fields");
    setLocalLinks({ ...localLinks, [newLabel]: newUrl });
    setNewLabel("");
    setNewUrl("");
  };

  const removeLink = (key: string) => {
    const updated = { ...localLinks };
    delete updated[key];
    setLocalLinks(updated);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;

  // Separate fixed platforms from custom ones for cleaner UI
  const fixedKeys = fixedPlatforms.map(p => p.id);
  const customKeys = Object.keys(localLinks).filter(key => !fixedKeys.includes(key));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Social Connections</h1>
          <p className="text-slate-500 font-medium">Manage where your audience can find you online.</p>
        </div>

        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 flex items-center gap-2">
            <Pencil className="h-4 w-4" /> Edit Links
          </Button>
        ) : (
          <Button variant="outline" onClick={() => { setIsEditing(false); setLocalLinks(links); }} className="rounded-xl border-slate-200">
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg flex items-center gap-2 font-bold uppercase tracking-tight">
            <Share2 className="h-5 w-5 text-orange-500" /> Social Media Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          
          {/* Fixed Platforms */}
          {fixedPlatforms.map((p) => (
            <div key={p.id} className="flex flex-col space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{p.label}</label>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm"><p.icon className={`h-5 w-5 ${p.color}`} /></div>
                <Input 
                  value={localLinks[p.id] || ""} 
                  readOnly={!isEditing}
                  onChange={(e) => setLocalLinks({...localLinks, [p.id]: e.target.value})}
                  className={`h-12 rounded-xl border-slate-200 ${!isEditing ? 'bg-slate-50' : 'focus:ring-orange-500'}`}
                  placeholder={`Your ${p.label} URL`}
                />
              </div>
            </div>
          ))}

          {/* Custom Added Links */}
          {customKeys.length > 0 && (
            <div className="pt-4 space-y-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest">Custom Links</h3>
              {customKeys.map((key) => (
                <div key={key} className="flex flex-col space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{key}</label>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm"><Globe className="h-5 w-5 text-slate-400" /></div>
                    <Input value={localLinks[key]} readOnly className="h-12 rounded-xl bg-slate-50 border-transparent flex-1" />
                    {isEditing && (
                      <Button variant="ghost" size="icon" onClick={() => removeLink(key)} className="text-slate-300 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Link UI */}
          {isEditing && (
            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 space-y-4 animate-in zoom-in-95">
              <h3 className="text-sm font-bold text-orange-700">Add Custom Link</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Label (e.g. Portfolio)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="bg-white border-orange-200" />
                <Input placeholder="URL (https://...)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="bg-white border-orange-200" />
              </div>
              <Button onClick={addCustomLink} type="button" variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-100 rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Add Link to List
              </Button>
            </div>
          )}

          {isEditing && (
            <Button className="w-full py-7 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 mt-4" onClick={() => saveMutation.mutate(localLinks)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              Save All Connections
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLinksTab;