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

  // Handle scroll effect for glassmorphism
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
  const isLoggedIn = role === "customer" || role === "admin";

  return (
  <header 
  className={cn(
    "sticky top-0 z-[50] w-full transition-all duration-300 ease-in-out",
    // Keep height consistent to prevent layout shift
    "h-16 md:h-20 flex items-center", 
    scrolled 
      ? "bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-sm py-2" 
      : "bg-transparent py-4"
  )}
>
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#f97316] p-1.5 rounded-xl transition-transform group-hover:rotate-12">
            <div className="h-5 w-5 bg-white rounded-md" />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">
            NFC<span className="text-[#f97316]">PROFILE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/pricing" className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors">
            <CreditCard className="h-3.5 w-3.5" /> Pricing
          </Link>
          
          {role === "customer" && (
            <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
          )}
          
          {role === "admin" && (
            <Link to="/admin" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </Link>
          )}

          <div className="flex items-center gap-3 ml-4 pl-6 border-l border-slate-200">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-[#f97316] hover:bg-orange-50 rounded-xl" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-[#f97316] hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl px-6 shadow-lg shadow-orange-100" asChild>
                  <Link to="/register">Join Now</Link>
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl text-xs font-black uppercase tracking-widest gap-2"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 active:scale-90 transition-transform" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <nav className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4 duration-300">
          <Link to="/pricing" className="text-sm font-bold text-slate-600 flex items-center gap-3 p-2" onClick={() => setMobileOpen(false)}>
            <CreditCard className="h-4 w-4 text-[#f97316]" /> Pricing
          </Link>
          
          {isLoggedIn && (
            <Link to={role === "admin" ? "/admin" : "/dashboard"} className="text-sm font-bold text-slate-600 flex items-center gap-3 p-2" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="h-4 w-4 text-[#f97316]" /> {role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>
          )}

          <hr className="border-slate-50" />

          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-xl font-bold" asChild>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              </Button>
              <Button className="bg-[#f97316] hover:bg-black text-white rounded-xl font-bold" asChild>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="w-full rounded-xl font-bold gap-2"
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