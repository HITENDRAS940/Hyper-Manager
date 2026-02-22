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
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layout className="w-4 h-4 text-primary" />
            </div>
            Add Resource to {selectedService?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-6 max-h-[65vh] overflow-y-auto px-1">
          <div className="grid gap-2">
            <Label htmlFor="res-name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resource Name</Label>
            <Input id="res-name" value={resourceFormData.name} onChange={(e) => setResourceFormData({ ...resourceFormData, name: e.target.value })} className="bg-muted/50 border-border" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="res-desc" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
            <Textarea id="res-desc" value={resourceFormData.description} onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })} className="bg-muted/50 border-border min-h-[80px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="res-opening" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Opening Time</Label>
              <Input id="res-opening" type="time" value={resourceFormData.openingTime} onChange={(e) => setResourceFormData({ ...resourceFormData, openingTime: e.target.value + (e.target.value.length === 5 ? ":00" : "") })} className="bg-muted/50 border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="res-closing" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Closing Time</Label>
              <Input id="res-closing" type="time" value={resourceFormData.closingTime} onChange={(e) => setResourceFormData({ ...resourceFormData, closingTime: e.target.value + (e.target.value.length === 5 ? ":00" : "") })} className="bg-muted/50 border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="res-duration" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Slot Duration (Min)</Label>
              <Input id="res-duration" type="number" value={resourceFormData.slotDurationMinutes} onChange={(e) => setResourceFormData({ ...resourceFormData, slotDurationMinutes: parseInt(e.target.value) || 0 })} className="bg-muted/50 border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="res-price" className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-bold">Base Price (₹)</Label>
              <Input id="res-price" type="number" value={resourceFormData.basePrice} onChange={(e) => setResourceFormData({ ...resourceFormData, basePrice: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-border font-bold text-primary" />
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Activities</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/50 rounded-2xl max-h-[150px] overflow-y-auto">
              {PREDEFINED_ACTIVITIES.map((activity) => (
                <div key={activity.code} className="flex items-center gap-2 group">
                  <Checkbox 
                    id={`res-activity-${activity.code}`} 
                    checked={resourceFormData.activityCodes.includes(activity.code)}
                    onCheckedChange={() => onToggleActivity(activity.code)}
                    className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label 
                    htmlFor={`res-activity-${activity.code}`} 
                    className="text-xs font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors"
                  >
                    {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Resource Status</Label>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enable or disable this resource</p>
            </div>
            <Switch 
              checked={resourceFormData.enabled} 
              onCheckedChange={(checked) => setResourceFormData({ ...resourceFormData, enabled: checked })}
            />
          </div>
        </div>
        <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
          <Button onClick={onSave} disabled={updating} className="rounded-xl px-8 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Create Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
