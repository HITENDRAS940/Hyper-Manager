import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Hash, 
  MapPin, 
  Activity, 
  Loader2, 
  AlertCircle,
  FileText,
  BadgeCheck,
  CalendarDays
} from "lucide-react";
import { managerApi, AllBooking } from "../api/managerApi";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface BookingDetailSheetProps {
  bookingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailSheet({ bookingId, open, onOpenChange }: BookingDetailSheetProps) {
  const [booking, setBooking] = useState<AllBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId && open) {
      fetchBookingDetails();
    } else {
      setBooking(null);
      setError("");
    }
  }, [bookingId, open]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await managerApi.getBookingById(bookingId!);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reservation details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-background border-l border-border/50 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-8 border-b border-border/50 bg-card/30">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] border-2 py-1 px-3 bg-primary/5 text-primary border-primary/20">
                Reservation Log
              </Badge>
              {booking && (
                <Badge className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${
                  booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500' :
                  booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {booking.status}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black tracking-tighter text-foreground">
                {loading ? "Loading Details..." : booking?.serviceName || "Reservation Details"}
              </SheetTitle>
              <SheetDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3.5 h-3.5" />
                Ref: {booking?.reference || '---'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Accessing Global DB...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto opacity-50" />
              <p className="text-sm font-bold text-foreground">{error}</p>
              <Button onClick={fetchBookingDetails} variant="outline" className="rounded-xl">Retry</Button>
            </div>
          ) : booking ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Timing Section */}
              <div className="grid grid-cols-2 gap-6 bg-card/40 border border-border/50 rounded-[2rem] p-6 backdrop-blur-sm">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Reservation Date
                  </p>
                  <p className="text-lg font-black text-foreground">
                    {new Date(booking.bookingDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Time Slot
                  </p>
                  <p className="text-lg font-black text-foreground">{booking.startTime} - {booking.endTime}</p>
                </div>
              </div>

              {/* Resource & User Info */}
              <div className="grid gap-6">
                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center shrink-0">
                       <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Asset Allocation</p>
                       <h4 className="text-lg font-black text-foreground">{booking.resourceName}</h4>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{booking.serviceName}</p>
                    </div>
                 </div>

                 <Separator className="bg-border/30" />

                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center shrink-0">
                       <User className="w-5 h-5 text-indigo-500" />
                    </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-1">Customer Profile</p>
                          <h4 className="text-lg font-black text-foreground">{booking.user.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                             {booking.user.email && (
                               <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                  <FileText className="w-3 h-3" />
                                  {booking.user.email}
                               </p>
                             )}
                          </div>
                       </div>
                 </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Financial Breakdown
                 </p>
                 <div className="bg-muted/30 rounded-[2.5rem] p-8 space-y-4 border border-border/50">
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-bold text-muted-foreground">Base Fare (Slot Subtotal)</span>
                       <span className="font-black text-foreground">₹{booking.amountBreakdown.slotSubtotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-bold text-muted-foreground">Platform Access Fee ({booking.amountBreakdown.platformFeePercent}%)</span>
                       <span className="font-black text-foreground">₹{booking.amountBreakdown.platformFee}</span>
                    </div>
                    <Separator className="bg-border/30 my-4" />
                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black text-foreground tracking-tight">Total Settlement</span>
                       <span className="text-2xl font-black text-primary">₹{booking.amountBreakdown.totalAmount}</span>
                    </div>
                 </div>
              </div>

              {/* Auxiliary Details */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 rounded-[1.5rem] border border-border/50 bg-card/20 group hover:border-primary/20 transition-all">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Booking Type</p>
                    <p className="text-sm font-black text-foreground flex items-center gap-2">
                       <BadgeCheck className="w-4 h-4 text-emerald-500" />
                       {booking.bookingType || 'STANDARD'}
                    </p>
                 </div>
                 <div className="p-5 rounded-[1.5rem] border border-border/50 bg-card/20 group hover:border-primary/20 transition-all">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Internal Note</p>
                    <p className="text-sm font-bold text-muted-foreground italic line-clamp-1">{booking.message || 'No remarks provided'}</p>
                 </div>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
