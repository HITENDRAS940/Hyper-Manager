import { ImagePlus, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useRef } from "react";
import { AdminService } from "../../../api/managerApi";

interface ServiceGalleryProps {
  service: AdminService;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>, service: AdminService) => void;
  onDeleteImage: (serviceId: number, imageUrl: string) => void;
  uploading: boolean;
  deletingImages: Record<string, boolean>;
}

export function ServiceGallery({ 
  service, 
  onUploadImage, 
  onDeleteImage, 
  uploading, 
  deletingImages 
}: ServiceGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Service Gallery</h4>
        </div>
        {(!service.images || service.images.length < 4) && (
          <div className="relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => onUploadImage(e, service)} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              Upload
            </button>
          </div>
        )}
      </div>
      {service.images && service.images.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-none snap-x">
          {service.images.map((image: string, idx: number) => (
            <div key={idx} className="relative w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted/30 snap-start group/img">
              <img src={image} alt={`${service.name} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
              <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg shadow-lg" 
                  onClick={(e) => { e.stopPropagation(); onDeleteImage(service.id, image); }} 
                  disabled={deletingImages[image]}
                >
                  {deletingImages[image] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-2 pointer-events-none">
                <span className="text-[8px] font-bold text-white uppercase tracking-tighter">View Image</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-2 p-8 border border-dashed border-border rounded-xl bg-muted/5 flex flex-col items-center justify-center opacity-60">
          <ImagePlus className="w-6 h-6 text-muted-foreground/30 mb-2" />
          <p className="text-[10px] font-medium text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
