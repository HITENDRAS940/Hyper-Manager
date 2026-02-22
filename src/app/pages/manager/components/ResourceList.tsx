import { Settings2, Layout, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ServiceResource, AdminService } from "../../../api/managerApi";

interface ResourceListProps {
  service: AdminService;
  resources: ServiceResource[] | undefined;
  loading: boolean;
  error: string;
  onAddResource: (e: React.MouseEvent, service: AdminService) => void;
  onResourceClick: (resourceId: number) => void;
}

export function ResourceList({
  service,
  resources,
  loading,
  error,
  onAddResource,
  onResourceClick
}: ResourceListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 gap-2">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <p className="text-xs font-medium text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center gap-2 text-destructive text-xs">
        <AlertCircle className="w-3.5 h-3.5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 pb-1">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available Resources</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 rounded-lg gap-1.5 text-[9px] font-bold border-primary/20 text-primary hover:bg-primary/5"
          onClick={(e) => onAddResource(e, service)}
        >
          <Layout className="w-3 h-3" />
          Add Resource
        </Button>
      </div>
      
      {!resources || resources.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground italic">No resources available for this service</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              onClick={() => onResourceClick(resource.id)}
              className="bg-background/60 rounded-xl p-3 border border-border/50 group/res transition-all hover:bg-background/80 hover:border-primary/20 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Layout className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{resource.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{resource.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase shrink-0 ${resource.enabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-muted border-border text-muted-foreground'}`}>
                  {resource.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {resource.activities.map((activity) => (
                  <span key={activity.id} className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${activity.enabled ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground opacity-50'}`}>
                    {activity.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
