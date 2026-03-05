export const themeRegistry = {
  interfaces: {
    "1": { id: "classic", spacing: "gap-0" },
    "2": { id: "modern", spacing: "gap-4 p-4" },
    "3": { id: "glass", spacing: "gap-6 p-6" },
    "4": { id: "minimal", spacing: "gap-2" },
    "5": { id: "bento", spacing: "gap-3 p-3" }
  },
  themes: {
    "1": { 
      id:"1",
      name: "Vibrant Orange", 
      primary: "text-orange-600", 
      accent: "bg-orange-500", 
      accentContent: "text-white", 
      bg: "bg-white", 
      card: "bg-white", 
      text: "text-slate-900", 
      border: "border-orange-100" 
    },
    "2": { 
      id:"2",
      name: "Midnight Indigo", 
      primary: "text-indigo-400", 
      accent: "bg-indigo-600", 
      accentContent: "text-white", 
      bg: "bg-slate-950", 
      card: "bg-slate-900", 
      text: "text-white", 
      border: "border-slate-800" 
    },
    "3": { 
      id:"3",
      name: "Forest Emerald", 
      primary: "text-emerald-700", 
      accent: "bg-emerald-600", 
      accentContent: "text-white", 
      bg: "bg-stone-50", 
      card: "bg-white", 
      text: "text-stone-900", 
      border: "border-emerald-100" 
    },
    "4": { 
      id:"4",
      name: "Royal Velvet", 
      primary: "text-purple-600", 
      accent: "bg-purple-600", 
      accentContent: "text-white", 
      bg: "bg-purple-50", 
      card: "bg-white", 
      text: "text-purple-950", 
      border: "border-purple-200" 
    },
    "5": { 
      id:"5",
      name: "Rose Gold", 
      primary: "text-rose-500", 
      accent: "bg-rose-400", 
      accentContent: "text-white", 
      bg: "bg-rose-50/30", 
      card: "bg-white", 
      text: "text-rose-900", 
      border: "border-rose-100" 
    },
    "6": { 
      id:"6",
      name: "Cyber Lime", 
      primary: "text-lime-400", 
      accent: "bg-lime-400", 
      accentContent: "text-black", // Corrected for visibility
      bg: "bg-black", 
      card: "bg-zinc-900", 
      text: "text-zinc-100", 
      border: "border-lime-900" 
    },
    "7": { 
      id:"7",
      name: "Ocean Drift", 
      primary: "text-cyan-600", 
      accent: "bg-cyan-500", 
      accentContent: "text-white", 
      bg: "bg-cyan-50", 
      card: "bg-white", 
      text: "text-cyan-950", 
      border: "border-cyan-200" 
    },
    "8": { 
      id:"8",
      name: "Coffee Roast", 
      primary: "text-amber-800", 
      accent: "bg-amber-700", 
      accentContent: "text-white", 
      bg: "bg-orange-50/20", 
      card: "bg-white", 
      text: "text-stone-800", 
      border: "border-amber-200" 
    },
    "9": { 
      id:"9",
      name: "Slate Professional", 
      primary: "text-slate-700", 
      accent: "bg-slate-800", 
      accentContent: "text-white", 
      bg: "bg-slate-100", 
      card: "bg-white", 
      text: "text-slate-900", 
      border: "border-slate-300" 
    },
    "10": { 
      id:"10",
      name: "Crimson Red", 
      primary: "text-red-600", 
      accent: "bg-red-600", 
      accentContent: "text-white", 
      bg: "bg-white", 
      card: "bg-red-50/30", 
      text: "text-red-950", 
      border: "border-red-100" 
    },
    "11": { 
      id:"11",
      name: "Deep Teal", 
      primary: "text-teal-400", 
      accent: "bg-teal-600", 
      accentContent: "text-white", 
      bg: "bg-zinc-950", 
      card: "bg-zinc-900", 
      text: "text-teal-50", 
      border: "border-teal-900" 
    },
    "12": { 
      id:"12",
      name: "Soft Sky", 
      primary: "text-sky-500", 
      accent: "bg-sky-400", 
      accentContent: "text-white", 
      bg: "bg-sky-50", 
      card: "bg-white", 
      text: "text-sky-900", 
      border: "border-sky-100" 
    },
    "13": { 
      id:"13",
      name: "Lemon Zest", 
      primary: "text-yellow-700", 
      accent: "bg-yellow-400", 
      accentContent: "text-black", // Corrected for visibility
      bg: "bg-white", 
      card: "bg-yellow-50", 
      text: "text-yellow-950", 
      border: "border-yellow-200" 
    },
    "14": { 
      id:"14",
      name: "Pure Dark", 
      primary: "text-zinc-100", 
      accent: "bg-zinc-100", 
      accentContent: "text-black", // CRITICAL FIX: Icons/Text on white background
      bg: "bg-black", 
      card: "bg-zinc-900", 
      text: "text-zinc-400", 
      border: "border-zinc-800" 
    },
    "15": { 
      id:"15",
      name: "Candy Pink", 
      primary: "text-pink-500", 
      accent: "bg-pink-500", 
      accentContent: "text-white", 
      bg: "bg-white", 
      card: "bg-pink-50", 
      text: "text-pink-900", 
      border: "border-pink-200" 
    },
    "16": { 
      id: "16",
      name: "Midnight Gold", 
      primary: "text-amber-400", 
      accent: "bg-amber-500", 
      accentContent: "text-black", 
      bg: "bg-[#0a0a0a]", 
      card: "bg-zinc-900", 
      text: "text-amber-50", 
      border: "border-amber-900/50" 
    },
    "17": { 
      id: "17",
      name: "Nordic Snow", 
      primary: "text-blue-400", 
      accent: "bg-slate-200", 
      accentContent: "text-slate-900", 
      bg: "bg-slate-50", 
      card: "bg-white", 
      text: "text-slate-800", 
      border: "border-slate-200" 
    },
    "18": { 
      id: "18",
      name: "Toxic Neon", 
      primary: "text-fuchsia-500", 
      accent: "bg-fuchsia-600", 
      accentContent: "text-white", 
      bg: "bg-zinc-950", 
      card: "bg-zinc-900", 
      text: "text-fuchsia-50", 
      border: "border-fuchsia-900" 
    },
    "19": { 
      id: "19",
      name: "Desert Sand", 
      primary: "text-orange-800", 
      accent: "bg-[#c4a484]", 
      accentContent: "text-white", 
      bg: "bg-[#f5ebe0]", 
      card: "bg-white/80", 
      text: "text-orange-950", 
      border: "border-[#d3c2b2]" 
    },
    "20": { 
      id: "20",
      name: "Deep Forest", 
      primary: "text-green-400", 
      accent: "bg-green-700", 
      accentContent: "text-white", 
      bg: "bg-[#051101]", 
      card: "bg-[#0a1a05]", 
      text: "text-green-50", 
      border: "border-green-900" 
    }
  }
};