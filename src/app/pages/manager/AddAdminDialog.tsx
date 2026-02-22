import { useState } from "react";
import { managerApi, CreateAdminRequest } from "../../api/managerApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Building2, 
  MapPin, 
  Search,
  User,
  Mail,
  FileText,
  Loader2,
  Plus,
  X,
  Phone
} from "lucide-react";

interface AddAdminDialogProps {
  onSuccess: () => void;
}

export function AddAdminDialog({ onSuccess }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateAdminRequest>({
    name: "",
    email: "",
    phone: "",
    city: "",
    businessName: "",
    businessAddress: "",
    gstNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (!formData.name || !formData.email || !formData.businessName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await managerApi.createAdmin(formData);
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        businessName: "",
        businessAddress: "",
        gstNumber: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-5"
      >
        <Plus className="w-4 h-4 mr-2" /> Add New Admin
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-background border-border p-0 overflow-hidden gap-0">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="p-6 bg-muted/30 border-b border-border">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                Create New Admin
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Enter the details below to register a new administrator to the portal.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Personal Details
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-10" value={formData.name} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="john@example.com" className="pl-10" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+91 9876543210" className="pl-10" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Business Details
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="businessName" placeholder="Elite Sports Arena" className="pl-10" value={formData.businessName} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber" className="text-sm font-medium">GST Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="gstNumber" placeholder="22AAAAA0000A1Z5" className="pl-10 font-mono" value={formData.gstNumber} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="city" placeholder="Mumbai" className="pl-10" value={formData.city} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Full Width Address */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="businessAddress" className="text-sm font-medium">Business Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="businessAddress" placeholder="123 Sport Street, Near City Park" className="pl-10" value={formData.businessAddress} onChange={handleChange} />
                </div>
              </div>

              {error && (
                <div className="md:col-span-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-destructive" />
                  {error}
                </div>
              )}
            </div>

            <DialogFooter className="p-6 bg-muted/30 border-t border-border gap-3 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
