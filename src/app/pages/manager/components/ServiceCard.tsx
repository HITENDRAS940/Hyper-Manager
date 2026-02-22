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
    <div className="flex flex-col border-2 border-border rounded-none overflow-hidden bg-background transition-all duration-300">
      <div 
        className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors ${isExpanded ? 'bg-muted/50' : ''}`} 
        onClick={() => onToggle(service.id)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-none overflow-hidden bg-muted/50 flex-shrink-0 border-2 border-border group-hover:border-foreground transition-colors">
            {service.images?.[0] ? (
              <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <Package className="w-6 h-6 text-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">{service.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate">{service.city}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-none border-2 text-muted-foreground hover:text-primary hover:border-primary hidden sm:flex transition-all" 
            onClick={(e) => onEdit(e, service)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <div className="text-right hidden sm:block ml-2">
            <div className={`flex items-center gap-2 px-3 py-1 border-2 ${service.availability ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' : 'bg-muted text-muted-foreground border-border'}`}>
              <div className={`w-2 h-2 rounded-none border-[1.5px] ${service.availability ? 'bg-emerald-500 border-emerald-700 animate-pulse' : 'bg-muted-foreground border-border'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{service.availability ? 'Active' : 'Offline'}</span>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-foreground ml-2" /> : <ChevronDown className="w-5 h-5 text-foreground ml-2" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t-2 border-border bg-background animate-in slide-in-from-top-2 duration-300">
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
