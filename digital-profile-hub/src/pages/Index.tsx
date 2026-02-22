import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Zap, 
  Smartphone, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  BarChart3, 
  QrCode 
} from "lucide-react";

const Index = () => (
  <MainLayout>
    {/* Hero Section: The Goal of the Platform */}
    <section className="container flex min-h-[85vh] flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-primary mb-6 bg-primary/5">
        <Zap className="mr-2 h-4 w-4" />
        <span>Future of Networking</span>
      </div>
      <h1 className="text-4xl font-black italic tracking-tighter sm:text-6xl uppercase text-slate-900 leading-[0.9]">
        Your Digital Identity, <br />
        <span className="text-orange-500">One Tap Away</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-500 font-medium">
        Replace physical visiting cards with a high-performance <strong>Mini Website + Portfolio + Store</strong>. 
        Share instantly via NFC tap or auto-generated QR codes.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg" asChild>
          <Link to="/register">Create Your Profile</Link>
        </Button>
        <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold border-slate-200" asChild>
          <Link to="/pricing">Explore Plans</Link>
        </Button>
      </div>
      
      {/* Device Mockup Teaser */}
      <div className="mt-16 w-full max-w-4xl border-x border-t border-slate-100 rounded-t-[3rem] bg-slate-50/50 p-4 pb-0">
         <div className="bg-white rounded-t-[2.5rem] h-64 shadow-2xl flex items-center justify-center text-slate-300 font-black tracking-widest uppercase italic">
            [ Mobile & Desktop Optimized Interface ]
         </div>
      </div>
    </section>

    {/* Features Grid: Profile Interface Sections */}
    <section className="container py-24 border-t border-slate-100">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
          Everything You Need <span className="text-orange-500">In One Page</span>
        </h2>
        <p className="text-slate-500 mt-2">A single-page scroll interface optimized for instant connection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Smartphone className="h-6 w-6" />,
            title: "NFC Tap Sharing",
            desc: "NFC Tap opens your profile instantly on any mobile device without an app."
          },
          {
            icon: <Store className="h-6 w-6" />,
            title: "Digital Store & Menu",
            desc: "Showcase products with pricing, 'Add to Cart', and optional online payments."
          },
          {
            icon: <QrCode className="h-6 w-6" />,
            title: "Auto-Generated QR",
            desc: "Every profile gets a unique URL and an auto-generated QR code for easy sharing."
          },
          {
            icon: <BarChart3 className="h-6 w-6" />,
            title: "Real-time Analytics",
            desc: "Track profile visits, enquiries, and appointment bookings from your dashboard."
          },
          {
            icon: <ShieldCheck className="h-6 w-6" />,
            title: "Secure & Scalable",
            desc: "SSL security, data encryption, and role-based access for complete peace of mind."
          },
          {
            icon: <CreditCard className="h-6 w-6" />,
            title: "vCard Integration",
            desc: "One-click 'Add to Contact' button to save details directly to the phone book."
          }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-orange-500 transition-colors mb-6 shadow-lg">
              {feature.icon}
            </div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-slate-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Roles Section: User Capabilities */}
    <section className="bg-slate-950 py-24 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            Managed By You, <br />
            <span className="text-orange-500">Controlled by Us</span>
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-6 w-6 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm">Customer Dashboard</h4>
                <p className="text-slate-400 text-sm">Edit profile info, upload media, manage services, and view appointments [cite: 83-87].</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-6 w-6 rounded-full bg-slate-700 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-sm">Admin Power</h4>
                <p className="text-slate-400 text-sm">Manage subscriptions, track payments, and monitor system storage [cite: 93-98].</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 backdrop-blur-sm">
           <ul className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> Enquiry Forms</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> Blog Section</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> Gallery Grid</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> Business Hours</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> Slot Selection</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"/> vCard Export</li>
           </ul>
        </div>
      </div>
    </section>
  </MainLayout>
);

export default Index;