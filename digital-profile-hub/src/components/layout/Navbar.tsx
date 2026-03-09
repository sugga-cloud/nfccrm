import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { role, logout } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };
  const isLoggedIn = role === "customer" || role === "admin" || role === "staff";

  return (
    <header 
      className={cn(
        "sticky top-0 z-[50] w-full transition-all duration-500 ease-in-out",
        "h-16 md:h-20 flex items-center", 
        scrolled 
          ? "bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
        <div className="flex items-center  gap-2 bg-white h-10 md:h-16 pb-2 rounded-full">
        <img
  src="/logo.PNG"
  alt="MyWebLink logo"
  className="h-auto w-28 object-contain md:w-60"
/>
            </div>
            
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { to: "/pricing", label: "Pricing", icon: CreditCard, show: true },
            { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: role === "customer" },
            { to: "/admin", label: "Admin", icon: ShieldCheck, show: role === "admin" },
            { to: "/staff", label: "Staff Panel", icon: LayoutDashboard, show: role === "staff" },
          ].map((item) => item.show && (
            <Link 
              key={item.to}
              to={item.to} 
              className={cn(
                "group flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
                scrolled ? "text-slate-300 hover:text-brand-gold" : "text-slate-500 hover:text-brand-gold"
              )}
            >
              <item.icon className="h-3.5 w-3.5" /> {item.label}
            </Link>
          ))}
          
          <div className={cn(
            "flex items-center gap-3 ml-4 pl-6 border-l",
            scrolled ? "border-white/10" : "border-slate-200"
          )}>
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                    scrolled ? "text-white hover:bg-white/5" : "text-slate-600 hover:bg-slate-100"
                  )} 
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="btn-gold h-10 px-6 rounded-xl text-[11px]" asChild>
                  <Link to="/register">Join Now</Link>
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className={cn(
                  "rounded-xl text-[11px] font-black uppercase tracking-[0.2em] gap-2 transition-all",
                  scrolled 
                    ? "border-white/10 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20" 
                    : "border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600"
                )}
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={cn(
            "md:hidden p-2 rounded-xl transition-all active:scale-90",
            scrolled ? "bg-white/5 text-brand-gold" : "bg-slate-100 text-slate-600"
          )} 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <nav className="absolute top-full left-0 w-full bg-brand-dark border-b border-white/5 p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          {[
            { to: "/pricing", label: "Pricing", icon: CreditCard, show: true },
            { 
              to: role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/dashboard", 
              label: role === "admin" ? "Admin Panel" : role === "staff" ? "Staff Panel" : "Dashboard", 
              icon: LayoutDashboard, 
              show: isLoggedIn 
            },
          ].map((item) => item.show && (
            <Link 
              key={item.to}
              to={item.to} 
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 text-brand-gold" /> {item.label}
            </Link>
          ))}

          <hr className="border-white/5" />

          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="rounded-2xl font-black uppercase tracking-widest border-white/10 text-white" asChild>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              </Button>
              <Button className="btn-gold rounded-2xl" asChild>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="w-full rounded-2xl font-black uppercase tracking-widest gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;