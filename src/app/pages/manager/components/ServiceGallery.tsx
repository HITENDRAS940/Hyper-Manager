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
          <ImagePlus className="w-4 h-4 text-primary" />
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Gallery</h4>
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
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground rounded-none transition-all disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Upload
            </button>
          </div>
        )}
      </div>
      {service.images && service.images.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-none snap-x mt-2">
          {service.images.map((image: string, idx: number) => (
            <div key={idx} className="relative w-48 h-32 rounded-none overflow-hidden shrink-0 border-2 border-border bg-muted/50 snap-start group/img hover:border-foreground transition-colors">
              <img src={image} alt={`${service.name} ${idx + 1}`} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500" />
              <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-none border-2 border-destructive text-destructive bg-background hover:bg-destructive hover:text-destructive-foreground shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] transition-all" 
                  onClick={(e) => { e.stopPropagation(); onDeleteImage(service.id, image); }} 
                  disabled={deletingImages[image]}
                >
                  {deletingImages[image] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Image {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-2 mt-2 p-12 border-2 border-dashed border-border rounded-none bg-muted/10 flex flex-col items-center justify-center">
          <ImagePlus className="w-8 h-8 text-muted-foreground/50 mb-3" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No images uploaded</p>
        </div>
      )}
    </div>
  );
}
