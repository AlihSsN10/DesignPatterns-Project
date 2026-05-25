import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import {
  Calendar, MapPin, Clock, Users,
  ChevronLeft, HeartIcon, TicketIcon, Star, Send, MessageSquare
} from "lucide-react";

const CATEGORY_LABELS = {
  "cat-1": "Tech Conference",
  "cat-2": "Art Workshop",
  "cat-3": "Music & Festivals",
  "cat-4": "Cultural Seminar",
};

// ── Star Rating Component ──────────────────────────────────────────────────────
function StarRating({ value, onChange, size = 24 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={size}
            className={star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-teal-800 text-white font-bold">
                {review.userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-teal-950 text-sm">{review.userName}</p>
              <p className="text-xs text-gray-400">{review.date}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
      </CardContent>
    </Card>
  );
}

export default function BookDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, addToCart, addToWishlist, removeFromWishlist, isInWishlist, isInCart, reviews, addReview } = useApp();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!state?.event) {
    return (
      <div className="container mx-auto p-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <TicketIcon className="mx-auto h-12 w-12 text-gray-200 mb-4" />
        <p className="text-gray-500 font-semibold mb-4">No event selected.</p>
        <Link to="/booking">
          <Button className="bg-teal-800 hover:bg-teal-700">Browse Events</Button>
        </Link>
      </div>
    );
  }

  const event = state.event;
  const inCart = isInCart(event.id);
  const inWishlist = isInWishlist(event.id);

  const dateObj = new Date(event.dateTime);
  const dateStr = dateObj.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const eventReviews = reviews.filter(r => r.eventName === event.title);

  const handleAddToCart = () => {
    addToCart({ id: event.id, name: event.title, price: event.price, img: event.image });
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(event.id);
    } else {
      addToWishlist({ id: event.id, name: event.title, price: event.price, img: event.image });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to leave a review");
      navigate("/login");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    await addReview({
      userName: user.name,
      rating,
      comment: comment.trim(),
      eventName: event.title,
    });
    
    toast.success("Review submitted — thank you!");
    setRating(0);
    setComment("");
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-12">
      
      {/* ── Event Details Section ── */}
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-teal-700 hover:bg-teal-50">
          <ChevronLeft size={18} className="mr-1" /> Back to Events
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <img src={event.image} alt={event.title} className="rounded-3xl shadow-xl h-80 w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"; }} />
            {event.price === 0 && (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white border-none px-3 py-1">Free Entry</Badge>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <Badge className="bg-teal-100 text-teal-800 border-none mb-3">{CATEGORY_LABELS[event.categoryId] ?? "Event"}</Badge>
              <h1 className="text-3xl font-bold text-teal-950 leading-tight">{event.title}</h1>
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-3"><div className="bg-teal-50 p-2 rounded-xl"><Calendar size={16} className="text-teal-700" /></div><span className="text-sm">{dateStr}</span></div>
              <div className="flex items-center gap-3"><div className="bg-teal-50 p-2 rounded-xl"><Clock size={16} className="text-teal-700" /></div><span className="text-sm">{timeStr}</span></div>
              <div className="flex items-center gap-3"><div className="bg-teal-50 p-2 rounded-xl"><MapPin size={16} className="text-teal-700" /></div><span className="text-sm">{event.location}</span></div>
              <div className="flex items-center gap-3"><div className="bg-teal-50 p-2 rounded-xl"><Users size={16} className="text-teal-700" /></div><span className="text-sm">{event.capacity} tickets</span></div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{event.description}</p>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
              <p className="text-xs text-teal-600 font-medium mb-1">Ticket Price</p>
              <p className="text-3xl font-black text-teal-900">{event.price === 0 ? "Free" : `${event.price} EGP`}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={inCart} className="flex-1 bg-teal-800 hover:bg-teal-700 py-6 text-base rounded-2xl disabled:opacity-60">
                <TicketIcon className="mr-2 h-5 w-5" />{inCart ? "Already in Cart" : "Book My Spot"}
              </Button>
              <Button variant="outline" onClick={handleWishlist} className={`px-5 py-6 rounded-2xl border-2 transition-colors ${inWishlist ? "border-red-200 bg-red-50 hover:bg-red-100" : "border-teal-200 hover:bg-teal-50"}`} title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}>
                <HeartIcon className={`h-5 w-5 transition-all ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </Button>
            </div>
            {inCart && <p className="text-xs text-center text-teal-600">This event is in your cart. <Link to="/cart" className="font-bold underline">View Cart</Link></p>}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div className="border-t border-gray-100 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Write Review Form */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-teal-900 flex items-center gap-2">
                  <MessageSquare size={20} /> Leave a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-gray-500 text-sm">You need to be logged in to leave a review.</p>
                    <Button onClick={() => navigate("/login")} className="bg-teal-800 hover:bg-teal-700 w-full">Login to Review</Button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Rating</label>
                      <StarRating value={rating} onChange={setRating} size={28} />
                      {rating > 0 && <p className="text-xs text-teal-600 font-medium">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Comment</label>
                      <textarea
                        value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
                        placeholder="Share your experience about this event..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="text-xs text-gray-400 text-right">{comment.length} / 300</p>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-teal-800 hover:bg-teal-700">
                      <Send className="mr-2 h-4 w-4" /> Submit Review
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Event Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-teal-950">
                Event Reviews <span className="text-gray-400 text-base font-normal">({eventReviews.length})</span>
              </h2>
            </div>
            
            {eventReviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <Star className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No reviews for this event yet.</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}