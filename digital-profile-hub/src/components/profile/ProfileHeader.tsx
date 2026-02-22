import { motion } from "framer-motion";
import { Building2, Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  data: {
    user: {
      full_name: string;
    };
    designation: string;
    company_name: string;
    company_description: string;
    cover_image: string;
    profile_image: string;
  } | null;
  theme?: "orange" | "blue" | "purple" | "emerald" | "rose"; // Theme selector
}

const ProfileHeader = ({ data, theme = "orange" }: ProfileHeaderProps) => {
  if (!data) return <div className="h-64 w-full animate-pulse bg-slate-100 rounded-b-[3rem]" />;

  // Theme mapping for CSS variables
  const themeClasses = {
    orange: "[--profile-primary:#f97316] [--profile-bg:theme(colors.orange.50)]",
    blue: "[--profile-primary:#3b82f6] [--profile-bg:theme(colors.blue.50)]",
    purple: "[--profile-primary:#a855f7] [--profile-bg:theme(colors.purple.50)]",
    emerald: "[--profile-primary:#10b981] [--profile-bg:theme(colors.emerald.50)]",
    rose: "[--profile-primary:#f43f5e] [--profile-bg:theme(colors.rose.50)]",
  };

  return (
    <section className={cn("relative overflow-hidden bg-white pb-8 shadow-sm rounded-b-[3rem]", themeClasses[theme])}>
      {/* Cover Image with Parallax-like Fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-48 w-full overflow-hidden bg-slate-200 sm:h-64 relative"
      >
        <img 
          src={data.cover_image} 
          alt="Cover" 
          className="h-full w-full object-cover" 
          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1557683316-973673baf926")} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col items-center sm:flex-row sm:items-end -mt-20 sm:-mt-24 space-y-4 sm:space-y-0 sm:space-x-6">
          
          {/* Profile Image with Animated Border */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative group"
          >
            <div className="h-36 w-36 sm:h-44 sm:w-44 shrink-0 overflow-hidden rounded-[2.5rem] border-8 border-white bg-slate-100 shadow-2xl relative z-10">
              <img 
                src={data.profile_image} 
                alt={data.user.full_name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
            </div>
            {/* Decorative Theme-colored shape behind avatar */}
            <div className="absolute -inset-1 bg-[var(--profile-primary)] opacity-20 blur-2xl rounded-full" />
          </motion.div>

          {/* User Info with Staggered Fade */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center sm:text-left pb-2"
          >
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
              {data.user.full_name}
            </h1>
            
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Briefcase className="h-4 w-4 text-[var(--profile-primary)]" />
                {data.designation}
              </span>
              <span className="flex items-center gap-1.5 text-[var(--profile-primary)] bg-[var(--profile-bg)] px-3 py-1 rounded-full">
                <Building2 className="h-4 w-4" />
                {data.company_name}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Description Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-100"
        >
          <p className="text-slate-600 leading-relaxed font-medium">
            {data.company_description || "No description provided."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfileHeader;