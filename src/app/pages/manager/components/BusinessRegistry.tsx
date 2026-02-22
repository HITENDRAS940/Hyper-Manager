import { Building2, Mail, MapPin, Wallet } from "lucide-react";
import { AdminUser } from "../../../api/managerApi";

interface BusinessRegistryProps {
  admin: AdminUser;
}

export function BusinessRegistry({ admin }: BusinessRegistryProps) {
  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary" />
        Business Registry
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border-2 border-border bg-background rounded-none hover:border-foreground transition-colors group">
            <div className="w-10 h-10 rounded-none bg-muted/50 border-2 border-border group-hover:bg-primary/5 flex items-center justify-center transition-colors">
              <Mail className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Email Address</p>
              <p className="text-sm text-foreground font-black tracking-tight">{admin.email}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border-2 border-border bg-background rounded-none hover:border-foreground transition-colors group">
            <div className="w-10 h-10 rounded-none bg-muted/50 border-2 border-border group-hover:bg-primary/5 flex items-center justify-center transition-colors">
              <MapPin className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Operation City</p>
              <p className="text-sm text-foreground font-black tracking-tight uppercase">{admin.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-2 border-border bg-background rounded-none hover:border-foreground transition-colors group">
            <div className="w-10 h-10 rounded-none bg-muted/50 border-2 border-border group-hover:bg-primary/5 flex items-center justify-center transition-colors">
              <Wallet className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">GST Number</p>
              <p className="text-sm text-primary font-black uppercase tracking-widest">{admin.gstNumber}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 rounded-none bg-background border-2 border-border hover:border-foreground transition-colors group">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-muted/50 border-2 border-border group-hover:bg-primary/5 flex items-center justify-center shrink-0 transition-colors">
            <Building2 className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Business Address</p>
            <p className="text-sm text-foreground font-bold leading-relaxed">{admin.businessAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
