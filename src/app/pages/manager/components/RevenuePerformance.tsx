import { TrendingUp } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { revenueData } from "./constants";

export function RevenuePerformance() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Revenue Performance
        </h3>
      </div>
      <div className="h-72 w-full bg-background border-2 border-border p-6 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '0px', border: '2px solid hsl(var(--border))', boxShadow: '4px 4px 0 0 rgba(0,0,0,0.1)' }} itemStyle={{ color: 'hsl(var(--primary))', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }} />
            <Area type="step" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
