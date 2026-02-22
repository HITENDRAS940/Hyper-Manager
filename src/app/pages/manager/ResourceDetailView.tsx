import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  Layout, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  AlertCircle,
  Package,
  ArrowUpRight,
  TrendingUp,
  Search
} from "lucide-react";
import { managerApi, ResourceSlot, ResourceBooking, PriceRule, ResourceConfig, UpdateResourceConfigRequest, AddPriceRuleRequest, UpdatePriceRuleRequest } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tag, Settings, Zap, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minute = (i % 2 === 0 ? '00' : '30');
  return `${hour}:${minute}:00`;
});

const formatDisplayTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

interface ResourceDetailViewProps {
  resourceId: number;
  onBack: () => void;
}

export function ResourceDetailView({ resourceId, onBack }: ResourceDetailViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [slots, setSlots] = useState<ResourceSlot[]>([]);
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [resourceConfig, setResourceConfig] = useState<ResourceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePanel, setActivePanel] = useState<'bookings' | 'slots' | 'price-rules' | 'config'>('bookings');

  // Config Form State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<UpdateResourceConfigRequest>({
    resourceId: resourceId,
    openingTime: "06:00:00",
    closingTime: "23:00:00",
    slotDurationMinutes: 60,
    basePrice: 0
  });

  // Price Rule Form State
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [ruleForm, setRuleForm] = useState<AddPriceRuleRequest>({
    resourceId: resourceId,
    dayType: 'ALL',
    startTime: "00:00:00",
    endTime: "23:59:00",
    basePrice: 0,
    extraCharge: 0,
    reason: "",
    priority: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingsData, slotsData, priceRulesData, configData] = await Promise.all([
        managerApi.getResourceBookings(resourceId, selectedDate),
        managerApi.getResourceSlots(resourceId, selectedDate),
        managerApi.getPriceRules(resourceId),
        managerApi.getResourceConfig(resourceId)
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : (bookingsData?.content || []));
      setSlots(slotsData);
      setPriceRules(priceRulesData);
      setResourceConfig(configData);
    } catch (err: any) {
      setError(err.message || "Failed to load resource data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    setIsSubmitting(true);
    try {
      await managerApi.updateResourceConfig(configForm);
      toast.success("Configuration updated successfully");
      setIsConfigModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRule = async () => {
    setIsSubmitting(true);
    try {
      if (editingRule) {
        const updateData: UpdatePriceRuleRequest = {
          dayType: ruleForm.dayType as any,
          startTime: ruleForm.startTime,
          endTime: ruleForm.endTime,
          basePrice: ruleForm.basePrice === 0 ? undefined : ruleForm.basePrice,
          extraCharge: ruleForm.extraCharge,
          reason: ruleForm.reason,
          priority: ruleForm.priority,
          enabled: editingRule.enabled
        };
        await managerApi.updatePriceRule(editingRule.id, updateData);
        toast.success("Price rule updated successfully");
      } else {
        const createData = { ...ruleForm };
        if (createData.basePrice === 0) {
          delete createData.basePrice;
        }
        await managerApi.addPriceRule(createData);
        toast.success("Price rule added successfully");
      }
      setIsAddRuleModalOpen(false);
      setEditingRule(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save price rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRule = (rule: PriceRule) => {
    setEditingRule(rule);
    setRuleForm({
      resourceId: resourceId,
      dayType: rule.dayType as any,
      startTime: rule.startTime,
      endTime: rule.endTime,
      basePrice: rule.basePrice,
      extraCharge: rule.extraCharge,
      reason: rule.reason,
      priority: rule.priority
    });
    setIsAddRuleModalOpen(true);
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm("Are you sure you want to delete this price rule?")) return;
    
    setIsSubmitting(true);
    try {
      await managerApi.deletePriceRule(ruleId);
      toast.success("Price rule deleted successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete price rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resourceId, selectedDate]);

  useEffect(() => {
    if (resourceConfig) {
      setConfigForm({
        resourceId: resourceId,
        openingTime: resourceConfig.openingTime,
        closingTime: resourceConfig.closingTime,
        slotDurationMinutes: resourceConfig.slotDurationMinutes,
        basePrice: resourceConfig.basePrice
      });
    }
  }, [resourceConfig, resourceId]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Invalid Date";
      return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return "Invalid Date";
    }
  };
  const formatTimeStr = (timeStr: string | undefined) => {
    if (!timeStr) return "N/A";
    // Assuming format "HH:mm:ss" or "HH:mm"
    return timeStr.slice(0, 5);
  };

  console.log("ResourceDetailView Render:", { resourceId, selectedDate, bookingsLength: bookings?.length, slotsLength: slots?.length, loading });

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="w-fit h-9 px-3 rounded-xl gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 -ml-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Back to services</span>
          </Button>
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground flex items-center gap-4">
              Resource Operations
              <Badge variant="default" className="text-[10px] font-black uppercase tracking-widest border-2 py-1 px-3">
                Live Feed
              </Badge>
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mt-2">
              <Layout className="w-4 h-4 text-primary" />
              Monitoring and availability tracking for Resource ID: <span className="font-black text-foreground border-b-2 border-foreground leading-none pb-0.5">#{resourceId}</span>
            </p>
          </div>
        </div>

        {/* Date Controller */}
        <div className="flex items-center gap-3 bg-background border-2 border-border p-2 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]">
           <Button variant="outline" size="icon" onClick={handlePrevDay} className="h-10 w-10 min-w-[40px] rounded-none border-2 hover:bg-foreground hover:text-background transition-colors">
              <ChevronLeft className="w-4 h-4" />
           </Button>
           <div className="px-4 text-center min-w-[140px]">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Operations Date</p>
              <p className="text-sm font-black tracking-tight text-primary">
                 {formatDate(selectedDate)}
              </p>
           </div>
           <Button variant="outline" size="icon" onClick={handleNextDay} className="h-10 w-10 min-w-[40px] rounded-none border-2 hover:bg-foreground hover:text-background transition-colors">
              <ChevronRight className="w-4 h-4" />
           </Button>
        </div>
      </div>
      {/* Control Navigation */}
      <div className="flex items-center gap-2 bg-background p-1.5 rounded-none border-2 border-border w-fit">
         <button 
           onClick={() => setActivePanel('bookings')}
           className={`px-6 h-10 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activePanel === 'bookings' ? 'bg-primary text-primary-foreground border-primary shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]' : 'bg-background text-muted-foreground border-transparent hover:border-foreground hover:text-foreground'}`}
         >
           Confirmed Bookings
         </button>
         <button 
           onClick={() => setActivePanel('slots')}
           className={`px-6 h-10 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activePanel === 'slots' ? 'bg-primary text-primary-foreground border-primary shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]' : 'bg-background text-muted-foreground border-transparent hover:border-foreground hover:text-foreground'}`}
         >
           Availability Grid
         </button>
         <button 
           onClick={() => setActivePanel('price-rules')}
           className={`px-6 h-10 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activePanel === 'price-rules' ? 'bg-primary text-primary-foreground border-primary shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]' : 'bg-background text-muted-foreground border-transparent hover:border-foreground hover:text-foreground'}`}
         >
           Price Rules
         </button>
         <button 
           onClick={() => setActivePanel('config')}
           className={`px-6 h-10 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activePanel === 'config' ? 'bg-primary text-primary-foreground border-primary shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]' : 'bg-background text-muted-foreground border-transparent hover:border-foreground hover:text-foreground'}`}
         >
           Configuration
         </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
           <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin border-primary/20" />
           <div className="text-center">
              <p className="text-sm font-bold text-foreground uppercase tracking-widest">Synchronizing Ops Data</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Interrogating booking engine...</p>
           </div>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-destructive/5 border border-destructive/10 rounded-[2.5rem] max-w-xl mx-auto">
           <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
           <p className="text-lg font-bold text-foreground mb-6">{error}</p>
           <Button onClick={fetchData} className="bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-widest py-6 px-12 rounded-2xl text-xs">Retry Connection</Button>
        </div>
      ) : activePanel === 'bookings' ? (
        <div className="space-y-4">
           {!bookings || bookings.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] bg-muted/5">
                 <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">No operations records for this date</p>
              </div>
           ) : (
              <div className="grid gap-4">
                 {Array.isArray(bookings) && bookings.map(booking => (
                    <div key={booking.id} className="bg-background border-2 border-border hover:border-foreground rounded-none p-6 transition-all duration-300 group overflow-hidden relative shadow-[4px_4px_0_0_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-none border-2 border-border group-hover:border-primary bg-muted/50 flex items-center justify-center shrink-0 transition-colors">
                                <Clock className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                             </div>
                             <div>
                                <h4 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{booking.startTime} - {booking.endTime}</h4>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 bg-muted px-2 py-0.5 inline-block border border-border">{booking.reference}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-8 lg:gap-16">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-none bg-background flex items-center justify-center border-2 border-border">
                                   <User className="w-4 h-4 text-foreground" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Client Info</p>
                                   <p className="text-sm font-black text-foreground uppercase tracking-tight">{booking.user?.name || 'Anonymous'}</p>
                                </div>
                             </div>
                             <div className="text-right border-l-2 border-border pl-8">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Status</p>
                                <Badge className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500 px-3 py-1 rounded-none">
                                   {booking.status}
                                </Badge>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      ) : activePanel === 'slots' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
           {Array.isArray(slots) && slots.map(slot => (
              <div 
                key={slot.slotId} 
                className={`p-6 rounded-none border-2 transition-all duration-300 relative group/slot ${
                  slot.status === 'AVAILABLE' 
                    ? 'bg-background border-border hover:border-foreground hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-1' 
                    : 'bg-muted/30 border-border/50 opacity-80'
                }`}
              >
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className={`w-3 h-3 rounded-none border-[1.5px] ${slot.status === 'AVAILABLE' ? 'bg-emerald-500 border-emerald-700 animate-pulse' : 'bg-muted-foreground border-border'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{slot.status}</span>
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-foreground tracking-tighter uppercase">{formatDisplayTime(slot.startTime)}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Ends {formatDisplayTime(slot.endTime)}</p>
                   </div>
                   <div className="pt-4 border-t-2 border-border border-dashed flex items-center justify-between">
                      <span className="text-lg font-black text-primary">₹{slot.price}</span>
                      <ArrowUpRight className="w-5 h-5 text-foreground opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                   </div>
                </div>
              </div>
           ))}
        </div>
      ) : activePanel === 'price-rules' ? (
        <div className="space-y-6">
           {/* Price Rules Header */}
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-black text-foreground">Active Price Rules</h3>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Override standard pricing based on time/day</p>
              </div>
              
              <Dialog open={isAddRuleModalOpen} onOpenChange={setIsAddRuleModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl gap-2 h-11 px-6 font-black uppercase tracking-widest bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    New Price Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight">
                      {editingRule ? 'Edit Price Rule' : 'Create Price Rule'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Rule Reason</Label>
                       <Input 
                         placeholder="e.g. Peak Hours Charge" 
                         value={ruleForm.reason} 
                         onChange={(e) => setRuleForm(prev => ({ ...prev, reason: e.target.value }))}
                        className="rounded-xl h-12 border-2 focus:border-primary transition-all font-bold"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Day Profile</Label>
                        <Select value={ruleForm.dayType} onValueChange={(val: any) => setRuleForm(prev => ({ ...prev, dayType: val }))}>
                          <SelectTrigger className="rounded-xl h-12 border-2 font-bold">
                            <SelectValue placeholder="Select day type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-2">
                            <SelectItem value="ALL">Apply to All Days</SelectItem>
                            <SelectItem value="WEEKDAY">Weekdays Only</SelectItem>
                            <SelectItem value="WEEKEND">Weekends Only</SelectItem>
                            <SelectItem value="HOLIDAY">Holidays Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Priority</Label>
                        <Input 
                          type="number" 
                          value={ruleForm.priority} 
                          onChange={(e) => setRuleForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                          className="rounded-xl h-12 border-2 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Start Time</Label>
                         <Select value={ruleForm.startTime} onValueChange={(val) => setRuleForm(prev => ({ ...prev, startTime: val }))}>
                            <SelectTrigger className="rounded-xl h-12 border-2 font-bold">
                               <SelectValue placeholder="00:00:00" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2 max-h-[200px]">
                               {TIME_OPTIONS.map(time => (
                                 <SelectItem key={`start-${time}`} value={time}>{formatDisplayTime(time)}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">End Time</Label>
                         <Select value={ruleForm.endTime} onValueChange={(val) => setRuleForm(prev => ({ ...prev, endTime: val }))}>
                            <SelectTrigger className="rounded-xl h-12 border-2 font-bold">
                               <SelectValue placeholder="23:30:00" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2 max-h-[200px]">
                               {TIME_OPTIONS.map(time => (
                                 <SelectItem key={`end-${time}`} value={time}>{formatDisplayTime(time)}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Base Price Override</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">₹</span>
                          <Input 
                            type="number" 
                            value={ruleForm.basePrice} 
                            onChange={(e) => setRuleForm(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                            className="rounded-xl h-12 border-2 pl-8 font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Extra Surcharge</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">₹</span>
                          <Input 
                            type="number" 
                            value={ruleForm.extraCharge} 
                            onChange={(e) => setRuleForm(prev => ({ ...prev, extraCharge: parseFloat(e.target.value) }))}
                            className="rounded-xl h-12 border-2 pl-8 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0 sm:flex-row-reverse mt-4">
                    <Button 
                      disabled={isSubmitting} 
                      onClick={handleAddRule}
                      className="rounded-xl h-14 px-8 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {editingRule ? 'Update Rule' : 'Deploy Rule'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddRuleModalOpen(false);
                        setEditingRule(null);
                      }}
                      className="rounded-xl h-14 px-8 font-black uppercase tracking-widest text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
           </div>

           {(!Array.isArray(priceRules) || priceRules.length === 0) ? (
              <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] bg-muted/5">
                 <Tag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">No active price rules found</p>
              </div>
           ) : (
              <div className="grid gap-4">
                 {priceRules.map(rule => (
                    <div key={rule?.id} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-6 hover:bg-card transition-all group overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                   <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{rule?.reason || 'Unnamed Rule'}</h4>
                                   <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter">
                                      Priority {rule?.priority ?? 0}
                                   </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                   <Badge className={`text-[9px] font-black uppercase tracking-widest border-none ${rule?.dayType === 'WEEKEND' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                      {rule?.dayType || 'ANY'}
                                   </Badge>
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                      {formatTimeStr(rule?.startTime)} - {formatTimeStr(rule?.endTime)}
                                   </p>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-8 lg:gap-16">
                             <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mb-1">Base Price</p>
                                <p className="text-lg font-black text-foreground">₹{rule?.basePrice ?? 0}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mb-1">Extra Charge</p>
                                <p className="text-lg font-black text-primary">+₹{rule?.extraCharge ?? 0}</p>
                             </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mb-2">Status</p>
                                 <Badge className={`text-[9px] font-black uppercase tracking-widest border-none px-3 py-1 ${rule?.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {rule?.enabled ? 'ENABLED' : 'DISABLED'}
                                 </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                 <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   onClick={() => handleEditRule(rule)}
                                   className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                 >
                                    <Edit className="w-4 h-4" />
                                 </Button>
                                 <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   onClick={() => handleDeleteRule(rule.id)}
                                   className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </Button>
                              </div>
                           </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status & Identity */}
              <div className="bg-background border-2 border-border rounded-none p-8 space-y-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-primary/10 border-2 border-primary flex items-center justify-center">
                       <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">Resource Identity</h3>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Main settings and status</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t-2 border-border">
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-2 border-border rounded-none">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Name</span>
                       <span className="text-sm font-black text-foreground uppercase tracking-tight">{resourceConfig?.resourceName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-2 border-border rounded-none">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</span>
                       <Badge className={`text-[9px] font-black uppercase tracking-widest border-2 px-4 py-1.5 rounded-none ${resourceConfig?.enabled ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' : 'bg-destructive/10 text-destructive border-destructive'}`}>
                          {resourceConfig?.enabled ? 'ACTIVE' : 'INACTIVE'}
                       </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/20 border-2 border-border rounded-none">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System ID</span>
                       <span className="text-sm font-black text-primary uppercase">#{resourceConfig?.id || 'N/A'}</span>
                    </div>
                 </div>
              </div>

              {/* Timing Architecture */}
              <div className="bg-background border-2 border-border rounded-none p-8 space-y-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center">
                       <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">Timing System</h3>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Operating hours and slotting</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border">
                    <div className="p-4 bg-muted/20 border-2 border-border rounded-none">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Opening</p>
                       <p className="text-2xl font-black uppercase tracking-tighter text-foreground">
                          {formatTimeStr(resourceConfig?.openingTime)}
                       </p>
                    </div>
                    <div className="p-4 bg-muted/20 border-2 border-border rounded-none">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Closing</p>
                       <p className="text-2xl font-black uppercase tracking-tighter text-foreground">
                          {formatTimeStr(resourceConfig?.closingTime)}
                       </p>
                    </div>
                    <div className="col-span-2 p-4 bg-muted/20 border-2 border-border rounded-none">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 border-b-2 border-border pb-2 text-center">Slot Mechanics</p>
                       <div className="flex items-center justify-between">
                          <div>
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
                             <p className="text-2xl font-black uppercase tracking-tighter text-foreground">{resourceConfig?.slotDurationMinutes || 0} Min</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Daily Capacity</p>
                             <p className="text-2xl font-black uppercase tracking-tighter text-primary">{resourceConfig?.totalSlots || 0} Slots</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Financial Profile */}
              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-8 space-y-6 col-span-1 md:col-span-2">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                       <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-foreground">Financial Profile</h3>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base pricing and revenue settings</p>
                    </div>
                 </div>

                 <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Standard Base Price</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-foreground">₹{resourceConfig?.basePrice || 0}</span>
                          <span className="text-xs font-bold text-muted-foreground italic">per unit slot</span>
                       </div>
                    </div>
                     <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                        <DialogTrigger asChild>
                           <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 rounded-2xl h-14">
                              Adjust Pricing Core
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
                           <DialogHeader>
                              <DialogTitle className="text-2xl font-black tracking-tight">Edit Operations Config</DialogTitle>
                           </DialogHeader>
                           <div className="grid gap-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Opening Time</Label>
                                    <Select value={configForm.openingTime} onValueChange={(val) => setConfigForm(prev => ({ ...prev, openingTime: val }))}>
                                       <SelectTrigger className="rounded-xl h-12 border-2 font-bold">
                                          <SelectValue placeholder="00:00:00" />
                                       </SelectTrigger>
                                       <SelectContent className="rounded-xl border-2 max-h-[200px]">
                                          {TIME_OPTIONS.map(time => (
                                          <SelectItem key={`config-start-${time}`} value={time}>{formatDisplayTime(time)}</SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Closing Time</Label>
                                    <Select value={configForm.closingTime} onValueChange={(val) => setConfigForm(prev => ({ ...prev, closingTime: val }))}>
                                       <SelectTrigger className="rounded-xl h-12 border-2 font-bold">
                                          <SelectValue placeholder="00:00:00" />
                                       </SelectTrigger>
                                       <SelectContent className="rounded-xl border-2 max-h-[200px]">
                                          {TIME_OPTIONS.map(time => (
                                          <SelectItem key={`config-end-${time}`} value={time}>{formatDisplayTime(time)}</SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Slot Duration (Min)</Label>
                                    <Input 
                                       type="number" 
                                       value={configForm.slotDurationMinutes} 
                                       onChange={(e) => setConfigForm(prev => ({ ...prev, slotDurationMinutes: parseInt(e.target.value) }))}
                                       className="rounded-xl h-12 border-2 font-bold"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Base Price</Label>
                                    <div className="relative">
                                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-sm">₹</span>
                                       <Input 
                                          type="number" 
                                          value={configForm.basePrice} 
                                          onChange={(e) => setConfigForm(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                                          className="rounded-xl h-12 border-2 pl-8 font-bold"
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <DialogFooter className="gap-2 sm:gap-0 sm:flex-row-reverse mt-4">
                              <Button 
                                 disabled={isSubmitting} 
                                 onClick={handleUpdateConfig}
                                 className="rounded-xl h-14 px-8 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                              >
                                 {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                 Save Configuration
                              </Button>
                              <Button 
                                 variant="ghost" 
                                 onClick={() => setIsConfigModalOpen(false)}
                                 className="rounded-xl h-14 px-8 font-black uppercase tracking-widest text-muted-foreground hover:bg-muted"
                              >
                                 Cancel
                              </Button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
