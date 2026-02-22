import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Clock, MapPin, User, DollarSign, Calendar, X } from "lucide-react";

interface Booking {
  id: string;
  groundId: string;
  startTime: number; // Hour in 24h format
  duration: number; // Hours
  userName: string;
  activity: string;
  basePrice: number;
  platformFee: number;
  status: "confirmed" | "pending";
}

const grounds = ["Ground A", "Ground B", "Ground C", "Ground D"];
const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6); // 6:00 to 23:00

const mockBookings: Booking[] = [
  { id: "BK1289", groundId: "Ground A", startTime: 6, duration: 2, userName: "Raj Kumar", activity: "Cricket", basePrice: 2000, platformFee: 200, status: "confirmed" },
  { id: "BK1290", groundId: "Ground A", startTime: 8, duration: 1, userName: "Priya Sharma", activity: "Football", basePrice: 1200, platformFee: 120, status: "confirmed" },
  { id: "BK1291", groundId: "Ground A", startTime: 18, duration: 2, userName: "Amit Patel", activity: "Cricket", basePrice: 3000, platformFee: 300, status: "confirmed" },
  { id: "BK1292", groundId: "Ground B", startTime: 7, duration: 1, userName: "Neha Singh", activity: "Badminton", basePrice: 800, platformFee: 80, status: "pending" },
  { id: "BK1293", groundId: "Ground B", startTime: 16, duration: 3, userName: "Vikram Mehta", activity: "Cricket", basePrice: 4000, platformFee: 400, status: "confirmed" },
  { id: "BK1294", groundId: "Ground C", startTime: 10, duration: 2, userName: "Sanjay Reddy", activity: "Football", basePrice: 2200, platformFee: 220, status: "confirmed" },
  { id: "BK1295", groundId: "Ground C", startTime: 19, duration: 2, userName: "Kavita Joshi", activity: "Cricket", basePrice: 3200, platformFee: 320, status: "pending" },
  { id: "BK1296", groundId: "Ground D", startTime: 14, duration: 1, userName: "Rahul Verma", activity: "Football", basePrice: 1500, platformFee: 150, status: "confirmed" },
  { id: "BK1297", groundId: "Ground D", startTime: 20, duration: 2, userName: "Deepa Nair", activity: "Badminton", basePrice: 1600, platformFee: 160, status: "confirmed" },
];

export function BookingManagement() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getBookingForSlot = (ground: string, time: number) => {
    return mockBookings.find(
      (booking) =>
        booking.groundId === ground &&
        time >= booking.startTime &&
        time < booking.startTime + booking.duration
    );
  };

  const handleCancelBooking = () => {
    // Mock cancel action
    console.log("Cancelling booking:", selectedBooking?.id);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[--dark-slate]">Booking Management</h2>
          <p className="text-sm text-[--slate-text] mt-1">Timeline view for today's schedule</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[--booking-confirmed] rounded" />
            <span className="text-sm text-[--slate-text]">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[--booking-pending] rounded" />
            <span className="text-sm text-[--slate-text]">Pending</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <Card className="p-6 border-gray-200 overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Header with time slots */}
          <div className="flex">
            <div className="w-32 flex-shrink-0" />
            {timeSlots.map((time) => (
              <div key={time} className="flex-1 min-w-[60px] text-center border-l border-gray-200">
                <span className="text-xs text-[--slate-text]">
                  {time.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Ground rows */}
          {grounds.map((ground) => (
            <div key={ground} className="flex mt-4">
              {/* Ground label */}
              <div className="w-32 flex-shrink-0 flex items-center">
                <div className="pr-4">
                  <h4 className="text-sm font-medium text-[--dark-slate]">{ground}</h4>
                  <p className="text-xs text-[--slate-text]">Multi-Activity</p>
                </div>
              </div>

              {/* Time slots */}
              <div className="flex-1 relative h-16">
                <div className="absolute inset-0 flex">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="flex-1 min-w-[60px] border-l border-gray-200 hover:bg-gray-50"
                    />
                  ))}
                </div>

                {/* Bookings */}
                {mockBookings
                  .filter((booking) => booking.groundId === ground)
                  .map((booking) => {
                    const leftOffset = ((booking.startTime - 6) / timeSlots.length) * 100;
                    const width = (booking.duration / timeSlots.length) * 100;
                    
                    return (
                      <div
                        key={booking.id}
                        className={`absolute top-2 h-12 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                          booking.status === "confirmed"
                            ? "bg-[--navy-primary] text-white"
                            : "bg-[--booking-pending] text-white"
                        }`}
                        style={{
                          left: `${leftOffset}%`,
                          width: `${width}%`,
                        }}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="px-3 py-2 h-full flex flex-col justify-center">
                          <p className="text-xs font-medium truncate">{booking.userName}</p>
                          <p className="text-xs opacity-90 truncate">{booking.activity}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Detail Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge
                className={
                  selectedBooking?.status === "confirmed"
                    ? "bg-[--navy-bg-light] text-[--navy-primary]"
                    : "bg-yellow-100 text-yellow-700"
                }
              >
                {selectedBooking?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              View booking information and manage this reservation
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[--navy-primary] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[--dark-slate]">Booking ID</p>
                  <p className="text-sm text-[--slate-text]">{selectedBooking.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-[--navy-primary] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[--dark-slate]">User Name</p>
                  <p className="text-sm text-[--slate-text]">{selectedBooking.userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-[--navy-primary] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[--dark-slate]">Location & Activity</p>
                  <p className="text-sm text-[--slate-text]">
                    {selectedBooking.groundId} - {selectedBooking.activity}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-[--navy-primary] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[--dark-slate]">Time Slot</p>
                  <p className="text-sm text-[--slate-text]">
                    {selectedBooking.startTime.toString().padStart(2, "0")}:00 -{" "}
                    {(selectedBooking.startTime + selectedBooking.duration).toString().padStart(2, "0")}:00
                    ({selectedBooking.duration}h)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-[--navy-primary] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[--dark-slate]">Price Breakdown</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[--slate-text]">Base Price</span>
                      <span className="text-[--dark-slate]">₹{selectedBooking.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[--slate-text]">Platform Fee</span>
                      <span className="text-[--dark-slate]">₹{selectedBooking.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-300">
                      <span className="text-[--dark-slate]">Total</span>
                      <span className="text-[--navy-primary]">
                        ₹{(selectedBooking.basePrice + selectedBooking.platformFee).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              className="bg-red-500 hover:bg-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
