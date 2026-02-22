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
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 pb-2 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available Resources</h4>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-none gap-2 text-[10px] font-black uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={(e) => onAddResource(e, service)}
        >
          <Layout className="w-3.5 h-3.5" />
          Add Resource
        </Button>
      </div>
      
      {!resources || resources.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground italic">No resources available for this service</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              onClick={() => onResourceClick(resource.id)}
              className="bg-background rounded-none p-4 border-2 border-border group/res transition-all hover:border-foreground cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-none border-[1.5px] border-border group-hover:border-primary bg-muted/50 flex items-center justify-center shrink-0 transition-colors">
                    <Layout className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black uppercase tracking-tight text-foreground truncate">{resource.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 line-clamp-2">{resource.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-none border-2 text-[10px] font-black uppercase tracking-widest shrink-0 ${resource.enabled ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-destructive/10 border-destructive text-destructive'}`}>
                  {resource.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {resource.activities.map((activity) => (
                  <span key={activity.id} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-none border-2 ${activity.enabled ? 'bg-primary/5 border-primary text-primary' : 'bg-muted border-border text-muted-foreground opacity-70'}`}>
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
