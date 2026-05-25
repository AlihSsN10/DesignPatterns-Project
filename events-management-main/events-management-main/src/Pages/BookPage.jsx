import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import {
  Heart, ShoppingCart, Search, MapPin,
  CalendarDays, Users, Tag, SlidersHorizontal, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "all",   label: "All" },
  { id: "cat-1", label: "Tech Conference" },
  { id: "cat-2", label: "Art Workshop" },
  { id: "cat-3", label: "Music & Festivals" },
  { id: "cat-4", label: "Cultural Seminar" },
];

export default function BookPage() {
  const navigate = useNavigate();
  const {
    events, isLoggedIn,
    cart, addToCart,
    wishlist, addToWishlist, removeFromWishlist,
  } = useApp();

  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("all");
  const [maxPrice, setMaxPrice]   = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const isInWishlist = (eventId) => wishlist.some((i) => i.id === eventId);
  const isInCart     = (eventId) => cart.some((i) => i.id === eventId);

  // ── Filtered events ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        !search ||
        ev.title.toLowerCase().includes(search.toLowerCase()) ||
        ev.location.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || ev.categoryId === category;
      const matchPrice    = !maxPrice || ev.price <= Number(maxPrice);
      return matchSearch && matchCategory && matchPrice;
    });
  }, [events, search, category, maxPrice]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAddToCart = (e, event) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    addToCart(event, 1);
    toast.success(`"${event.title}" added to cart`);
  };

  const handleToggleWishlist = (e, event) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to save to wishlist");
      navigate("/login");
      return;
    }
    if (isInWishlist(event.id)) {
      removeFromWishlist(event.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(event);
      toast.success("Added to wishlist");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMaxPrice("");
  };

  const hasActiveFilters = search || category !== "all" || maxPrice;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-teal-950">Browse Events</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((p) => !p)}
            className={showFilters ? "border-teal-600 text-teal-700" : ""}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 bg-teal-700 text-white text-xs rounded-full px-1.5">
                !
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 items-end">
            {/* Category */}
            <div className="space-y-1.5 min-w-[180px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Max price */}
            <div className="space-y-1.5 min-w-[150px]">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Max Price (EGP)
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.id
                  ? "bg-teal-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((event) => {
            const inWishlist = isInWishlist(event.id);
            const inCart     = isInCart(event.id);
            const dateStr    = new Date(event.dateTime).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <Card
                key={event.id}
                onClick={() => navigate(`/booking/${event.id}`)}
                className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-teal-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${event.id}/400/200`;
                    }}
                  />
                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, event)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={16}
                      className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-teal-800 text-white border-none shadow">
                      {event.price === 0 ? "Free" : `${event.price} EGP`}
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-4 pb-4 space-y-3">
                  <div>
                    <Badge className="bg-teal-50 text-teal-700 border-none text-xs mb-1.5">
                      {CATEGORIES.find((c) => c.id === event.categoryId)?.label ?? "Event"}
                    </Badge>
                    <h3 className="font-bold text-teal-950 leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
                      {event.title}
                    </h3>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={12} /> {dateStr}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} /> Capacity: {event.capacity}
                    </div>
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(e, event)}
                    disabled={inCart}
                    className={`w-full h-8 text-xs ${
                      inCart
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-teal-800 hover:bg-teal-700 text-white"
                    }`}
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    {inCart ? "Already in Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Tag className="mx-auto h-14 w-14 text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}