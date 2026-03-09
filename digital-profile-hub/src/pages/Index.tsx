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
  QrCode,
  ArrowRight,
  Infinity,
  Globe
} from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative container flex min-h-[90vh] flex-col items-center justify-center text-center px-4 overflow-hidden bg-brand-dark">
        {/* Background Ambient Glow inspired by logo colors */}
        <div className="absolute top-1/4 -z-10 h-[400px] w-[800px] rounded-full bg-brand-gold/10 blur-[150px]" />
        
        <div className="inline-flex items-center rounded-full border border-brand-gold/30 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-accent mb-8 bg-white/5 backdrop-blur-md uppercase">
          <Infinity className="mr-2 h-4 w-4 text-brand-gold" />
          <span>Infinite Professional Connections</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-8xl text-white leading-[0.85] mb-6">
          YOUR IDENTITY <br />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F8E391] to-[#B8860B] bg-clip-text text-transparent lowercase tracking-normal">
            Simplified.
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
          The premium 1-tap solution for elite networking. Connect your <span className="text-white font-bold">Portfolio, Store, and vCard</span> with a single tap.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-brand-gold/20 bg-brand-gold hover:bg-brand-accent text-brand-dark transition-all duration-300 group" asChild>
            <Link to="/register" className="flex items-center">
              Create My Link <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10 transition-all" asChild>
            <Link to="/pricing">Explore Luxury Themes</Link>
          </Button>
        </div>

        {/* Device Preview Component */}
        <div className="mt-20 relative w-full max-w-5xl group">
          <div className="absolute -inset-1 bg-brand-gold/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition duration-1000"></div>
          <div className="relative bg-[#0A1225] border border-white/10 rounded-t-[3rem] p-4 pb-0 shadow-2xl">
            <div className="bg-brand-dark border border-white/5 rounded-t-[2.5rem] h-[400px] flex flex-col items-center justify-center overflow-hidden">
               <div className="flex gap-2 mb-8 opacity-30">
                 <div className="h-3 w-3 rounded-full bg-brand-gold" />
                 <div className="h-3 w-3 rounded-full bg-brand-gold" />
                 <div className="h-3 w-3 rounded-full bg-brand-gold" />
               </div>
               <span className="bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent font-black text-4xl tracking-tighter uppercase">
                 MyWebLink Interface
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-brand-dark py-32 border-t border-white/5">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">
                Premium <span className="text-brand-gold">Features</span> <br /> For Professionals.
              </h2>
            </div>
            <p className="text-slate-400 font-medium max-w-xs border-l-2 border-brand-gold pl-4">
              Integrated with NFC technology for instant business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Smartphone className="text-brand-dark" />, 
                title: "NFC Tap Sharing", 
                desc: "Instant contact sharing with a single tap of your card to any smartphone." 
              },
              { 
                icon: <Store className="text-brand-dark" />, 
                title: "Digital Store", 
                desc: "Sell products and book appointments directly from your profile page." 
              },
              { 
                icon: <QrCode className="text-brand-dark" />, 
                title: "Dynamic QR", 
                desc: "Custom branded QR codes that link to your latest information instantly." 
              },
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-brand-gold/40 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-brand-gold flex items-center justify-center mb-8 shadow-lg shadow-brand-gold/10 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-brand-dark py-32 text-white relative overflow-hidden">
        <div className="container relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Elite Management <br />
              <span className="text-brand-gold font-serif italic font-light lowercase tracking-normal">in the palm of your hand.</span>
            </h2>
            
            <div className="grid gap-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-brand-gold flex-shrink-0 flex items-center justify-center text-brand-dark">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-tight">Performance Analytics</h4>
                  <p className="text-slate-400 text-sm mt-1">Monitor visits, engagement rates, and booking success instantly.</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-tight">Enterprise Security</h4>
                  <p className="text-slate-400 text-sm mt-1">Bank-grade encryption and secure payment processing for your store.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-brand-gold/10 blur-[100px] rounded-full" />
            <div className="relative bg-[#0A1225] border border-brand-gold/20 rounded-[3rem] p-8 shadow-3xl">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Dashboard Live</span>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Enquiry Forms", "Blog Section", "Gallery Grid", "vCard Export"].map(item => (
                  <div key={item} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </section>
    
    </MainLayout>
  );
};

export default Index;