import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { ServiceRevenue } from "../../../../api/managerApi";
import { useState } from "react";
import { RevenueResourceDetail } from "./RevenueResourceDetail";

interface RevenueServiceListProps {
  services: ServiceRevenue[];
  currency: string;
}

export function RevenueServiceList({ services, currency }: RevenueServiceListProps) {
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);

  const toggleExpand = (serviceId: number) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" />
        Service Performance
      </h3>
      <div className="grid gap-3">
        {services.map((service) => (
          <div 
            key={service.serviceId} 
            className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card/50 transition-all duration-300"
          >
            <div 
              className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-card transition-colors ${expandedServiceId === service.serviceId ? 'bg-card' : ''}`} 
              onClick={() => toggleExpand(service.serviceId)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <Package className="w-5 h-5 text-primary/60" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {service.serviceName}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-0.5">
                    {service.totalBookings} Bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-0.5">Total Revenue</p>
                  <p className="text-base font-bold text-foreground">
                    {currency} {service.totalRevenue.toLocaleString()}
                  </p>
                </div>
                {expandedServiceId === service.serviceId ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedServiceId === service.serviceId && (
              <div className="p-4 pt-0 border-t border-border/50 bg-muted/20 animate-in slide-in-from-top-2 duration-300">
                <RevenueResourceDetail 
                  resources={service.resourceRevenues} 
                  currency={currency} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
