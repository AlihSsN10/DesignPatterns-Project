import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Star, Send, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

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
            className={
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────

function ReviewCard({ review }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
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
          <Badge className="bg-teal-50 text-teal-800 border-none text-xs shrink-0">
            {review.eventName}
          </Badge>
        </div>

        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={
                s <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200"
              }
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
      </CardContent>
    </Card>
  );
}

// ── Reviews Page ──────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, bookings, reviews, addReview } = useApp();

  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [eventName, setEventName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Unique confirmed event names from bookings
  const bookedEvents = [
    ...new Set(
      bookings
        .filter((b) => b.status === "Confirmed")
        .map((b) => b.name)
    ),
  ];

  const handleSubmit = (e) => {
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
    if (!eventName) {
      toast.error("Please select an event");
      return;
    }

    setSubmitting(true);

    addReview({
      userName: user.name,
      rating,
      comment: comment.trim(),
      eventName,
    });

    toast.success("Review submitted — thank you!");
    setRating(0);
    setComment("");
    setEventName("");
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-10">

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-teal-950">Reviews</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Share your experience and read what others are saying about our events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Submit Form ── */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center gap-2">
                <MessageSquare size={20} /> Write a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoggedIn ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-gray-500 text-sm">
                    You need to be logged in to leave a review.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-teal-800 hover:bg-teal-700 w-full"
                  >
                    Login to Review
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Event selector */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Event
                    </label>
                    {bookedEvents.length > 0 ? (
                      <select
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="">Select an event you attended</option>
                        {bookedEvents.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-3">
                        You have no confirmed bookings yet.{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/booking")}
                          className="underline font-semibold"
                        >
                          Browse events
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Star rating */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Rating
                    </label>
                    <StarRating value={rating} onChange={setRating} size={28} />
                    {rating > 0 && (
                      <p className="text-xs text-teal-600 font-medium">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {comment.length} / 300
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || bookedEvents.length === 0}
                    className="w-full bg-teal-800 hover:bg-teal-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Reviews List ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-teal-950">
              All Reviews
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({reviews.length})
              </span>
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
                <Star size={16} className="fill-amber-400" />
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                <span className="text-gray-400 font-normal">avg rating</span>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Star className="mx-auto h-14 w-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}