import { useState, useEffect } from "react";
import { 
  X, 
  Package, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { 
  AdminUser, 
  managerApi, 
  AdminService,
  ServiceResource,
  AddServiceRequest,
  AddResourceRequest
} from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
} from "../../components/ui/sheet";

// Modular Components
import { AdminSummaryCards } from "./components/AdminSummaryCards";
import { RevenuePerformance } from "./components/RevenuePerformance";
import { BusinessRegistry } from "./components/BusinessRegistry";
import { ServiceDialog } from "./components/ServiceDialog";
import { AddResourceDialog } from "./components/AddResourceDialog";
import { ServiceCard } from "./components/ServiceCard";
import { RevenueBreakdownSheet } from "./components/revenue/RevenueBreakdownSheet";
import { TrendingUp } from "lucide-react";

interface AdminDetailViewProps {
  admin: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onResourceClick: (resourceId: number) => void;
}

export function AdminDetailView({ admin, open, onClose, onResourceClick }: AdminDetailViewProps) {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isRevenueSheetOpen, setIsRevenueSheetOpen] = useState(false);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);
  const [resources, setResources] = useState<Record<number, ServiceResource[]>>({});
  const [loadingResources, setLoadingResources] = useState<Record<number, boolean>>({});
  const [errorResources, setErrorResources] = useState<Record<number, string>>({});

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<AddServiceRequest & { id: number, availability: boolean }>({
    id: 0,
    name: "",
    location: "",
    city: "",
    latitude: 0,
    longitude: 0,
    description: "",
    contactNumber: "",
    activityCodes: [],
    amenities: [],
    availability: true
  });

  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [deletingImages, setDeletingImages] = useState<Record<string, boolean>>({});

  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [selectedServiceForResource, setSelectedServiceForResource] = useState<AdminService | null>(null);
  const [resourceFormData, setResourceFormData] = useState<AddResourceRequest>({
    serviceId: 0,
    name: "",
    description: "",
    enabled: true,
    openingTime: "06:00:00",
    closingTime: "22:00:00",
    slotDurationMinutes: 60,
    basePrice: 0,
    activityCodes: []
  });

  const fetchServices = async (pageToFetch: number = page) => {
    if (!admin) return;
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getAdminServices(admin.id, pageToFetch, pageSize);
      setServices(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (serviceId: number) => {
    if (resources[serviceId]) return;
    setLoadingResources(prev => ({ ...prev, [serviceId]: true }));
    setErrorResources(prev => ({ ...prev, [serviceId]: "" }));
    try {
      const data = await managerApi.getServiceResources(serviceId);
      setResources(prev => ({ ...prev, [serviceId]: data }));
    } catch (err: any) {
      setErrorResources(prev => ({ ...prev, [serviceId]: err.message || "Failed to fetch resources" }));
    } finally {
      setLoadingResources(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const toggleServiceExpand = (serviceId: number) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(serviceId);
      fetchResources(serviceId);
    }
  };

  const handleAddServiceClick = () => {
    setIsAddMode(true);
    setEditFormData({
      id: 0,
      name: "",
      location: "",
      city: admin?.city || "",
      latitude: 0,
      longitude: 0,
      description: "",
      contactNumber: admin?.email || "",
      activityCodes: [],
      amenities: [],
      availability: true
    });
    setIsEditDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, service: AdminService) => {
    e.stopPropagation();
    setIsAddMode(false);
    setEditFormData({
      id: service.id,
      name: service.name,
      location: service.location,
      city: service.city,
      latitude: service.latitude,
      longitude: service.longitude,
      description: service.description,
      contactNumber: service.contactNumber,
      activityCodes: (service.activities || []).map(act => typeof act === 'string' ? act : act.code),
      amenities: service.amenities || [],
      availability: service.availability
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!admin) return;
    setUpdating(true);
    try {
      if (isAddMode) {
        const { id, availability, ...data } = editFormData;
        await managerApi.createService(admin.id, data);
      } else {
        const { id, availability, activityCodes, amenities, ...data } = editFormData;
        await managerApi.updateService(id, { ...data, availability });
      }
      setIsEditDialogOpen(false);
      fetchServices();
    } catch (err: any) {
      alert(err.message || "Failed to save service");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddResourceClick = (e: React.MouseEvent, service: AdminService) => {
    e.stopPropagation();
    setSelectedServiceForResource(service);
    setResourceFormData({
      serviceId: service.id,
      name: "",
      description: "",
      enabled: true,
      openingTime: "06:00:00",
      closingTime: "22:00:00",
      slotDurationMinutes: 60,
      basePrice: 0,
      activityCodes: []
    });
    setIsAddResourceDialogOpen(true);
  };

  const toggleResourceActivity = (code: string) => {
    setResourceFormData(prev => ({
      ...prev,
      activityCodes: prev.activityCodes.includes(code)
        ? prev.activityCodes.filter(c => c !== code)
        : [...prev.activityCodes, code]
    }));
  };

  const handleSaveResource = async () => {
    if (!selectedServiceForResource) return;
    setUpdating(true);
    try {
      await managerApi.createResource(selectedServiceForResource.id, resourceFormData);
      setIsAddResourceDialogOpen(false);
      fetchResources(selectedServiceForResource.id);
    } catch (err: any) {
      alert(err.message || "Failed to add resource");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, service: AdminService) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const existingCount = service.images?.length || 0;
    const newCount = files.length;
    if (existingCount + newCount > 4) {
      alert(`Maximum 4 images allowed per service. You already have ${existingCount} images.`);
      return;
    }
    setUploadingImages(prev => ({ ...prev, [service.id]: true }));
    try {
      await managerApi.uploadServiceImages(service.id, files);
      fetchServices();
    } catch (err: any) {
      alert(err.message || "Failed to upload images");
    } finally {
      setUploadingImages(prev => ({ ...prev, [service.id]: false }));
    }
  };

  const handleDeleteImage = async (serviceId: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setDeletingImages(prev => ({ ...prev, [imageUrl]: true }));
    try {
      await managerApi.deleteServiceImages(serviceId, [imageUrl]);
      fetchServices();
    } catch (err: any) {
      alert(err.message || "Failed to delete image");
    } finally {
      setDeletingImages(prev => ({ ...prev, [imageUrl]: false }));
    }
  };

  useEffect(() => {
    if (open && admin) {
      setPage(0);
      fetchServices(0);
      setExpandedServiceId(null);
      setResources({});
    }
  }, [open, admin]);

  useEffect(() => {
    if (open && admin) {
      fetchServices();
    }
  }, [page]);

  if (!admin) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl bg-background border-l border-border overflow-y-auto p-0 gap-0">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-foreground leading-tight">{admin.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">ADMIN ID: {admin.userId}</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-8">
            <AdminSummaryCards totalServices={services.length} />
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-primary" />
                     Revenue Analytics
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsRevenueSheetOpen(true)}
                    className="h-8 rounded-lg gap-1.5 text-[11px] font-bold border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
                  >
                     <TrendingUp className="w-3.5 h-3.5" />
                     Detailed Breakdown
                  </Button>
               </div>
               <RevenuePerformance />
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                     <Package className="w-4 h-4 text-primary" />
                     Linked Services
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddServiceClick} className="h-8 rounded-lg gap-1.5 text-[11px] font-bold border-primary/20 text-primary hover:bg-primary/5">
                     <Package className="w-3.5 h-3.5" />
                     Add Service
                  </Button>
               </div>
               
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
                     <Loader2 className="w-8 h-8 text-primary animate-spin" />
                     <p className="text-sm font-medium text-muted-foreground">Fetching services...</p>
                  </div>
               ) : error ? (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p className="text-sm font-medium">{error}</p>
                     <Button variant="ghost" size="sm" className="ml-auto h-8 text-destructive hover:bg-destructive/10" onClick={() => fetchServices()}>Retry</Button>
                  </div>
               ) : services.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-2xl bg-muted/5">
                     <Package className="w-8 h-8 text-muted-foreground/30 mb-2" />
                     <p className="text-sm font-medium text-muted-foreground">No services found</p>
                  </div>
               ) : (
                  <>
                     <div className="grid gap-3">
                       {services.map((service) => (
                         <ServiceCard 
                           key={service.id}
                           service={service}
                           isExpanded={expandedServiceId === service.id}
                           onToggle={toggleServiceExpand}
                           onEdit={handleEditClick}
                           onAddResource={handleAddResourceClick}
                           onResourceClick={(resourceId) => {
                             onResourceClick(resourceId);
                             onClose();
                           }}
                           onUploadImage={handleImageUpload}
                           onDeleteImage={handleDeleteImage}
                           resources={resources[service.id]}
                           loadingResources={loadingResources[service.id]}
                           errorResources={errorResources[service.id]}
                           uploading={uploadingImages[service.id]}
                           deletingImages={deletingImages}
                         />
                       ))}
                     </div>
                     {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 px-2">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Page <span className="text-foreground">{page + 1}</span> of <span className="text-foreground">{totalPages}</span>
                           </p>
                           <div className="flex items-center gap-2">
                              <Button 
                                 variant="outline" 
                                 size="icon" 
                                 className="h-8 w-8 rounded-lg border-border/50 bg-background/50 hover:bg-muted"
                                 onClick={() => setPage(p => Math.max(0, p - 1))}
                                 disabled={page === 0 || loading}
                              >
                                 <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button 
                                 variant="outline" 
                                 size="icon" 
                                 className="h-8 w-8 rounded-lg border-border/50 bg-background/50 hover:bg-muted"
                                 onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                 disabled={page >= totalPages - 1 || loading}
                              >
                                 <ChevronRight className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>

            <BusinessRegistry admin={admin} />
          </div>
        </SheetContent>
      </Sheet>

      <ServiceDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        isAddMode={isAddMode}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSave={handleSaveService}
        updating={updating}
      />

      <AddResourceDialog 
        open={isAddResourceDialogOpen}
        onOpenChange={setIsAddResourceDialogOpen}
        selectedService={selectedServiceForResource}
        resourceFormData={resourceFormData}
        setResourceFormData={setResourceFormData}
        onToggleActivity={toggleResourceActivity}
        onSave={handleSaveResource}
        updating={updating}
      />

      <RevenueBreakdownSheet 
        admin={admin}
        open={isRevenueSheetOpen}
        onClose={() => setIsRevenueSheetOpen(false)}
      />
    </>
  );
}
