import { useState, useEffect } from "react";
import { 
  Activity, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw
} from "lucide-react";
import { managerApi, ServiceActivity, CreateActivityRequest, UpdateActivityRequest } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

export function Activities() {
  const [activities, setActivities] = useState<ServiceActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [selectedActivity, setSelectedActivity] = useState<ServiceActivity | null>(null);
  const [formData, setFormData] = useState<CreateActivityRequest>({ code: "", name: "" });

  const fetchActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getActivities();
      setActivities(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch activities");
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await managerApi.createActivity(formData);
      toast.success("Activity created successfully");
      setIsAddDialogOpen(false);
      setFormData({ code: "", name: "" });
      fetchActivities();
    } catch (err: any) {
      toast.error(err.message || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !formData.code || !formData.name) return;
    
    setIsSubmitting(true);
    try {
      await managerApi.updateActivity(selectedActivity.id, formData);
      toast.success("Activity updated successfully");
      setIsEditDialogOpen(false);
      setSelectedActivity(null);
      fetchActivities();
    } catch (err: any) {
      toast.error(err.message || "Failed to update activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedActivity) return;
    
    setIsSubmitting(true);
    try {
      await managerApi.deleteActivity(selectedActivity.id);
      toast.success("Activity deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
      fetchActivities();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (activity: ServiceActivity) => {
    const originalStatus = activity.enabled;
    try {
      // Optimistic Update
      setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, enabled: !originalStatus } : a));
      
      if (originalStatus) {
        await managerApi.disableActivity(activity.id);
        toast.success(`Activity "${activity.name}" disabled`);
      } else {
        await managerApi.enableActivity(activity.id);
        toast.success(`Activity "${activity.name}" enabled`);
      }
    } catch (err: any) {
      // Revert on error
      setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, enabled: originalStatus } : a));
      toast.error(err.message || "Failed to update status");
    }
  };

  const openEditDialog = (activity: ServiceActivity) => {
    setSelectedActivity(activity);
    setFormData({ code: activity.code, name: activity.name });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (activity: ServiceActivity) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const filteredActivities = activities.filter(activity => 
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground flex flex-wrap items-center gap-4">
            Activities
            <Badge variant="default" className="text-[10px]">
              {activities.length} Units
            </Badge>
          </h2>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 opacity-40 text-primary" />
            Manage service activity categories, codes, and operational status
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full lg:w-[320px]"
            />
          </div>
          <Button 
            onClick={() => {
              setFormData({ code: "", name: "" });
              setIsAddDialogOpen(true);
            }}
            className="gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.05)]"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Main Grid Section */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Accessing Knowledge Base...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/5 border border-destructive/10 rounded-[2.5rem] max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-lg font-bold text-foreground mb-4">{error}</p>
          <Button onClick={fetchActivities} variant="outline" className="rounded-xl px-8">Retry Fetch</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredActivities.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] bg-muted/5 font-bold uppercase tracking-widest text-muted-foreground/40">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p>No activities discovered</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="group bg-background border-2 border-border hover:border-foreground rounded-none p-0 transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row shadow-[4px_4px_0_0_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-1 dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.02)] dark:hover:shadow-[8px_8px_0_0_rgba(255,255,255,0.05)]">
                <div className={`w-full lg:w-2 h-2 lg:h-auto transition-colors ${activity.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 p-6 flex-1">
                  {/* Primary Info */}
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`w-12 h-12 shrink-0 flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors ${activity.enabled ? 'bg-primary/5' : 'bg-muted/10 opacity-50'}`}>
                      <Activity className={`w-6 h-6 ${activity.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-xl font-black text-foreground truncate group-hover:text-primary transition-colors">{activity.name}</h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase border-2 py-0">
                          {activity.code}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {activity.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-border/50 pt-4 lg:pt-0">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Status</p>
                        <p className={`text-[10px] font-black uppercase ${activity.enabled ? 'text-emerald-500' : 'text-destructive'}`}>
                          {activity.enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <Switch 
                        checked={activity.enabled}
                        onCheckedChange={() => handleToggleStatus(activity)}
                      />
                    </div>

                    <div className="h-8 w-[2px] bg-border/50 hidden lg:block" />

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(activity)}
                        className="hover:bg-primary/10 hover:text-primary rounded-none transition-all"
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(activity)}
                        className="hover:bg-destructive/10 hover:text-destructive rounded-none transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Activity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-4 border-foreground rounded-none shadow-[10px_10px_0_0_rgba(0,0,0,1)] dark:shadow-[10px_10px_0_0_rgba(255,255,255,0.1)] p-0 overflow-hidden">
          <form onSubmit={handleCreate}>
            <DialogHeader className="p-8 border-b-4 border-foreground bg-primary/5">
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Register Activity</DialogTitle>
              <DialogDescription className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Add a new operational category to the system</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Internal Code</Label>
                <Input 
                  placeholder="e.g., TURF_CRICKET, GYM_ELITE" 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="rounded-none border-2 border-foreground h-12 font-mono text-sm font-bold placeholder:italic"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Activity Name</Label>
                <Input 
                  placeholder="e.g., Cricket Turf, Fitness Center" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-none border-2 border-foreground h-12 font-bold placeholder:italic"
                  required
                />
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 border-t-2 border-border gap-4 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-none border-2 border-foreground h-12 font-black uppercase tracking-widest flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-none border-2 border-foreground h-12 font-black uppercase tracking-widest flex-1">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-4 border-foreground rounded-none shadow-[10px_10px_0_0_rgba(0,0,0,1)] p-0 overflow-hidden">
          <form onSubmit={handleUpdate}>
            <DialogHeader className="p-8 border-b-4 border-foreground bg-primary/5">
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter">Refactor Activity</DialogTitle>
              <DialogDescription className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Modifying parameters for ID: {selectedActivity?.id}</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Internal Code</Label>
                <Input 
                  placeholder="CODE" 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="rounded-none border-2 border-foreground h-12 font-mono text-sm font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Activity Name</Label>
                <Input 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-none border-2 border-foreground h-12 font-bold"
                  required
                />
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 border-t-2 border-border gap-4 flex-col sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-none border-2 border-foreground h-12 font-black uppercase tracking-widest flex-1">
                Discard
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-none border-2 border-foreground h-12 font-black uppercase tracking-widest flex-1">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Schema'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px] border-4 border-destructive rounded-none shadow-[10px_10px_0_0_rgba(220,38,38,0.2)] p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b-4 border-destructive bg-destructive/5">
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-destructive">Terminate Activity</DialogTitle>
            <DialogDescription className="text-sm font-bold text-destructive/80 uppercase tracking-widest">Irreversible action for "{selectedActivity?.name}"</DialogDescription>
          </DialogHeader>
          <div className="p-8">
            <p className="text-sm font-bold border-2 border-destructive/20 p-4 bg-destructive/5 text-foreground">
              Warning: Deleting this activity may impact resources attached to it. Systems relying on this Activity ID will experience cache fragmentation.
            </p>
          </div>
          <DialogFooter className="p-8 bg-muted/30 border-t-2 border-border gap-4 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-none border-2 border-foreground h-12 font-black uppercase tracking-widest flex-1">
              Abort
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="rounded-none border-2 border-destructive h-12 font-black uppercase tracking-widest flex-1">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Deletion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
