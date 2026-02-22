import { Wallet, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import { AdminRevenueResponse } from "../../../../api/managerApi";

interface RevenueAdminSummaryProps {
  data: AdminRevenueResponse;
}

export function RevenueAdminSummary({ data }: RevenueAdminSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-foreground">
            {data.currency} {data.totalRevenue.toLocaleString()}
          </h3>
          <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Overall
          </span>
        </div>
      </div>
      
      <div className="bg-muted/50 border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Bookings</p>
        <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{data.totalBookings}</h3>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg. Rev / Booking</p>
        <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">
                {data.currency} {data.averageRevenuePerBooking.toFixed(2)}
            </h3>
        </div>
      </div>
    </div>
  );
}
