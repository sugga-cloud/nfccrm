// Placeholder data for the public profile page
export const profileData = {
  name: "Alex Johnson",
  designation: "Senior Product Designer",
  company: "DesignCraft Studio",
  companyDescription: "We craft beautiful digital experiences that connect brands with their audience through innovative design solutions.",
  coverImage: "/placeholder.svg",
  profileImage: "/placeholder.svg",
  phone: "+1 (555) 123-4567",
  email: "alex@designcraft.com",
  whatsapp: "+15551234567",
  website: "https://designcraft.com",
  mapUrl: "https://maps.google.com/?q=New+York",
  socials: {
    instagram: "https://instagram.com/alexj",
    facebook: "https://facebook.com/alexj",
    linkedin: "https://linkedin.com/in/alexj",
    youtube: "https://youtube.com/@alexj",
    twitter: "https://twitter.com/alexj",
  },
};

export const servicesData = [
  { id: 1, title: "UI/UX Design", description: "Creating intuitive and beautiful user interfaces for web and mobile apps.", image: "/placeholder.svg" },
  { id: 2, title: "Brand Identity", description: "Developing cohesive brand identities that tell your unique story.", image: "/placeholder.svg" },
  { id: 3, title: "Web Development", description: "Building fast, responsive websites with modern technologies.", image: "/placeholder.svg" },
  { id: 4, title: "Mobile Apps", description: "Designing seamless mobile experiences for iOS and Android.", image: "/placeholder.svg" },
];

export const galleryData = [
  { id: 1, type: "image" as const, url: "/placeholder.svg", title: "Project Alpha" },
  { id: 2, type: "image" as const, url: "/placeholder.svg", title: "Brand Redesign" },
  { id: 3, type: "video" as const, url: "/placeholder.svg", title: "Product Demo" },
  { id: 4, type: "image" as const, url: "/placeholder.svg", title: "UI Showcase" },
  { id: 5, type: "image" as const, url: "/placeholder.svg", title: "Mobile App" },
  { id: 6, type: "video" as const, url: "/placeholder.svg", title: "Tutorial" },
];

export const productsData = [
  { id: 1, name: "Design Template Pack", description: "50+ premium design templates for Figma.", price: 49, image: "/placeholder.svg" },
  { id: 2, name: "Icon Set Pro", description: "1000+ hand-crafted SVG icons.", price: 29, image: "/placeholder.svg" },
  { id: 3, name: "UI Kit Bundle", description: "Complete UI kit with 200+ components.", price: 79, image: "/placeholder.svg" },
];

export const blogsData = [
  { id: 1, title: "The Future of Design Systems", date: "2025-12-15", excerpt: "Exploring how design systems are evolving with AI and automation tools.", image: "/placeholder.svg", content: "Design systems have become the backbone of modern product development. In this article, we explore how AI tools are transforming the way teams build and maintain their design systems, making them more adaptive and intelligent than ever before." },
  { id: 2, title: "Building Accessible Interfaces", date: "2025-11-28", excerpt: "A guide to creating inclusive digital experiences for everyone.", image: "/placeholder.svg", content: "Accessibility is not just a compliance checkbox — it's about creating experiences that work for everyone. This guide covers practical techniques for building interfaces that are truly inclusive, from color contrast to keyboard navigation." },
  { id: 3, title: "Color Theory in Practice", date: "2025-11-10", excerpt: "How to apply color theory principles to your design projects.", image: "/placeholder.svg", content: "Understanding color theory is fundamental to good design. In this article, we break down the key principles and show you how to apply them effectively in your projects, from choosing palettes to creating visual hierarchy." },
];

export const businessHoursData = [
  { day: "Monday", open: "09:00 AM", close: "06:00 PM", isOpen: true },
  { day: "Tuesday", open: "09:00 AM", close: "06:00 PM", isOpen: true },
  { day: "Wednesday", open: "09:00 AM", close: "06:00 PM", isOpen: true },
  { day: "Thursday", open: "09:00 AM", close: "06:00 PM", isOpen: true },
  { day: "Friday", open: "09:00 AM", close: "05:00 PM", isOpen: true },
  { day: "Saturday", open: "10:00 AM", close: "02:00 PM", isOpen: true },
  { day: "Sunday", open: "", close: "", isOpen: false },
];

export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];
