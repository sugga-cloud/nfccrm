import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CartFloatingButton from "./CartFloatingButton";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token on mount and when storage changes
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    
    // Listen for login/logout events if they happen in other tabs/components
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <footer className="border-t border-slate-100 bg-white/50 backdrop-blur-md">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
         {/* Logo & Copyright */}
<div className="flex flex-col items-center md:items-start gap-1">
  <h3 className="text-lg font-black italic tracking-tighter text-slate-900">
    NFC<span className="text-[#f97316]">PROFILE</span>
  </h3>
  
  <div className="flex flex-col items-center md:items-start">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
      © {new Date().getFullYear()} All Rights Reserved.
    </p>
    
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
      Developed by{" "}
      <a 
        href="https://cognivox.online" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-slate-600 hover:text-[#f97316] transition-colors duration-300 underline-offset-2"
      >
        Cognivox Technology
      </a>
    </p>
  </div>
</div>

          {/* Dynamic Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link 
              to="/pricing" 
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors"
            >
              Pricing
            </Link>

            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-xs font-black uppercase tracking-widest text-[#f97316] hover:text-black transition-colors"
                >
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <div className={`h-1.5 w-1.5 rounded-full ${isLoggedIn ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isLoggedIn ? 'System Active' : 'Guest Mode'}
            </span>
          </div>
          
        </div>
        
        <CartFloatingButton/>
      </div>
    </footer>
  );
};

export default Footer;