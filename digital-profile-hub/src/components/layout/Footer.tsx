import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CartFloatingButton from "./CartFloatingButton";
import { Infinity } from "lucide-react";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <footer className="border-t border-white/5 bg-brand-dark/95 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Infinity className="h-5 w-5 text-brand-gold" />
              <h3 className="text-xl font-black tracking-tighter text-white uppercase">
                MYWEB<span className="text-brand-gold">LINK</span>
              </h3>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} All Rights Reserved.
              </p>
              
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Developed by{" "}
                <a 
                  href="https://cognivox.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-gold transition-colors duration-300 underline-offset-4 decoration-brand-gold/30 underline"
                >
                  Cognivox Technology
                </a>
              </p>
            </div>
          </div>

          {/* Dynamic Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <Link 
              to="/pricing" 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-gold transition-colors"
            >
              Pricing
            </Link>

            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-gold hover:text-brand-accent transition-colors"
              >
                My Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-gold transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-gold transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 shadow-inner">
            <div className={`h-1.5 w-1.5 rounded-full ${isLoggedIn ? 'bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isLoggedIn ? 'Secured & Active' : 'Public Access'}
            </span>
          </div>
          
        </div>
        
        <CartFloatingButton/>
      </div>
    </footer>
  );
};

export default Footer;