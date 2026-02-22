import { ArrowUpRight, Wallet, Package, TrendingUp } from "lucide-react";

interface AdminSummaryCardsProps {
  totalServices: number;
}

export function AdminSummaryCards({ totalServices }: AdminSummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
        <div className="flex items-end justify-between">
          <h3 className="text-xl font-bold text-foreground">₹2.4L</h3>
          <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bookings</p>
        <h3 className="text-xl font-bold text-foreground">1,248</h3>
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Services</p>
        <h3 className="text-xl font-bold text-foreground">{totalServices.toString().padStart(2, '0')}</h3>
      </div>
    </div>
  );
}
