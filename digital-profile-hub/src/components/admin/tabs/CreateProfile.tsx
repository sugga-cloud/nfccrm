import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import AdminThemeSelector from "@/components/dashboard/tabs/LayoutTab";

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
  const navigate = useNavigate();

  // when editing, fetch existing profile
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("profileId");
    if (id) {
      setIsEdit(true);
      setProfileId(id);
      api.get(`/admin/profiles/${id}`)
        .then((res) => {
          const p = res.data;
          if (p.theme_id) setSelectedThemeId(p.theme_id.toString());
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
            setServices(p.services.map((s:any) => ({ title: s.title, description: s.description, image: null })));
          }
          if (p.products) {
            setProducts(p.products.map((pr:any) => ({ name: pr.name, description: pr.description, price: pr.price, image: null })));
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

    try {
      const url = isEdit && profileId ? `/admin/profiles/${profileId}` : "/admin/profiles";
      const method = isEdit ? api.put : api.post;
      // debug: theme before sending
      console.log("submitting themeId", selectedThemeId);
      // include theme selection in the submission
      if (selectedThemeId) data.append("theme_id", String(selectedThemeId));

      const res = await method(url, data, {
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
        setHours([...hours].map(h => ({...h, open:'',close:'',isOpen:false}))); // reset if needed
        setLinks([]);
        setGalleryFiles([]);
        setServices([]);
        setProducts([]);
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
    <div className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" onKeyDown={(e) => {
        // stop Enter key from auto-submitting the form
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }}>
        <Card className="mb-6">
          <CardContent className="space-y-4 p-6">
            {/* debug display current theme selection */}
            <div className="text-sm text-gray-500 mb-2">Selected theme: {selectedThemeId}</div>
            {/* Theme selector (embedded, API disabled here) */}
            <div className="pt-2 pb-4">
              <h3 className="text-sm font-semibold mb-2">Profile Theme</h3>
              <div className="border rounded p-2">
                <AdminThemeSelector
                  initialThemeId={selectedThemeId}
                  onThemeChange={(id) => setSelectedThemeId(String(id))}
                  disableApi={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Username</label>
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
                <label className="block text-sm font-semibold mb-1">Company Name</label>
                <Input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Designation</label>
                <Input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Company Description</label>
              <Textarea
                name="company_description"
                value={form.company_description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">WhatsApp</label>
                <Input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Google Map Link</label>
                <Input
                  name="google_map_link"
                  value={form.google_map_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Address</label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Website</label>
                <Input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Profile Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e, "profile_image")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "cover_image")}
              />
            </div>

            {/* Business hours section */}
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              {hours.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <span className="w-24 text-sm">{h.day}</span>
                  <input
                    type="time"
                    value={h.open}
                    disabled={!h.isOpen}
                    onChange={(e) => updateHour(idx, { open: e.target.value })}
                    className="border p-1 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={h.close}
                    disabled={!h.isOpen}
                    onChange={(e) => updateHour(idx, { close: e.target.value })}
                    className="border p-1 rounded"
                  />
                  <label className="ml-2">
                    <input
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={(e) => updateHour(idx, { isOpen: e.target.checked })}
                    />
                    Open
                  </label>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Social Links</h3>
              {links.map((l, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Platform"
                    value={l.platform}
                    onChange={(e) => updateLink(idx, { platform: e.target.value })}
                  />
                  <Input
                    placeholder="URL"
                    value={l.url}
                    onChange={(e) => updateLink(idx, { url: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    onClick={() => removeLink(idx)}
                    className="px-2"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addLink} className="mt-2">
                Add Link
              </Button>
            </div>

            {/* Gallery upload */}
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Gallery Images</h3>
              <Input type="file" multiple accept="image/*" onChange={handleGallery} />
              {galleryFiles.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {galleryFiles.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeGallery(idx)}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Services</h3>
              {services.map((s, idx) => (
                <div key={idx} className="space-y-2 mb-4">
                  <Input
                    placeholder="Title"
                    value={s.title}
                    onChange={(e) => updateService(idx, { title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={s.description}
                    onChange={(e) => updateService(idx, { description: e.target.value })}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateService(idx, { image: e.target.files ? e.target.files[0] : null })
                    }
                  />
                  <Button type="button" variant="outline" onClick={() => removeService(idx)}>
                    Remove service
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addService} className="mt-2">
                Add Service
              </Button>
            </div>

            {/* Products */}
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Products</h3>
              {products.map((p, idx) => (
                <div key={idx} className="space-y-2 mb-4">
                  <Input
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updateProduct(idx, { name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={p.description}
                    onChange={(e) => updateProduct(idx, { description: e.target.value })}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={p.price}
                    onChange={(e) => updateProduct(idx, { price: e.target.value })}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateProduct(idx, { image: e.target.files ? e.target.files[0] : null })
                    }
                  />
                  <Button type="button" variant="outline" onClick={() => removeProduct(idx)}>
                    Remove product
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addProduct} className="mt-2">
                Add Product
              </Button>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl"
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