import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { CalendarDays, MapPin, Tag, Users, AlignLeft, Globe, Image as ImageIcon } from "lucide-react";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, createEvent } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tickets: "",
    date: "",
    time: "",
    type: "WORKSHOP",
    location: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // If not logged in or not an organizer/admin
  if (!isLoggedIn || (user?.role !== "EVENT_CREATOR" && user?.role !== "ADMIN" && user?.role !== "ORGANIZER")) {
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p>You must be an organizer to create events.</p>
        <Button onClick={() => navigate("/")} className="mt-4 bg-teal-800">Go Home</Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.title || !formData.date || !formData.time || !formData.price || !formData.tickets || !formData.location) {
      toast.error("Please fill in all required fields (including location).");
      setSubmitting(false);
      return;
    }

    const dateStr = `${formData.date}T${formData.time}:00`;

    const res = await createEvent({
      ...formData,
      dateStr
    });

    if (res.success) {
      toast.success("Event created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(res.message || "Error creating event");
    }
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card className="border-none shadow-md">
        <CardHeader className="bg-teal-50/50 border-b border-teal-100/50 pb-8">
          <CardTitle className="text-3xl text-teal-950 font-black">Create a New Event</CardTitle>
          <CardDescription className="text-teal-700/80">Launch your next big gathering to the world.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Title *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Tag size={16} /></div>
                  <Input name="title" value={formData.title} onChange={handleChange} className="pl-10" placeholder="e.g. React Developers Summit" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full h-10 border border-gray-200 rounded-md px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="WORKSHOP">Workshop</option>
                  <option value="SEMINAR">Seminar</option>
                  <option value="CONCERT">Concert</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description *</label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400"><AlignLeft size={16} /></div>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full min-h-[100px] border border-gray-200 rounded-md p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="What is this event about?" required />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Cover Image URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><ImageIcon size={16} /></div>
                <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="pl-10" placeholder="e.g. https://images.unsplash.com/photo-123..." />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><CalendarDays size={16} /></div>
                  <Input type="date" name="date" value={formData.date} onChange={handleChange} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Time *</label>
                <Input type="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            {/* Price and Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ticket Price (EGP) *</label>
                <Input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 150.00 (Enter 0 for Free)" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Total Capacity (Tickets) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Users size={16} /></div>
                  <Input type="number" min="1" name="tickets" value={formData.tickets} onChange={handleChange} className="pl-10" placeholder="e.g. 500" required />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Physical Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><MapPin size={16} /></div>
                <Input name="location" value={formData.location} onChange={handleChange} className="pl-10" placeholder="e.g. Cairo International Convention Centre" required />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={submitting}>Cancel</Button>
              <Button type="submit" className="bg-teal-800 hover:bg-teal-700 px-8" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
