import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Calendar, 
  TrendingUp, 
  UserPlus,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  History,
  Clock,
  Eye,
  Mail,
  Phone
} from "lucide-react";
import { managerApi, AppUser, AllBooking } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import { BookingDetailSheet } from "../../components/BookingDetailSheet";

export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Booking History State
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [userBookings, setUserBookings] = useState<AllBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [selectedDetailBookingId, setSelectedDetailBookingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getUsers(page, 10);
      setUsers(Array.isArray(response?.content) ? response.content : []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async (userId: number, p: number = 0) => {
    setLoadingBookings(true);
    try {
      const response = await managerApi.getUserBookings(userId, p, 10);
      const content = Array.isArray(response?.content) ? response.content : [];
      if (p === 0) {
        setUserBookings(content);
      } else {
        setUserBookings(prev => [...prev, ...content]);
      }
      setHistoryTotalPages(response?.totalPages || 0);
    } catch (err: any) {
      console.error("Failed to fetch user bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (selectedUser) {
      setHistoryPage(0);
      fetchUserBookings(selectedUser.id, 0);
    }
  }, [selectedUser]);

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4">
            User Management
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-2 py-1 px-3 bg-primary/5 text-primary border-primary/20">
              {totalElements} Total
            </Badge>
          </h2>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Users className="w-4 h-4 opacity-40 text-primary" />
            Registry of all platform users and their activity metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 w-full lg:w-[320px] bg-card/50 border-border/50 rounded-2xl focus:ring-primary shadow-sm"
            />
          </div>
          <Button className="h-11 px-6 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Main Grid Section */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Accessing User Database...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/5 border border-destructive/10 rounded-[2.5rem] max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-lg font-bold text-foreground mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="outline" className="rounded-xl px-8">Retry Fetch</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] bg-muted/5">
              <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">No matching users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="group bg-card/40 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-6 hover:bg-card transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative z-10">
                  {/* Primary Info */}
                  <div className="flex items-center gap-5 min-w-[300px]">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 rounded-2xl">
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                        {user.name ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{user.name}</h3>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                          {user.enabled ? <ShieldCheck className="w-3 h-3 inline mr-1" /> : <ShieldAlert className="w-3 h-3 inline mr-1" />}
                          {user.enabled ? 'Active' : 'Disabled'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Contact Details</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-primary opacity-60" />
                          <span className="text-[11px] font-bold text-foreground truncate max-w-[150px]">{user.email || 'No Email'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-primary opacity-60" />
                          <span className="text-[11px] font-bold text-foreground">{user.phone || 'No Phone'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Bookings</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-lg font-black text-foreground">{user.totalBookings}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Revenue Performance</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">₹{((user.confirmedBookings || 0) * 500).toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center">
                            High Intensity <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Cxl Rate</p>
                        <p className={`text-sm font-black ${(user.cancelledBookings || 0) > (user.confirmedBookings || 0) ? 'text-destructive' : 'text-foreground'}`}>
                          {user.totalBookings > 0 ? (((user.cancelledBookings || 0) / user.totalBookings) * 100).toFixed(0) : 0}%
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedUser(user)}
                        className="h-10 w-10 rounded-xl hover:bg-muted group/btn"
                      >
                        <History className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 pt-8">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Showing Page <span className="text-foreground">{page + 1}</span> of <span className="text-foreground">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl h-9 px-4 font-bold border-border/50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl h-9 px-4 font-bold border-border/50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
      {/* Booking History Side Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-background border-l border-border/50 p-0 overflow-hidden flex flex-col">
          <SheetHeader className="p-8 border-b border-border/50 bg-card/30">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20 rounded-xl">
                <AvatarFallback className="bg-primary/10 text-primary font-black">
                  {selectedUser?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <SheetTitle className="text-2xl font-black tracking-tight">{selectedUser?.name}</SheetTitle>
                <SheetDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <History className="w-3.5 h-3.5" />
                  Reservation Ledger
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
            {loadingBookings && userBookings.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Records...</p>
              </div>
            ) : userBookings.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">No reservations found</p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">This user hasn't made any bookings on the platform yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {userBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    onClick={() => setSelectedDetailBookingId(booking.id)}
                    className="bg-muted/20 border border-border/50 rounded-2xl p-5 hover:bg-muted/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 group-hover:border-primary/20 transition-colors">
                            <TrendingUp className="w-5 h-5 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-foreground truncate max-w-[180px]">{booking.serviceName}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{booking.resourceName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.bookingDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" />
                            {booking.startTime}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-none ${
                          booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500' :
                          booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm font-black text-foreground">₹{booking.amountBreakdown.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {historyPage < historyTotalPages - 1 && (
                  <Button 
                    variant="ghost" 
                    className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 mt-2"
                    onClick={() => {
                      const next = historyPage + 1;
                      setHistoryPage(next);
                      fetchUserBookings(selectedUser!.id, next);
                    }}
                    disabled={loadingBookings}
                  >
                    {loadingBookings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more records'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <BookingDetailSheet 
        bookingId={selectedDetailBookingId} 
        open={!!selectedDetailBookingId} 
        onOpenChange={(open) => !open && setSelectedDetailBookingId(null)} 
      />
    </div>
  );
}
