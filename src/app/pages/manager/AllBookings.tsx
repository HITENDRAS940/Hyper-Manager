import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCcw,
  Loader2,
  Wallet,
  ArrowUpRight,
  Receipt,
  Eye} from "lucide-react";
import { managerApi, AllBooking } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { BookingDetailSheet } from "../../components/BookingDetailSheet";

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CheckCircle2 },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: XCircle },
  REFUNDED: { label: "Refunded", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: RefreshCcw },
};

export function AllBookings() {
  const [bookings, setBookings] = useState<AllBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [cancelingIds, setCancelingIds] = useState<Record<number, boolean>>({});
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  const fetchAllBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getAllBookings();
      setBookings(response.content);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings history");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelingIds(prev => ({ ...prev, [bookingId]: true }));
    try {
      await managerApi.cancelBooking(bookingId);
      // Refresh to show updated status
      fetchAllBookings();
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking");
    } finally {
      setCancelingIds(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary" />
             </div>
             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">History</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Reservation Ledger</h2>
          <p className="text-muted-foreground font-medium max-w-md">Comprehensive overview of all ground bookings across all operational states.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 min-w-[160px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Records</p>
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-foreground">{bookings.length}</h3>
                 <span className="text-[10px] font-extrabold text-muted-foreground bg-muted p-1 rounded">ALL TIME</span>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card/30 backdrop-blur-md border border-border/50 p-3 rounded-2xl shadow-xl shadow-black/5">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by ref, service or user..." 
              className="pl-10 h-11 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REFUNDED"].map(status => (
                <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                        selectedStatus === status 
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                        : "bg-background/50 text-muted-foreground border-border hover:bg-muted"
                    }`}
                >
                    {status}
                </button>
            ))}
         </div>

         <Button 
            variant="ghost" 
            onClick={fetchAllBookings}
            disabled={loading}
            className="h-11 px-6 font-bold text-xs uppercase tracking-widest gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Sync
         </Button>
      </div>

      {/* Content Section */}
      {loading && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <div className="relative">
              <div className="w-20 h-20 border-t-4 border-primary rounded-full animate-spin border-primary/20" />
              <Receipt className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 text-primary opacity-50" />
           </div>
           <div className="text-center">
              <p className="text-xl font-bold text-foreground">Data Engine Initializing</p>
              <p className="text-sm text-muted-foreground font-medium">Reconstructing reservation timeline...</p>
           </div>
        </div>
      ) : error ? (
        <div className="p-12 rounded-[2.5rem] bg-destructive/5 border border-destructive/10 text-center max-w-xl mx-auto my-12 backdrop-blur-md">
           <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
           </div>
           <h3 className="text-2xl font-black text-foreground mb-3">Sync Failure</h3>
           <p className="text-muted-foreground mb-8 text-lg font-medium">{error}</p>
           <Button onClick={fetchAllBookings} size="lg" className="bg-destructive hover:bg-destructive/90 text-white rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs">
             Reconnect Hub
           </Button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border/20 rounded-[3rem] bg-muted/5">
           <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mb-8 opacity-40">
              <Filter className="w-12 h-12 text-muted-foreground" />
           </div>
           <p className="text-2xl font-black text-foreground mb-2">No Matches Found</p>
           <p className="text-sm text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-50">Refine your search parameters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            return (
              <div 
                key={booking.id} 
                className="group relative bg-card/40 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-8 hover:bg-card/70 transition-all duration-500 hover:shadow-3xl hover:shadow-black/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                  {/* Status & Identity */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                       <Badge variant="outline" className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="w-3 h-3 mr-2 inline-block" />
                          {statusConfig[booking.status].label}
                       </Badge>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 tracking-widest">{booking.reference}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground leading-none mb-3 group-hover:text-primary transition-colors">{booking.serviceName}</h3>
                      <div className="flex items-center gap-3">
                         <div className="bg-muted px-2 py-1 rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{booking.resourceName}</div>
                         <div className="w-1.5 h-1.5 rounded-full bg-border" />
                         <span className="text-xs font-bold text-muted-foreground/60">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-6 border-x border-border/50 px-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Client Info</p>
                           <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-primary" />
                              <span className="text-sm font-bold text-foreground truncate">{booking.user.name}</span>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Financials</p>
                           <div className="flex items-center gap-2">
                              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-sm font-bold text-foreground">₹{booking.amountBreakdown.totalAmount}</span>
                           </div>
                           <p className="text-[9px] font-bold text-muted-foreground/60 ml-5 uppercase">Inc. Fee (₹{booking.amountBreakdown.platformFee})</p>
                        </div>
                     </div>
                     <div className="space-y-4 text-right">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Date</p>
                           <p className="text-sm font-bold text-foreground">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1 text-primary">
                           <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-muted-foreground">Timeslot</p>
                           <p className="text-sm font-black tracking-tight">{booking.startTime} - {booking.endTime}</p>
                        </div>
                     </div>
                  </div>

                  {/* Summary Actions */}
                  <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-3">
                     <div className="bg-primary/5 rounded-2xl p-4 w-full group/stat hover:bg-primary transition-colors duration-500">
                        <div className="flex items-center justify-between mb-1">
                           <p className="text-[10px] font-bold text-primary uppercase group-hover/stat:text-primary-foreground transition-colors">Subtotal</p>
                           <ArrowUpRight className="w-3 h-3 text-primary group-hover/stat:text-primary-foreground transition-colors" />
                        </div>
                        <h4 className="text-2xl font-black text-foreground group-hover/stat:text-primary-foreground transition-colors">₹{booking.amountBreakdown.slotSubtotal}</h4>
                     </div>
                     <div className="flex flex-col w-full gap-2">
                        <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => setSelectedBookingId(booking.id)}
                           className="w-full h-10 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-muted"
                        >
                           <Eye className="w-3 h-3" />
                           Quick View
                        </Button>
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCancel(booking.id)}
                              disabled={cancelingIds[booking.id]}
                              className="w-full h-10 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/10"
                           >
                              {cancelingIds[booking.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                              Cancel Booking
                           </Button>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BookingDetailSheet 
        bookingId={selectedBookingId} 
        open={!!selectedBookingId} 
        onOpenChange={(open) => !open && setSelectedBookingId(null)} 
      />
    </div>
  );
}
