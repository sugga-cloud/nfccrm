import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import AdminThemeSelector from "@/components/dashboard/tabs/LayoutTab";
import {
  Clock,
  Image as ImageIcon,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Link as LinkIcon,
  FileText,
  MessageSquareQuote,
  Star,
} from "lucide-react";

const CreateProfile = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    designation: "",
    company_name: "",
    company_description: "",
    phone: "",
    whatsapp: "",
    website: "",
    google_map_link: "",
    address: "",
    profile_image: null,
    cover_image: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | number>("1");
  const [selectedUiId, setSelectedUiId] = useState<string>("modern");
  const navigate = useNavigate();

  // when editing, fetch existing profile
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("profileId");
    if (id) {
      setIsEdit(true);
      setProfileId(id);
      localStorage.setItem("profileId", id);
      api.get(`/admin/profiles/${id}`)
        .then((res) => {
          const p = res.data;
          if (p.theme_id) setSelectedThemeId(p.theme_id.toString());
          if (p.interface_id) setSelectedUiId(p.interface_id);
          // map basic fields
          setForm((prev) => ({
            ...prev,
            email: p.email || "",
            username: p.username || "",
            designation: p.designation || "",
            company_name: p.company_name || "",
            company_description: p.company_description || "",
            phone: p.phone || "",
            whatsapp: p.whatsapp || "",
            website: p.website || "",
            google_map_link: p.google_map_link || "",
            address: p.address || "",
          }));

          // related
          if (p.businessHours) {
            setHours(p.businessHours.map((h:any) => ({
              day: h.day,
              open: h.open_time || "",
              close: h.close_time || "",
              isOpen: !h.is_closed,
            })));
          }
          if (p.social_links) {
            setLinks(p.social_links.map((l:any) => ({ platform: l.platform, url: l.url })));
          }
          if (p.services) {
            setServices(
              p.services.map((s: any) => ({
                title: s.title,
                description: s.description,
                image: null,
              }))
            );
          }
          if (p.products) {
            setProducts(
              p.products.map((pr: any) => ({
                name: pr.name,
                description: pr.description,
                price: pr.price,
                image: null,
              }))
            );
          }
          if (p.blogs) {
            setBlogs(
              p.blogs.map((b: any) => ({
                title: b.title,
                description: b.description,
                image: null,
              }))
            );
          }
          if (p.testimonials) {
            setTestimonials(
              p.testimonials.map((t: any) => ({
                reviewer_name: t.reviewer_name,
                content: t.content,
                rating: t.rating,
                is_visible: t.is_visible,
              }))
            );
          }
          if (p.legalDocuments) {
            const terms = p.legalDocuments.find((d: any) => d.type === "terms");
            if (terms) {
              setTermsTitle(terms.title || "Terms and Conditions");
              setTermsContent(terms.content || "");
            }
          }
          // gallery cannot pre‑populate file inputs; ignore
        })
        .catch(() => {
          toast.error("Failed to load profile for editing");
        })
        .finally(() => {
          // remove profileId from URL after load so future visits to create tab don't auto-load
          params.delete("profileId");
          const newQuery = params.toString();
          const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
          window.history.replaceState(null, "", newUrl);
        });
    }
  }, []);


  // related data state
  const [hours, setHours] = useState(
    [
      { day: "Monday", open: "", close: "", isOpen: false },
      { day: "Tuesday", open: "", close: "", isOpen: false },
      { day: "Wednesday", open: "", close: "", isOpen: false },
      { day: "Thursday", open: "", close: "", isOpen: false },
      { day: "Friday", open: "", close: "", isOpen: false },
      { day: "Saturday", open: "", close: "", isOpen: false },
      { day: "Sunday", open: "", close: "", isOpen: false },
    ]
  );
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [termsTitle, setTermsTitle] = useState<string>("Terms and Conditions");
  const [termsContent, setTermsContent] = useState<string>("");

  // helper functions for related data
  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const removeGallery = (idx: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const updateHour = (index: number, data: Partial<{open:string;close:string;isOpen:boolean;}>) => {
    setHours((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...data };
      return copy;
    });
  };

  const addLink = () => setLinks((prev) => [...prev, { platform: "", url: "" }]);
  const updateLink = (idx: number, data: Partial<{platform:string;url:string;}>) => {
    setLinks((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const removeLink = (idx: number) => setLinks((prev) => prev.filter((_, i) => i !== idx));

  const addService = () => setServices((prev) => [...prev, { title: "", description: "", image: null }]);
  const updateService = (idx: number, data: any) => {
    setServices((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const removeService = (idx: number) => setServices((prev) => prev.filter((_, i) => i !== idx));

  const addProduct = () => setProducts((prev) => [...prev, { name: "", description: "", price: "", image: null }]);
  const updateProduct = (idx: number, data: any) => {
    setProducts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const removeProduct = (idx: number) => setProducts((prev) => prev.filter((_, i) => i !== idx));

  const addBlog = () => setBlogs((prev) => [...prev, { title: "", description: "", image: null }]);
  const updateBlog = (idx: number, data: any) => {
    setBlogs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const removeBlog = (idx: number) => setBlogs((prev) => prev.filter((_, i) => i !== idx));

  const addTestimonial = () =>
    setTestimonials((prev) => [
      ...prev,
      { reviewer_name: "", content: "", rating: 5, is_visible: true },
    ]);
  const updateTestimonial = (idx: number, data: any) => {
    setTestimonials((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const removeTestimonial = (idx: number) =>
    setTestimonials((prev) => prev.filter((_, i) => i !== idx));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: "profile_image" | "cover_image") => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value as any);
      }
    });

    // related data
    if (hours.length) {
      data.append("hours", JSON.stringify(hours));
    }
    if (links.length) {
      data.append("links", JSON.stringify(links));
    }

    galleryFiles.forEach((file) => {
      data.append("gallery[]", file);
    });

    services.forEach((s, idx) => {
      data.append(`services[${idx}][title]`, s.title || "");
      data.append(`services[${idx}][description]`, s.description || "");
      if (s.image) {
        data.append(`services[${idx}][image]`, s.image);
      }
    });

    products.forEach((p, idx) => {
      data.append(`products[${idx}][name]`, p.name || "");
      data.append(`products[${idx}][description]`, p.description || "");
      data.append(`products[${idx}][price]`, p.price || "");
      if (p.image) {
        data.append(`products[${idx}][image]`, p.image);
      }
    });

    blogs.forEach((b, idx) => {
      data.append(`blogs[${idx}][title]`, b.title || "");
      data.append(`blogs[${idx}][description]`, b.description || "");
      if (b.image) {
        data.append(`blogs[${idx}][image]`, b.image);
      }
    });

    testimonials.forEach((t, idx) => {
      data.append(`testimonials[${idx}][reviewer_name]`, t.reviewer_name || "");
      data.append(`testimonials[${idx}][content]`, t.content || "");
      data.append(`testimonials[${idx}][rating]`, String(t.rating ?? 5));
      data.append(
        `testimonials[${idx}][is_visible]`,
        t.is_visible ? "1" : "0"
      );
    });

    if (termsContent.trim()) {
      data.append("terms_title", termsTitle || "Terms and Conditions");
      data.append("terms_content", termsContent);
    }

    try {
      const url = isEdit && profileId ? `/admin/profiles/${profileId}` : "/admin/profiles";
      const method = isEdit ? api.put : api.post;
      console.log(url)
      data.append('_method', 'PUT'); // Add this!
      // include theme & ui selection in the submission
      if (selectedThemeId) data.append("theme_id", String(selectedThemeId));
      if (selectedUiId) data.append("interface_id", String(selectedUiId));
      console.log("Submitting data:", {
        ...form,
        theme_id: selectedThemeId,
        interface_id: selectedUiId
      });
      const res = await api.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(isEdit ? "Profile updated successfully" : "Profile created successfully");
      // after creating a profile navigate to its public page
      if (!isEdit) {
        const created = res.data;
        const username = created?.username || created?.user?.username;
        if (username) {
          navigate(`/${username}`);
          return; // stop further reset when redirecting
        }
      }
      if (!isEdit) {
        localStorage.removeItem("profileId");
        setForm({
          email: "",
          username: "",
          designation: "",
          company_name: "",
          company_description: "",
          phone: "",
          whatsapp: "",
          website: "",
          google_map_link: "",
          address: "",
          profile_image: null,
          cover_image: null,
        });
        setSelectedThemeId("1");
        setSelectedUiId("modern");
        setHours([...hours].map(h => ({...h, open:'',close:'',isOpen:false}))); // reset if needed
        setLinks([]);
        setGalleryFiles([]);
        setServices([]);
        setProducts([]);
        setBlogs([]);
        setTestimonials([]);
        setTermsTitle("Terms and Conditions");
        setTermsContent("");
      }
    } catch (err: any) {
      // show server validation errors if available
      console.error(err);
      if (err.response && err.response.data) {
        const msg = err.response.data.message || JSON.stringify(err.response.data);
        toast.error(`Request failed: ${msg}`);
      } else {
        toast.error(isEdit ? "Failed to update profile" : "Failed to create profile");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 p-4 md:p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Profile Builder</h2>
          <p className="text-slate-400 text-sm">
            Create or edit a customer profile with the same controls as their dashboard.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" onKeyDown={(e) => {
        // stop Enter key from auto-submitting the form
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }}>
        <Card className="mb-6 bg-white/5 border border-white/10 shadow-none rounded-2xl">
          <CardContent className="space-y-4 p-6 md:p-8">
            {/* debug display current theme selection */}
            <div className="text-sm text-slate-400 mb-2">Selected theme: {selectedThemeId}, ui: {selectedUiId}</div>
            {/* Theme+UI selector (embedded, API disabled here) */}
            <div className="pt-2 pb-4">
              <h3 className="text-sm font-semibold mb-2">Profile Theme</h3>
              <div className="border border-white/10 rounded-2xl p-2 bg-white/5">
                <AdminThemeSelector
                  initialThemeId={selectedThemeId}
                  initialUiId={selectedUiId}
                  profileId={profileId || ""}
                  onConfigChange={(theme, ui) => {
                    setSelectedThemeId(String(theme));
                    setSelectedUiId(ui);
                  }}
                  disableApi={true} /* parent handles saving */
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Username</label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Company Name</label>
                <Input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Designation</label>
                <Input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white">Company Description</label>
              <Textarea
                name="company_description"
                value={form.company_description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Phone</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">WhatsApp</label>
                <Input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Google Map Link</label>
                <Input
                  name="google_map_link"
                  value={form.google_map_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Address</label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Website</label>
                <Input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Profile Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e, "profile_image")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "cover_image")}
              />
            </div>

            {/* Business hours section */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-brand-gold" />
                <h3 className="font-semibold text-sm text-white">Business Hours</h3>
              </div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                {hours.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-3 rounded-xl bg-white/5 px-3 py-2 border border-white/10"
                  >
                    <span className="w-24 text-xs font-semibold text-slate-300">{h.day}</span>
                    <input
                      type="time"
                      value={h.open}
                      disabled={!h.isOpen}
                      onChange={(e) => updateHour(idx, { open: e.target.value })}
                      className="border border-white/10 bg-white/5 rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="time"
                      value={h.close}
                      disabled={!h.isOpen}
                      onChange={(e) => updateHour(idx, { close: e.target.value })}
                      className="border border-white/10 bg-white/5 rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <label className="flex items-center gap-1 ml-auto text-xs font-medium text-slate-400">
                      <input
                        type="checkbox"
                        checked={h.isOpen}
                        onChange={(e) => updateHour(idx, { isOpen: e.target.checked })}
                        className="h-3 w-3 rounded border-white/20"
                      />
                      Open
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Social Links</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                  className="h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Link
                </Button>
              </div>
              <div className="space-y-2">
                {links.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-2 md:items-center rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <Input
                      placeholder="Platform (Instagram, LinkedIn...)"
                      value={l.platform}
                      onChange={(e) => updateLink(idx, { platform: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Profile URL"
                      value={l.url}
                      onChange={(e) => updateLink(idx, { url: e.target.value })}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(idx)}
                      className="self-start md:self-center text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {links.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No social links added yet. Use &ldquo;Add Link&rdquo; to connect profiles.
                  </p>
                )}
              </div>
            </div>

            {/* Gallery upload */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Gallery Images</h3>
                </div>
                <label className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-gold cursor-pointer">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGallery}
                    className="hidden"
                  />
                  <Plus className="h-3 w-3" /> Upload
                </label>
              </div>
              {galleryFiles.length > 0 ? (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGallery(idx)}
                        className="absolute top-2 right-2 bg-white/10 hover:bg-red-500/20 border border-white/10 rounded-full p-1 text-red-400 shadow-sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No gallery images yet. Upload a few to make the profile feel rich and visual.
                </p>
              )}
            </div>

            {/* Services */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Services</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addService}
                  className="h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Service
                </Button>
              </div>
              <div className="space-y-3">
                {services.map((s, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        placeholder="Service title"
                        value={s.title}
                        onChange={(e) => updateService(idx, { title: e.target.value })}
                        className="font-semibold text-sm"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>
                    <Textarea
                      placeholder="Short description of this service"
                      value={s.description}
                      onChange={(e) => updateService(idx, { description: e.target.value })}
                      className="text-sm"
                      rows={3}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateService(idx, {
                            image: e.target.files ? e.target.files[0] : null,
                          })
                        }
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(idx)}
                        className="text-red-400 hover:bg-red-500/10 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No services added yet. Use &ldquo;Add Service&rdquo; to showcase what this
                    customer offers.
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Products</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProduct}
                  className="h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Product
                </Button>
              </div>
              <div className="space-y-3">
                {products.map((p, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        placeholder="Product name"
                        value={p.name}
                        onChange={(e) => updateProduct(idx, { name: e.target.value })}
                        className="font-semibold text-sm"
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={p.price}
                        onChange={(e) => updateProduct(idx, { price: e.target.value })}
                        className="w-28 text-sm"
                      />
                    </div>
                    <Textarea
                      placeholder="Short description of this product"
                      value={p.description}
                      onChange={(e) => updateProduct(idx, { description: e.target.value })}
                      className="text-sm"
                      rows={3}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateProduct(idx, {
                            image: e.target.files ? e.target.files[0] : null,
                          })
                        }
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(idx)}
                        className="text-red-400 hover:bg-red-500/10 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No products added yet. Use &ldquo;Add Product&rdquo; to highlight what they
                    sell.
                  </p>
                )}
              </div>
            </div>

            {/* Blogs */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Blogs</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBlog}
                  className="h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Blog
                </Button>
              </div>
              <div className="space-y-3">
                {blogs.map((b, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        placeholder="Blog title"
                        value={b.title}
                        onChange={(e) => updateBlog(idx, { title: e.target.value })}
                        className="font-semibold text-sm"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>
                    <Textarea
                      placeholder="Blog content or excerpt..."
                      value={b.description}
                      onChange={(e) => updateBlog(idx, { description: e.target.value })}
                      className="text-sm"
                      rows={4}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateBlog(idx, {
                            image: e.target.files ? e.target.files[0] : null,
                          })
                        }
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlog(idx)}
                        className="text-red-400 hover:bg-red-500/10 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No blogs added yet. Use &ldquo;Add Blog&rdquo; to add articles.
                  </p>
                )}
              </div>
            </div>

            {/* Testimonials */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-brand-gold" />
                  <h3 className="font-semibold text-sm text-white">Testimonials</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTestimonial}
                  className="h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Testimonial
                </Button>
              </div>
              <div className="space-y-3">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Input
                        placeholder="Client name"
                        value={t.reviewer_name}
                        onChange={(e) =>
                          updateTestimonial(idx, { reviewer_name: e.target.value })
                        }
                        className="font-semibold text-sm"
                      />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 cursor-pointer transition-colors ${
                              star <= (t.rating ?? 5)
                                ? "text-brand-gold fill-brand-gold"
                                : "text-slate-500"
                            }`}
                            onClick={() => updateTestimonial(idx, { rating: star })}
                          />
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Client feedback or review..."
                      value={t.content}
                      onChange={(e) => updateTestimonial(idx, { content: e.target.value })}
                      className="text-sm"
                      rows={3}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <input
                          type="checkbox"
                          checked={!!t.is_visible}
                          onChange={(e) =>
                            updateTestimonial(idx, { is_visible: e.target.checked })
                          }
                          className="h-3 w-3 rounded border-white/20"
                        />
                        Visible on profile
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestimonial(idx)}
                        className="text-red-400 hover:bg-red-500/10 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No testimonials yet. Use &ldquo;Add Testimonial&rdquo; to add client reviews.
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-brand-gold" />
                <h3 className="font-semibold text-sm text-white">Terms &amp; Conditions</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 space-y-3">
                <Input
                  placeholder="Document title (e.g. Terms of Service)"
                  value={termsTitle}
                  onChange={(e) => setTermsTitle(e.target.value)}
                  className="font-semibold text-sm"
                />
                <Textarea
                  placeholder="Enter your terms and conditions here..."
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  className="text-sm min-h-[200px]"
                  rows={8}
                />
                <p className="text-xs text-slate-400">
                  This will appear at the bottom of the public profile page.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-brand-gold hover:bg-brand-accent text-brand-dark font-bold py-3 px-6 rounded-xl"
              >
                {isEdit ? 'Update Profile' : 'Publish Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateProfile;