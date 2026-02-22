import { Building2, Mail, MapPin, Wallet } from "lucide-react";
import { AdminUser } from "../../../api/managerApi";

interface BusinessRegistryProps {
  admin: AdminUser;
}

export function BusinessRegistry({ admin }: BusinessRegistryProps) {
  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary" />
        Business Registry
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
              <p className="text-sm text-foreground font-semibold">{admin.email}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Operation City</p>
              <p className="text-sm text-foreground font-semibold">{admin.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">GST Number</p>
              <p className="text-sm text-primary font-mono font-bold tracking-tight">{admin.gstNumber}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Business Address</p>
            <p className="text-sm text-foreground font-medium leading-relaxed">{admin.businessAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
