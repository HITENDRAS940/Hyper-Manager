import { useState, useEffect } from "react";
import { X, TrendingUp, Loader2, AlertCircle, Calendar } from "lucide-react";
import { AdminRevenueResponse, managerApi, AdminUser } from "../../../../api/managerApi";
import { Button } from "../../../../components/ui/button";
import {
  Sheet,
  SheetContent,
} from "../../../../components/ui/sheet";
import { RevenueAdminSummary } from "./RevenueAdminSummary";
import { RevenueServiceList } from "./RevenueServiceList";

interface RevenueBreakdownSheetProps {
  admin: AdminUser | null;
  open: boolean;
  onClose: () => void;
}

export function RevenueBreakdownSheet({ admin, open, onClose }: RevenueBreakdownSheetProps) {
  const [data, setData] = useState<AdminRevenueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRevenue = async () => {
    if (!admin) return;
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getAdminRevenue(admin.id);
      setData(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch revenue breakdown");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && admin) {
      fetchRevenue();
    } else if (!open) {
      setData(null);
    }
  }, [open, admin]);

  if (!admin) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-background border-l border-border overflow-y-auto p-0 gap-0">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground leading-tight">Revenue Analytics</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{admin.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-50">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Generating breakdown...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-2" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-destructive underline decoration-destructive/30 decoration-2">Breakdown Failed</p>
                <p className="text-xs text-destructive/80 font-medium px-4">{error}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2 h-9 border-destructive/20 text-destructive hover:bg-destructive/10 font-bold px-6 rounded-xl" onClick={fetchRevenue}>
                Try Again
              </Button>
            </div>
          ) : data ? (
            <>
              <RevenueAdminSummary data={data} />
              
              <div className="flex items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Report Date</span>
                </div>
                <span className="text-xs font-mono font-bold text-primary">
                    {new Date(data.generatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
              </div>

              <RevenueServiceList services={data.serviceRevenues} currency={data.currency} />
            </>
          ) : (
             <div className="py-24 text-center">
                <p className="text-sm text-muted-foreground italic font-medium">No revenue data available</p>
             </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
