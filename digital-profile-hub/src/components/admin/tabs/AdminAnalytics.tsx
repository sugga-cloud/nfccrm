import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users, UserCheck, IndianRupee, HardDrive, AlertCircle, Loader2 } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
const COLORS = ["#D4AF37", "#F8E391", "#10b981", "#6366f1", "#8b5cf6"];

interface AnalyticsData {
  total_users: number;
  total_revenue: number;
  chart_data: object;
  active_profiles: number;
  revenue: number;
  storage_gb: number;
  plan_distribution: { name: string; value: number }[];
}

const AdminAnalytics = () => {
  // --- CACHED DATA FETCHING ---
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["adminSystemOverview"], // Unique key for caching
    queryFn: async () => {
      try{
      const res = await api.get("/admin/analytics");
      console.log(res.data);
      return res.data;
      }catch(err){
        console.log(err.response.data);
        throw new Error("Failed");
        
      }
    },
    // CACHE SETTINGS:
    staleTime: 1000 * 60 * 10, // Data stays "fresh" for 10 minutes
    gcTime: 1000 * 60 * 30,    // Keep in garbage collection for 30 minutes
    retry: 2,                  // Retry twice on failure
  });

  if (isLoading) return (
    <div className="flex h-96 w-full items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
      <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Gathering System Insights...</span>
    </div>
  );

  if (error || !data) return (
    <div className="m-4 flex items-center gap-3 rounded-2xl bg-red-500/10 p-6 text-red-400 border border-red-500/20">
      <AlertCircle className="h-5 w-5" />
      <p className="font-bold">Failed to load system analytics. Please check your connection.</p>
    </div>
  );

  const stats = [
    { name: "Total Users", value: data.total_users.toLocaleString(), icon: <Users className="h-4 w-4 text-brand-gold" /> },
    { name: "Active Profiles", value: data.active_profiles.toLocaleString(), icon: <UserCheck className="h-4 w-4 text-emerald-500" /> },
    { name: "Total Revenue", value: `₹${data.total_revenue.toLocaleString()}`, icon: <IndianRupee className="h-4 w-4 text-brand-gold" /> },
    { name: "Storage Used", value: `${data.storage_gb} GB`, icon: <HardDrive className="h-4 w-4 text-slate-400" /> },
  ];

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Platform Metrics</p>
        </div>
        {/* Visual Indicator of fresh data */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Cache
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.name} className="bg-white/5 border border-white/10 shadow-none rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{s.name}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic text-white">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-3 bg-white/5 border border-white/10 shadow-none rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-black italic uppercase tracking-tighter text-white">Plan <span className="text-brand-gold">Distribution</span></CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.plan_distribution} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" cy="50%" 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={8}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.plan_distribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

   <Card className="col-span-4 bg-white/5 border border-white/10 shadow-none rounded-3xl overflow-hidden">
  <CardHeader className="pb-2">
    <CardTitle className="text-lg font-black italic uppercase tracking-tighter text-white">
      Revenue <span className="text-brand-gold">Analytics</span>
    </CardTitle>
  </CardHeader>
  
  <CardContent className="h-[300px] w-full px-2 pb-4">
    {/* Ensure data exists before rendering to avoid invisible charts */}
    {data?.chart_data?.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data.chart_data} 
          margin={{ top: 10, right: 10, left: -15, bottom: 20 }} // Increased bottom margin for dates
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            // Fix: Rotate dates or show more intervals for clarity
            tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }}
            dy={10} 
            tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
            interval={0} // Shows every single date label
            minTickGap={10}
          />
          
          <YAxis 
            hide={false} // Set to true if you want a super-clean "Zoom" look
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
            // ZOOM EFFECT: This scales the graph to the data range
            domain={['auto', 'auto']} 
          />

          <Tooltip 
            cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '8px 12px' 
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          />

          <Area 
            type="stepAfter" // Use 'stepAfter' or 'monotone' for different "zoom" feels
            dataKey="total" 
            stroke="#D4AF37" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#revenueGradient)" 
            animationDuration={1500}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#D4AF37' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
         <div className="h-1 bg-white/10 w-2/3 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold/30 animate-pulse w-full" />
         </div>
         <p className="text-[10px] font-black uppercase mt-4 tracking-widest">Awaiting Transaction Data...</p>
      </div>
    )}
  </CardContent>
</Card>
      </div>
    </div>
  );
};

// Helper for future icon use
const TrendingUp = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
)

export default AdminAnalytics;