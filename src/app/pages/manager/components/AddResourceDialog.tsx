import { Layout, Clock, Save, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { Checkbox } from "../../../components/ui/checkbox";
import { PREDEFINED_ACTIVITIES } from "./constants";
import { AddResourceRequest, AdminService } from "../../../api/managerApi";

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: AdminService | null;
  resourceFormData: AddResourceRequest;
  setResourceFormData: (data: any) => void;
  onToggleActivity: (code: string) => void;
  onSave: () => void;
  updating: boolean;
}

export function AddResourceDialog({
  open,
  onOpenChange,
  selectedService,
  resourceFormData,
  setResourceFormData,
  onToggleActivity,
  onSave,
  updating
}: AddResourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-4 border-border rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
        <DialogHeader className="border-b-2 border-border pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-primary/10 border-2 border-primary flex items-center justify-center">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            Add Resource to {selectedService?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6 max-h-[65vh] overflow-y-auto px-1">
          <div className="grid gap-2">
            <Label htmlFor="res-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resource Name</Label>
            <Input id="res-name" value={resourceFormData.name} onChange={(e) => setResourceFormData({ ...resourceFormData, name: e.target.value })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="res-desc" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
            <Textarea id="res-desc" value={resourceFormData.description} onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })} className="bg-muted/50 border-2 border-border rounded-none min-h-[100px] font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="res-opening" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Opening Time</Label>
              <Input id="res-opening" type="time" value={resourceFormData.openingTime} onChange={(e) => setResourceFormData({ ...resourceFormData, openingTime: e.target.value + (e.target.value.length === 5 ? ":00" : "") })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="res-closing" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Closing Time</Label>
              <Input id="res-closing" type="time" value={resourceFormData.closingTime} onChange={(e) => setResourceFormData({ ...resourceFormData, closingTime: e.target.value + (e.target.value.length === 5 ? ":00" : "") })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="res-duration" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Slot Duration (Min)</Label>
              <Input id="res-duration" type="number" value={resourceFormData.slotDurationMinutes} onChange={(e) => setResourceFormData({ ...resourceFormData, slotDurationMinutes: parseInt(e.target.value) || 0 })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-black text-xl tracking-tighter focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="res-price" className="text-[10px] font-black text-primary uppercase tracking-widest">Base Price (₹)</Label>
              <Input id="res-price" type="number" value={resourceFormData.basePrice} onChange={(e) => setResourceFormData({ ...resourceFormData, basePrice: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-2 border-primary rounded-none h-12 font-black text-xl text-primary tracking-tighter focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Activities</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 border-2 border-border rounded-none max-h-[200px] overflow-y-auto">
              {PREDEFINED_ACTIVITIES.map((activity) => (
                <div key={activity.code} className="flex items-center gap-2 group">
                  <Checkbox 
                    id={`res-activity-${activity.code}`} 
                    checked={resourceFormData.activityCodes.includes(activity.code)}
                    onCheckedChange={() => onToggleActivity(activity.code)}
                    className="border-2 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-none w-5 h-5 flex items-center justify-center transition-colors"
                  />
                  <Label 
                    htmlFor={`res-activity-${activity.code}`} 
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                  >
                    {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 border-2 border-border rounded-none">
            <div className="space-y-1">
              <Label className="text-sm font-black uppercase tracking-widest text-foreground">Resource Status</Label>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Enable or disable this resource</p>
            </div>
            <Switch 
              checked={resourceFormData.enabled} 
              onCheckedChange={(checked) => setResourceFormData({ ...resourceFormData, enabled: checked })}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
        <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6 border-t-2 border-border mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none font-black uppercase tracking-widest border-2 h-12 px-8 hover:bg-muted transition-colors">Cancel</Button>
          <Button onClick={onSave} disabled={updating} className="rounded-none px-8 h-12 gap-2 bg-primary hover:bg-primary-foreground hover:text-primary border-2 border-primary text-primary-foreground font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Create Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
