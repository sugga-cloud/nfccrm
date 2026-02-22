import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Instagram, Facebook, Linkedin, Youtube, Twitter, 
  Loader2, Save, Pencil, X, Share2, ExternalLink 
} from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { id: "twitter", label: "Twitter", icon: Twitter, color: "text-sky-500" },
];

const SocialLinksTab = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [localLinks, setLocalLinks] = useState<Record<string, string>>({});

  // 1. Fetch with Permanent Caching
  const { data: links, isLoading } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      const res = await api.get("/profile/social-links");
      const data = res.data;
      setLocalLinks(data); // Sync local state for editing
      return data;
    },
    staleTime: Infinity,
  });

  // 2. Mutation for Saving
  const saveMutation = useMutation({
    mutationFn: async (updatedLinks: Record<string, string>) => {
      return api.post("/profile/social-links", { links: updatedLinks });
    },
    onSuccess: () => {
      queryClient.setQueryData(["socialLinks"], localLinks);
      setIsEditing(false);
      toast.success("Social links updated!", {
        className: "bg-orange-600 text-white border-none",
      });
    },
    onError: () => {
      toast.error("Failed to save social links.");
    },
  });

  const handleCancel = () => {
    setLocalLinks(links || {}); // Revert to cached data
    setIsEditing(false);
  };

  const handleSave = () => {
    saveMutation.mutate(localLinks);
  };

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Social Connections</h1>
          <p className="text-slate-500">Manage where your audience can find you online.</p>
        </div>

        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit Links
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="rounded-xl border-slate-200">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        )}
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-orange-500" />
            Social Media Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-5">
          {platforms.map((p) => {
            const Icon = p.icon;
            const hasLink = !!localLinks[p.id];
            
            return (
              <div key={p.id} className="group flex flex-col space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {p.label}
                </label>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border border-slate-100 bg-white shadow-sm transition-colors ${isEditing ? 'group-focus-within:border-orange-200' : ''}`}>
                    <Icon className={`h-5 w-5 ${p.color}`} />
                  </div>
                  
                  <div className="relative flex-1">
                    <Input 
                      placeholder={`https://${p.id}.com/yourname`}
                      value={localLinks[p.id] || ""}
                      readOnly={!isEditing}
                      onChange={(e) => setLocalLinks({...localLinks, [p.id]: e.target.value})}
                      className={`h-12 rounded-xl transition-all border-slate-200 ${
                        !isEditing 
                          ? 'bg-slate-50 border-transparent cursor-default' 
                          : 'focus-visible:ring-orange-500 focus:border-orange-500'
                      }`}
                    />
                    {!isEditing && hasLink && (
                      <a 
                        href={localLinks[p.id]} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute right-3 top-3 text-slate-400 hover:text-orange-500 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isEditing && (
            <div className="pt-4 animate-in slide-in-from-top-2">
              <Button 
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                onClick={handleSave}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save Social Connections
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLinksTab;