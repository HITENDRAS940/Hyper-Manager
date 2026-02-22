import { Layout, TrendingUp } from "lucide-react";
import { ResourceRevenue } from "../../../../api/managerApi";

interface RevenueResourceDetailProps {
  resources: ResourceRevenue[];
  currency: string;
}

export function RevenueResourceDetail({ resources, currency }: RevenueResourceDetailProps) {
  return (
    <div className="pl-6 mt-4 space-y-3 border-l-2 border-primary/10">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
        Resource Breakdown
      </h4>
      <div className="grid gap-2">
        {resources.map((resource) => (
          <div 
            key={resource.resourceId} 
            className="bg-background/40 rounded-xl p-3 border border-border/40 hover:border-primary/20 transition-all group/res"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Layout className="w-4 h-4 text-primary/60" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{resource.resourceName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground">Bookings:</span>
                        <span className="text-[10px] font-bold text-foreground">{resource.bookingCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-primary/40" />
                        <span className="text-[10px] font-medium text-muted-foreground">Avg:</span>
                        <span className="text-[10px] font-bold text-foreground">{currency} {resource.averageRevenuePerBooking.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-0.5">Revenue</p>
                <p className="text-sm font-bold text-primary">{currency} {resource.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
