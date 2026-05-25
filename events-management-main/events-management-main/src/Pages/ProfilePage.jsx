import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import {
  User, Ticket, Lock, LogOut, CheckCircle2,
  XCircle, Clock, CalendarDays, MapPin, Edit3,
  Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (status === "Confirmed")
    return (
      <Badge className="bg-green-100 text-green-700 border-none gap-1">
        <CheckCircle2 size={11} /> Confirmed
      </Badge>
    );
  if (status === "Cancelled")
    return (
      <Badge className="bg-red-100 text-red-600 border-none gap-1">
        <XCircle size={11} /> Cancelled
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-700 border-none gap-1">
      <Clock size={11} /> Pending
    </Badge>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, bookings, cancelBooking, updateProfile, changePassword } = useApp();

  // ── Edit profile state ────────────────────────────────────────────────────
  const [editForm, setEditForm]   = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // ── Change password state ─────────────────────────────────────────────────
  const [pwForm, setPwForm]     = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);

  // ── All hooks before early return ─────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <User className="h-16 w-16 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Please login to view your profile</h2>
        <Button onClick={() => navigate("/login")} className="bg-teal-800 hover:bg-teal-700">
          Login
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId);
    toast.success("Booking cancelled");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!editForm.name.trim() || editForm.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    setEditLoading(true);
    setTimeout(() => {
      updateProfile({ name: editForm.name.trim(), phone: editForm.phone.trim() });
      setEditLoading(false);
      toast.success("Profile updated successfully");
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current) errs.current = "Current password is required";
    if (pwForm.next.length < 6) errs.next = "New password must be at least 6 characters";
    if (pwForm.next !== pwForm.confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setPwLoading(true);
    setTimeout(() => {
      const result = changePassword(pwForm.current, pwForm.next);
      setPwLoading(false);
      if (result.success) {
        toast.success("Password changed successfully");
        setPwForm({ current: "", next: "", confirm: "" });
        setPwErrors({});
      } else {
        setPwErrors({ current: result.message });
      }
    }, 600);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">

      {/* Profile header card */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarFallback className="bg-teal-800 text-white text-2xl font-black">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-teal-950">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-teal-100 text-teal-800 border-none">
                  {user.role}
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-none">
                  {confirmedCount} Confirmed
                </Badge>
                <Badge className="bg-red-100 text-red-600 border-none">
                  {cancelledCount} Cancelled
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 shrink-0"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="bookings">
        <TabsList className="bg-teal-50 h-11 p-1 rounded-xl">
          <TabsTrigger value="bookings" className="rounded-lg font-semibold data-[state=active]:bg-white gap-1.5">
            <Ticket size={15} /> My Bookings
            {bookings.length > 0 && (
              <span className="bg-teal-800 text-white text-xs rounded-full px-1.5 py-0.5">
                {bookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="edit" className="rounded-lg font-semibold data-[state=active]:bg-white gap-1.5">
            <Edit3 size={15} /> Edit Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-lg font-semibold data-[state=active]:bg-white gap-1.5">
            <Lock size={15} /> Password
          </TabsTrigger>
        </TabsList>

        {/* ── My Bookings ── */}
        <TabsContent value="bookings" className="mt-5">
          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <Ticket className="mx-auto h-14 w-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">
                Browse events and book your first ticket!
              </p>
              <Button
                onClick={() => navigate("/booking")}
                className="bg-teal-800 hover:bg-teal-700"
              >
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...bookings].reverse().map((booking) => (
                <Card key={booking.bookingId} className="border-none shadow-sm">
                  <CardContent className="p-4 flex gap-4 items-center">
                    {/* Image */}
                    <img
                      src={booking.img}
                      alt={booking.name}
                      className="h-16 w-24 object-cover rounded-lg shrink-0 bg-teal-100"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${booking.eventId}/200/100`;
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-teal-950 line-clamp-1">{booking.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} /> {booking.date}
                        </span>
                        <span>{booking.qty} ticket{booking.qty !== 1 ? "s" : ""}</span>
                        <span className="font-semibold text-teal-700">{booking.price} EGP</span>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    {/* Cancel button */}
                    {booking.status === "Confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 shrink-0"
                      >
                        Cancel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Edit Profile ── */}
        <TabsContent value="edit" className="mt-5">
          <Card className="border-none shadow-sm max-w-lg">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center gap-2">
                <Edit3 size={18} /> Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSubmit} className="space-y-4">

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => {
                      setEditForm((p) => ({ ...p, name: e.target.value }));
                      setEditErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="Your full name"
                    className={editErrors.name ? "border-red-400" : ""}
                  />
                  {editErrors.name && (
                    <p className="text-xs text-red-500">{editErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="e.g. 01012345678"
                    inputMode="tel"
                  />
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Role</label>
                  <Input value={user.role} disabled className="bg-gray-50 text-gray-400" />
                </div>

                <Button
                  type="submit"
                  disabled={editLoading}
                  className="bg-teal-800 hover:bg-teal-700 w-full"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Change Password ── */}
        <TabsContent value="password" className="mt-5">
          <Card className="border-none shadow-sm max-w-lg">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center gap-2">
                <ShieldCheck size={18} /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">

                {/* Current password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      value={pwForm.current}
                      onChange={(e) => {
                        setPwForm((p) => ({ ...p, current: e.target.value }));
                        setPwErrors((p) => ({ ...p, current: undefined }));
                      }}
                      placeholder="Enter current password"
                      className={`pr-10 ${pwErrors.current ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwErrors.current && (
                    <p className="text-xs text-red-500">{pwErrors.current}</p>
                  )}
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNext ? "text" : "password"}
                      value={pwForm.next}
                      onChange={(e) => {
                        setPwForm((p) => ({ ...p, next: e.target.value }));
                        setPwErrors((p) => ({ ...p, next: undefined }));
                      }}
                      placeholder="At least 6 characters"
                      className={`pr-10 ${pwErrors.next ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNext((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwErrors.next && (
                    <p className="text-xs text-red-500">{pwErrors.next}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => {
                      setPwForm((p) => ({ ...p, confirm: e.target.value }));
                      setPwErrors((p) => ({ ...p, confirm: undefined }));
                    }}
                    placeholder="Repeat new password"
                    className={pwErrors.confirm ? "border-red-400" : ""}
                  />
                  {pwErrors.confirm && (
                    <p className="text-xs text-red-500">{pwErrors.confirm}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-teal-800 hover:bg-teal-700 w-full"
                >
                  {pwLoading ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}