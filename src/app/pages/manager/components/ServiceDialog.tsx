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
      <DialogContent className="sm:max-w-[500px] bg-background border-4 border-border rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
        <DialogHeader className="border-b-2 border-border pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center justify-between pr-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-primary/10 border-2 border-primary flex items-center justify-center">
                {isAddMode ? <ImagePlus className="w-5 h-5 text-primary" /> : <Edit2 className="w-5 h-5 text-primary" />}
              </div>
              {isAddMode ? "Add New Service" : "Edit Service Details"}
            </div>
            {!isAddMode && (
              <div className={`flex items-center gap-2 px-3 py-1 border-2 ${editFormData.availability ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' : 'bg-muted text-muted-foreground border-border'}`}>
                <div className={`w-2 h-2 rounded-none border-[1.5px] ${editFormData.availability ? 'bg-emerald-500 border-emerald-700 animate-pulse' : 'bg-muted-foreground border-border'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{editFormData.availability ? 'Active' : 'Offline'}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6 max-h-[65vh] overflow-y-auto px-1">
          <div className="flex items-center justify-between p-4 bg-muted/30 border-2 border-border rounded-none">
            <div className="space-y-1">
              <Label className="text-sm font-black uppercase tracking-widest text-foreground">Service Visibility</Label>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Control if this service is bookable online</p>
            </div>
            <Switch 
              checked={editFormData.availability} 
              onCheckedChange={(checked) => setEditFormData({ ...editFormData, availability: checked })}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Name</Label>
            <Input id="name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Address</Label>
            <Input id="location" value={editFormData.location} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lat" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Latitude</Label>
              <Input id="lat" type="number" value={editFormData.latitude} onChange={(e) => setEditFormData({ ...editFormData, latitude: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lng" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Longitude</Label>
              <Input id="lng" type="number" value={editFormData.longitude} onChange={(e) => setEditFormData({ ...editFormData, longitude: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
            <Textarea id="description" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="bg-muted/50 border-2 border-border rounded-none min-h-[100px] font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors resize-none" />
          </div>

          <div className="grid gap-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activities</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 border-2 border-border rounded-none max-h-[200px] overflow-y-auto">
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
                    className="border-2 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-none w-5 h-5 flex items-center justify-center transition-colors"
                  />
                  <Label 
                    htmlFor={`activity-${activity.code}`} 
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                  >
                    {activity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amenities" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amenities (comma-separated)</Label>
            <Input 
              id="amenities" 
              value={editFormData.amenities.join(", ")} 
              onChange={(e) => {
                const val = e.target.value;
                const arr = val.split(",").map(s => s.trim()).filter(s => s !== "");
                setEditFormData({ ...editFormData, amenities: arr });
              }} 
              placeholder="WiFi, Parking, AC..."
              className="bg-muted/50 border-2 border-border rounded-none h-12 font-bold focus-visible:border-primary focus-visible:ring-0 transition-colors" 
            />
          </div>
        </div>
        <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6 border-t-2 border-border mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none font-black uppercase tracking-widest border-2 h-12 px-8 hover:bg-muted transition-colors">Cancel</Button>
          <Button onClick={onSave} disabled={updating} className="rounded-none px-8 h-12 gap-2 bg-primary hover:bg-primary-foreground hover:text-primary border-2 border-primary text-primary-foreground font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isAddMode ? "Create Service" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
