import { ImagePlus, Edit2, Save, Loader2, Globe } from "lucide-react";
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
import { AddServiceRequest } from "../../../api/managerApi";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAddMode: boolean;
  editFormData: AddServiceRequest & { id: number, availability: boolean };
  setEditFormData: (data: any) => void;
  onSave: () => void;
  updating: boolean;
}

export function ServiceDialog({ 
  open, 
  onOpenChange, 
  isAddMode, 
  editFormData, 
  setEditFormData, 
  onSave, 
  updating 
}: ServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {isAddMode ? <ImagePlus className="w-4 h-4 text-primary" /> : <Edit2 className="w-4 h-4 text-primary" />}
              </div>
              {isAddMode ? "Add New Service" : "Edit Service Details"}
            </div>
            {!isAddMode && (
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${editFormData.availability ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${editFormData.availability ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                <span className="text-[9px] font-bold uppercase tracking-tight">{editFormData.availability ? 'Active' : 'Offline'}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-6 max-h-[65vh] overflow-y-auto px-1">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Service Visibility</Label>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Control if this service is bookable online</p>
            </div>
            <Switch 
              checked={editFormData.availability} 
              onCheckedChange={(checked) => setEditFormData({ ...editFormData, availability: checked })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service Name</Label>
            <Input id="name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="bg-muted/50 border-border focus:ring-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Address</Label>
            <Input id="location" value={editFormData.location} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="bg-muted/50 border-border" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Address</Label>
            <Input id="location" value={editFormData.location} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="bg-muted/50 border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="lat" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3 h-3" /> Latitude</Label>
              <Input id="lat" type="number" value={editFormData.latitude} onChange={(e) => setEditFormData({ ...editFormData, latitude: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-border" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lng" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3 h-3" /> Longitude</Label>
              <Input id="lng" type="number" value={editFormData.longitude} onChange={(e) => setEditFormData({ ...editFormData, longitude: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-border" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
            <Textarea id="description" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="bg-muted/50 border-border min-h-[100px]" />
          </div>

          <div className="grid gap-3">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activities</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 border border-border/50 rounded-2xl max-h-[200px] overflow-y-auto">
              {PREDEFINED_ACTIVITIES.map((activity) => (
                <div key={activity.code} className="flex items-center gap-2 group">
                  <Checkbox 
                    id={`activity-${activity.code}`} 
                    checked={editFormData.activityCodes.includes(activity.code)}
                    onCheckedChange={(checked) => {
                      const newCodes = checked 
                        ? [...editFormData.activityCodes, activity.code]
                        : editFormData.activityCodes.filter(c => c !== activity.code);
                      setEditFormData({ ...editFormData, activityCodes: newCodes });
                    }}
                    className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label 
                    htmlFor={`activity-${activity.code}`} 
                    className="text-xs font-medium text-foreground/70 group-hover:text-foreground cursor-pointer transition-colors"
                  >
                    {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amenities" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Amenities (comma-separated)</Label>
            <Input 
              id="amenities" 
              value={editFormData.amenities.join(", ")} 
              onChange={(e) => {
                const val = e.target.value;
                const arr = val.split(",").map(s => s.trim()).filter(s => s !== "");
                setEditFormData({ ...editFormData, amenities: arr });
              }} 
              placeholder="WiFi, Parking, AC..."
              className="bg-muted/50 border-border" 
            />
          </div>
        </div>
        <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
          <Button onClick={onSave} disabled={updating} className="rounded-xl px-8 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isAddMode ? "Create Service" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
