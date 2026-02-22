import { 
  Package, 
  MapPin, 
  Edit2, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AdminService, ServiceResource } from "../../../api/managerApi";
import { ServiceGallery } from "./ServiceGallery";
import { ResourceList } from "./ResourceList";

interface ServiceCardProps {
  service: AdminService;
  isExpanded: boolean;
  onToggle: (serviceId: number) => void;
  onEdit: (e: React.MouseEvent, service: AdminService) => void;
  onAddResource: (e: React.MouseEvent, service: AdminService) => void;
  onResourceClick: (resourceId: number) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>, service: AdminService) => void;
  onDeleteImage: (serviceId: number, imageUrl: string) => void;
  resources: ServiceResource[] | undefined;
  loadingResources: boolean;
  errorResources: string;
  uploading: boolean;
  deletingImages: Record<string, boolean>;
}

export function ServiceCard({
  service,
  isExpanded,
  onToggle,
  onEdit,
  onAddResource,
  onResourceClick,
  onUploadImage,
  onDeleteImage,
  resources,
  loadingResources,
  errorResources,
  uploading,
  deletingImages
}: ServiceCardProps) {
  return (
    <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card/50 transition-all duration-300">
      <div 
        className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-card transition-colors ${isExpanded ? 'bg-card' : ''}`} 
        onClick={() => onToggle(service.id)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/50">
            {service.images?.[0] ? (
              <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <Package className="w-5 h-5 text-primary/30" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{service.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground font-medium truncate">{service.city}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 hidden sm:flex" 
            onClick={(e) => onEdit(e, service)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <div className="text-right hidden sm:block ml-2">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${service.availability ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${service.availability ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{service.availability ? 'Active' : 'Offline'}</span>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-border bg-muted/20 animate-in slide-in-from-top-2 duration-300">
          <div className="p-3 space-y-6">
            <ServiceGallery 
              service={service}
              onUploadImage={onUploadImage}
              onDeleteImage={onDeleteImage}
              uploading={uploading}
              deletingImages={deletingImages}
            />
            <ResourceList 
              service={service}
              resources={resources}
              loading={loadingResources}
              error={errorResources}
              onAddResource={onAddResource}
              onResourceClick={onResourceClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
