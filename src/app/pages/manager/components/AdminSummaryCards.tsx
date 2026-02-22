import { ArrowUpRight, Wallet, Package, TrendingUp } from "lucide-react";

interface AdminSummaryCardsProps {
  totalServices: number;
}

export function AdminSummaryCards({ totalServices }: AdminSummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-none">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Revenue</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">₹2.4L</h3>
          <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20 uppercase tracking-widest">
            +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
      <div className="bg-muted/50 border-2 border-border p-4 rounded-none">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Bookings</p>
        <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">1,248</h3>
      </div>
      <div className="bg-muted/50 border-2 border-border p-4 rounded-none">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Services</p>
        <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">{totalServices.toString().padStart(2, '0')}</h3>
      </div>
    </div>
  );
}
