import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle,
  User, 
  Calendar as CalendarIcon, 
  MapPin, 
  AlertCircle,
  Loader2,
  Search,
  ChevronRight,
  TrendingUp,
  Package,
  ArrowUpRight
} from "lucide-react";
import { managerApi, PendingBooking } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function PendingBookings() {
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingIds, setApprovingIds] = useState<Record<number, boolean>>({});
  const [cancelingIds, setCancelingIds] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPendingBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getPendingBookings();
      setBookings(response.content);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: number) => {
    setApprovingIds(prev => ({ ...prev, [bookingId]: true }));
    try {
      await managerApi.approveBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err: any) {
      alert(err.message || "Failed to approve booking");
    } finally {
      setApprovingIds(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelingIds(prev => ({ ...prev, [bookingId]: true }));
    try {
      await managerApi.cancelBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking");
    } finally {
      setCancelingIds(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
             </div>
             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Operations</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Pending Approvals</h2>
          <p className="text-muted-foreground font-medium max-w-md">Review and manually confirm incoming ground reservations to finalize scheduling.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 min-w-[160px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Awaiting Action</p>
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-foreground">{bookings.length}</h3>
                 <span className="flex items-center text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Bookings
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-card/30 backdrop-blur-md border border-border/50 p-2 rounded-2xl">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by reference, service or user..." 
              className="pl-10 h-11 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <Button 
            variant="ghost" 
            onClick={fetchPendingBookings}
            disabled={loading}
            className="h-11 px-6 font-bold text-xs uppercase tracking-widest gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            Refresh
         </Button>
      </div>

      {/* Content Section */}
      {loading && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
             <Clock className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 text-primary/50" />
          </div>
          <div className="text-center">
             <p className="text-lg font-bold text-foreground">Synchronizing Bookings</p>
             <p className="text-sm text-muted-foreground">Fetching latest reservation data from the engine...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-destructive/5 border border-destructive/10 text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Sync Interrupted</h3>
          <p className="text-muted-foreground mb-6 font-medium">{error}</p>
          <Button onClick={fetchPendingBookings} className="bg-destructive hover:bg-destructive/90 text-white rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-xs">
            Retry Connection
          </Button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/30 rounded-[2.5rem] bg-muted/5">
           <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground/30" />
           </div>
           <p className="text-xl font-bold text-foreground mb-1">Queue Clear</p>
           <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">No pending approvals found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] p-6 hover:bg-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Reference & Service */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-primary/20">
                        {booking.reference}
                     </span>
                     <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Ref Code
                     </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                      {booking.serviceName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                          <Package className="w-3.5 h-3.5 text-muted-foreground" />
                       </div>
                       <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">{booking.resourceName}</p>
                    </div>
                  </div>
                </div>

                {/* Timing & Date */}
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                          <CalendarIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Booking Date</p>
                          <p className="text-sm font-bold text-foreground">{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                          <Clock className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Time Slot</p>
                          <p className="text-sm font-bold text-foreground tracking-tight">{booking.startTime} - {booking.endTime}</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="lg:col-span-3">
                   <div className="p-4 rounded-2xl bg-muted/30 border border-border/30 group-hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                         </div>
                         <p className="text-sm font-bold text-foreground">{booking.user.name}</p>
                      </div>
                      <div className="space-y-1 ml-11">
                         <p className="text-[10px] font-bold text-primary/70 uppercase tracking-tighter">Verified Client</p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex flex-col items-center sm:items-end gap-3">
                  <div className="text-center sm:text-right mb-2">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total Amount</p>
                     <h4 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tabular-nums">₹{booking.amount}</h4>
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <Button 
                      onClick={() => handleApprove(booking.id)}
                      disabled={approvingIds[booking.id] || cancelingIds[booking.id]}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.15em] py-5 rounded-xl shadow-lg shadow-primary/10 transition-all gap-2"
                    >
                      {approvingIds[booking.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Approve
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => handleCancel(booking.id)}
                      disabled={approvingIds[booking.id] || cancelingIds[booking.id]}
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 font-bold text-xs uppercase tracking-widest py-5 rounded-xl transition-all gap-2"
                    >
                      {cancelingIds[booking.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
