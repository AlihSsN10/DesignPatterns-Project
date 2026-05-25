import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import {
  TicketCheck, CalendarDays, Users, TrendingUp,
  Clock, MapPin, MoreHorizontal, Eye, Trash2,
  PlusCircle, ArrowUpRight, ShieldX, CheckCircle,
  FileText, Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:8080/api";

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-green-100 text-green-700 border-none",
    Cancelled: "bg-red-100 text-red-600 border-none",
    Pending:   "bg-yellow-100 text-yellow-700 border-none",
    APPROVED:  "bg-teal-100 text-teal-700 border-none",
    PENDING:   "bg-orange-100 text-orange-700 border-none",
    CLOSED:    "bg-gray-200 text-gray-600 border-none",
  };
  return <Badge className={styles[status] ?? "bg-gray-100 text-gray-700"}>{status}</Badge>;
}

function CapacityBar({ booked, capacity }) {
  if (!capacity) capacity = 100;
  const pct   = Math.min(100, Math.round((booked / capacity) * 100));
  const color = pct >= 80 ? "bg-red-400" : pct >= 50 ? "bg-amber-400" : "bg-teal-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{booked} / {capacity} booked</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const CATEGORY_LABELS = {
  "cat-1": "Tech Conference", "cat-2": "Art Workshop",
  "cat-3": "Music & Festivals", "cat-4": "Cultural Seminar",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useApp();

  const [removedIds, setRemovedIds] = useState(new Set());
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [organizerBookings, setOrganizerBookings] = useState([]);
  
  const [adminStats, setAdminStats] = useState(null);
  const [allSystemEvents, setAllSystemEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const canAccess = isLoggedIn && (user?.role === "ADMIN" || user?.role === "ORGANIZER" || user?.role === "EVENT_CREATOR");
  const isAdmin = user?.role === "ADMIN";

  const fetchAdminEvents = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/admin/events?adminId=${user.id}`);
      if (res.ok) setAllSystemEvents(await res.json());
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    if (!canAccess || !user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        if (isAdmin) {
            const adminRes = await fetch(`${API_BASE}/admin/stats?adminId=${user.id}`);
            if (adminRes.ok) {
                const adminData = await adminRes.json();
                if (!adminData.error) setAdminStats(adminData);
            }
            await fetchAdminEvents();
        } else {
            // Organizer fetching
            const eventsRes = await fetch(`${API_BASE}/events/organizer/${user.id}`);
            if (eventsRes.ok) setOrganizerEvents(await eventsRes.json());
            
            const bookingsRes = await fetch(`${API_BASE}/bookings/organizer/${user.id}`);
            if (bookingsRes.ok) {
              const b = await bookingsRes.json();
              setOrganizerBookings(b.map(x => ({
                bookingId: x.id.toString(), eventId: x.event.id, name: x.event.title,
                price: x.totalPrice, qty: x.quantity, date: x.bookingDate, status: x.status
              })));
            }
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, canAccess, isAdmin]);

  // Organizer Actions
  const handleCloseEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to close this event? Ticket sales will stop immediately.")) return;
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/close?organizerId=${user.id}`, { method: 'PUT' });
      if (res.ok) {
        toast.success("Event successfully closed!");
        // Update local state
        setOrganizerEvents(prev => prev.map(evt => evt.id === eventId ? { ...evt, status: "CLOSED" } : evt));
      } else {
        toast.error("Failed to close event.");
      }
    } catch(e) {
      toast.error("An error occurred.");
    }
  };

  // Admin Actions
  const handleApproveEvent = async (eventId) => {
    const res = await fetch(`${API_BASE}/admin/events/${eventId}/approve?adminId=${user.id}`, { method: 'PUT' });
    if (res.ok) {
      toast.success("Event officially approved for the platform!");
      fetchAdminEvents();
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;
    const res = await fetch(`${API_BASE}/admin/events/${eventId}?adminId=${user.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Event permanently deleted.");
      fetchAdminEvents();
    }
  };

  const handleDownloadReport = async (format) => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports?adminId=${user.id}&format=${format}`);
      if (!res.ok) throw new Error("Failed");
      const text = await res.text();
      const blob = new Blob([text], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Platform_Report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} Report downloaded!`);
    } catch (err) { toast.error("Error downloading report"); }
  };

  if (loading) return <div className="text-center py-20 text-teal-700 font-medium">Loading Dashboard...</div>;

  if (!canAccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="bg-red-50 p-6 rounded-full mb-6"><ShieldX className="h-16 w-16 text-red-400" /></div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-sm mb-8">This area is restricted to Organizers and Admins only.</p>
        <Button onClick={() => navigate("/")} className="bg-teal-800 hover:bg-teal-700">Go to Home</Button>
      </div>
    );
  }

  // Render Admin Dashboard
  if (isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-teal-950 flex items-center gap-2"><ShieldX className="text-teal-700" /> Admin Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome Master Admin. You have full control over the platform.</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-5">
          <TabsList className="bg-teal-50 h-11 p-1 rounded-xl">
            <TabsTrigger value="stats" className="rounded-lg font-semibold data-[state=active]:bg-white">Platform Overview</TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-lg font-semibold data-[state=active]:bg-white">Event Moderation ({allSystemEvents.filter(e => e.status === "PENDING").length} Pending)</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {adminStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-2">
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm text-gray-500 font-medium">Total Revenue</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-black text-amber-600">{adminStats.totalRevenue.toLocaleString()} EGP</p></CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm text-gray-500 font-medium">Active Events</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-black text-teal-600">{adminStats.activeEvents}</p></CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm text-gray-500 font-medium">30-Day User Growth</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-3xl font-black text-blue-600">+{adminStats.newUsers30Days}</p>
                      <p className="text-xs text-gray-400 mt-1">Total Users: {adminStats.totalUsers}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm text-gray-500 font-medium">Global Bookings</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-black text-purple-600">{adminStats.totalBookings}</p></CardContent>
                  </Card>
              </div>
            )}
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-teal-950 flex items-center gap-2"><FileText size={18} className="text-teal-700"/> Generate Reports</h3>
                  <p className="text-sm text-gray-500 mt-1">Download platform statistics using Template Method generators.</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => handleDownloadReport('pdf')} className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200">
                    <Download size={16} className="mr-2" /> PDF Report
                  </Button>
                  <Button onClick={() => handleDownloadReport('csv')} className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
                    <Download size={16} className="mr-2" /> CSV Report
                  </Button>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-teal-900">Event Approval Pipeline</CardTitle>
                <CardDescription>Approve pending events before they appear publicly on the booking page.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/60">
                      <TableHead>Event Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Admin Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSystemEvents.map((evt) => (
                      <TableRow key={evt.id} className="hover:bg-teal-50/30">
                        <TableCell className="font-semibold text-teal-950">{evt.title}</TableCell>
                        <TableCell className="text-sm text-gray-500">{new Date(evt.dateTime).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">{evt.price} EGP</TableCell>
                        <TableCell className="text-sm text-gray-500">{evt.creator?.username || "Unknown"}</TableCell>
                        <TableCell><StatusBadge status={evt.status || "PENDING"} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {evt.status !== "APPROVED" && (
                                <DropdownMenuItem onClick={() => handleApproveEvent(evt.id)} className="text-green-600 focus:text-green-700 font-semibold">
                                  <CheckCircle className="mr-2 h-4 w-4" /> Approve Event
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteEvent(evt.id)} className="text-red-500 focus:text-red-600 font-semibold">
                                <Trash2 className="mr-2 h-4 w-4" /> Permanently Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Render Organizer Dashboard
  const confirmedBookings = organizerBookings.filter((b) => b.status === "CONFIRMED" || b.status === "Confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0);
  const totalAttendees = confirmedBookings.reduce((sum, b) => sum + b.qty, 0);
  const visibleBookings = organizerBookings.slice().reverse().filter((b) => !removedIds.has(b.bookingId));

  const stats = [
    { label: "Your Events", value: organizerEvents.length, sub: "Currently active", icon: <CalendarDays size={22} />, color: "bg-teal-100 text-teal-800" },
    { label: "Tickets Sold", value: totalAttendees, sub: "Confirmed purchases", icon: <TicketCheck size={22} />, color: "bg-blue-100 text-blue-800" },
    { label: "Total Bookings", value: confirmedBookings.length, sub: "Unique orders", icon: <Users size={22} />, color: "bg-purple-100 text-purple-800" },
    { label: "Revenue", value: `${totalRevenue.toLocaleString()} EGP`, sub: "Total earnings", icon: <TrendingUp size={22} />, color: "bg-amber-100 text-amber-800" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-950">Organizer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name} — here's the performance of your events.</p>
        </div>
        <Button className="bg-teal-800 hover:bg-teal-700 self-start sm:self-auto" onClick={() => navigate("/create-event")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black text-teal-950 mt-1">{stat.value}</p>
                  <p className="text-xs mt-2 flex items-center gap-1 font-medium text-teal-600"><ArrowUpRight size={13} />{stat.sub}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="space-y-5">
        <TabsList className="bg-teal-50 h-11 p-1 rounded-xl">
          <TabsTrigger value="bookings" className="rounded-lg font-semibold data-[state=active]:bg-white">
            Ticket Sales
            {visibleBookings.length > 0 && <span className="ml-2 bg-teal-800 text-white text-xs rounded-full px-2 py-0.5">{visibleBookings.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg font-semibold data-[state=active]:bg-white">
            Your Events ({organizerEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-teal-900">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {visibleBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/60">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="hidden md:table-cell">Qty</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleBookings.map((booking) => (
                      <TableRow key={booking.bookingId} className="hover:bg-teal-50/30 transition-colors">
                        <TableCell className="font-mono text-xs text-gray-400">{booking.bookingId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="bg-teal-800 text-white text-xs">{booking.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                            <span className="font-medium text-sm line-clamp-1">{booking.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-gray-500">x{booking.qty}</TableCell>
                        <TableCell className="font-semibold text-teal-900">{booking.price} EGP</TableCell>
                        <TableCell><StatusBadge status={booking.status} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setRemovedIds(new Set([...removedIds, booking.bookingId]))} className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove Row
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-16">
                  <TicketCheck className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                  <p className="text-gray-400 font-medium">No sales yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {organizerEvents.map((event) => {
              const bookedCount = confirmedBookings.filter((b) => b.eventId === event.id).reduce((s, b) => s + b.qty, 0);
              return (
                <Card key={event.id} className="border-none shadow-sm">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <StatusBadge status={event.status || "PENDING"} />
                        <h3 className="font-bold text-teal-950 mt-1">{event.title}</h3>
                      </div>
                      <p className="text-teal-900 font-bold text-sm">{event.price === 0 ? "Free" : `${event.price} EGP`}</p>
                    </div>
                    <CapacityBar booked={bookedCount} capacity={event.capacity} />
                    
                    {event.status === "APPROVED" && (
                      <div className="pt-4 border-t border-gray-100">
                        <Button 
                          onClick={() => handleCloseEvent(event.id)} 
                          variant="outline" 
                          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <ShieldX className="mr-2 h-4 w-4" /> Close Event
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}