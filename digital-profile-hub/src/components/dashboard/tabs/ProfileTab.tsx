import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Camera, MapPin, Globe, Phone, 
  MessageCircle, Building2, Save, Pencil, X,
  Mail, Briefcase, Link as LinkIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProfileTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [previews, setPreviews] = useState<{ profile?: string; cover?: string }>({});
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profileData"],
    queryFn: async () => {
      const res = await api.get("/my-profile");
      return res.data.profile;
    },
    staleTime: Infinity,
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/my-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      setIsEditing(false); // Lock the form again
      toast({ title: "Success", description: "Profile updated successfully.", className: "bg-brand-gold text-brand-dark border-none" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const sanitizeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/@/g, "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviews({}); // Reset image previews to original
    formRef.current?.reset(); // Revert text fields to defaultValues
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  // 1. Extract and clean the username
  let username = formData.get("username") as string;
  if (username) {
    // Remove all existing '@' symbols
    const cleanUsername = username.replace(/@/g, "");
    // Prepend a single '@'
    const formattedUsername = `${cleanUsername}`;
    // Update the formData with the cleaned version
    formData.set("username", formattedUsername);
  }

  // 2. Handle Laravel Method Spoofing and Files
  formData.append("_method", "PUT");

  if (profileInputRef.current?.files?.[0]) {
    formData.append("profile_image", profileInputRef.current.files[0]);
  }
  if (coverInputRef.current?.files?.[0]) {
    formData.append("cover_image", coverInputRef.current.files[0]);
  }

  updateMutation.mutate(formData);
};
  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-400">View and manage your account details.</p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="rounded-xl border-white/10">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Imagery Section */}
        <div className="relative mb-20">
          <div 
            className={`h-48 w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative ${isEditing ? 'cursor-pointer group' : ''}`}
            onClick={() => isEditing && coverInputRef.current?.click()}
          >
            <img 
              src={previews.cover || profile?.cover_image || "/placeholder-cover.jpg"} 
              className="h-full w-full object-cover" 
              alt="Cover" 
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white drop-shadow-md" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-12 left-8">
            <div 
              className={`h-28 w-28 rounded-2xl border-4 border-white/10 bg-white/5 shadow-md overflow-hidden relative ${isEditing ? 'cursor-pointer group' : ''}`}
              onClick={() => isEditing && profileInputRef.current?.click()}
            >
              <img src={previews.profile || profile?.profile_image} className="h-full w-full object-cover" alt="Avatar" />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          </div>
          
          <input type="file" ref={profileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} disabled={!isEditing} />
          <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} disabled={!isEditing} />
        </div>

        <Card className="border-white/10 bg-white/5 rounded-xl">
          <CardContent className="p-6 md:p-8 space-y-8">
            
            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Username</label>
                <div className={`flex items-center rounded-lg border border-slate-200 overflow-hidden ${isEditing ? 'ring-2 ring-brand-gold' : 'bg-white/5'}`}>
                  {/* <div className="bg-orange-500 text-white px-4 py-2 font-bold h-11 flex items-center">@</div> */}
                  <Input 
                    name="username" 
                    defaultValue={profile?.username?.replace(/@/g, "")} 
                    onChange={sanitizeUsername}
                    readOnly={!isEditing}
                    className="border-none rounded-none h-11 focus-visible:ring-0 font-medium disabled:opacity-100" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input value={profile?.email} readOnly className="pl-10 h-11 bg-white/5 border-white/10 text-slate-400 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Professional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input name="company_name" defaultValue={profile?.company_name} readOnly={!isEditing} className={`pl-10 h-11 ${!isEditing ? 'bg-slate-50' : ''}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input name="designation" defaultValue={profile?.designation} readOnly={!isEditing} className={`pl-10 h-11 ${!isEditing ? 'bg-slate-50' : ''}`} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Company Description</label>
              <Textarea 
                name="company_description" 
                defaultValue={profile?.company_description} 
                readOnly={!isEditing}
                rows={4} 
                className={`rounded-lg resize-none p-4 ${!isEditing ? 'bg-white/5' : ''}`}
              />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Phone</label>
                <Input name="phone" defaultValue={profile?.phone} readOnly={!isEditing} className={`h-11 ${!isEditing ? 'bg-white/5' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">WhatsApp</label>
                <Input name="whatsapp" defaultValue={profile?.whatsapp} readOnly={!isEditing} className={`h-11 ${!isEditing ? 'bg-white/5' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Google Maps</label>
                <Input name="google_map_link" defaultValue={profile?.google_map_link} readOnly={!isEditing} className={`h-11 ${!isEditing ? 'bg-white/5' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Address</label>
                <Input name="address" defaultValue={profile?.address} readOnly={!isEditing} className={`h-11 ${!isEditing ? 'bg-white/5' : ''}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Website</label>
                <Input name="website" defaultValue={profile?.website} readOnly={!isEditing} className={`h-11 ${!isEditing ? 'bg-white/5' : ''}`} />
              </div>
            </div>

            {/* Form Save Button (Visible only when editing) */}
            {isEditing && (
              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending} 
                  className="bg-brand-gold hover:bg-brand-accent text-brand-dark font-bold py-6 px-10 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Save className="h-5 w-5" />}
                  Save Changes
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProfileTab;