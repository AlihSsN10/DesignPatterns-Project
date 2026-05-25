import React, { useState, useEffect, useCallback } from "react";
import { AppContext } from "./appContextInstance";

const API_BASE = "http://localhost:8080/api";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [user, setUser]         = useState(() => load("em_user", null));
  const [events, setEvents]     = useState([]);
  const [cart, setCart]         = useState(() => load("em_cart", []));
  const [wishlist, setWishlist] = useState(() => load("em_wishlist", []));
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews]   = useState([]);

  const isLoggedIn = Boolean(user);

  useEffect(() => { localStorage.setItem("em_user",     JSON.stringify(user));     }, [user]);
  useEffect(() => { localStorage.setItem("em_cart",     JSON.stringify(cart));     }, [cart]);
  useEffect(() => { localStorage.setItem("em_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  // Fetch Events from Spring Boot
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) {
        const data = await res.json();
        // Map backend events to frontend expected structure
        const mappedEvents = data.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          price: e.price,
          image: e.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          categoryId: "cat-1",
          dateTime: e.dateTime,
          location: e.location || "Online",
          capacity: e.totalTickets
        }));
        setEvents(mappedEvents);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  }, []);

  // Fetch Bookings from Spring Boot
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const mappedBookings = data.map(b => ({
          bookingId: b.id.toString(),
          eventId: b.event.id,
          name: b.event.title,
          price: b.totalPrice,
          qty: b.quantity,
          date: b.bookingDate,
          status: b.status
        }));
        setBookings(mappedBookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, [user]);

  // Fetch Reviews from Spring Boot
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) {
        const data = await res.json();
        const mappedReviews = data.map(r => ({
          id: r.id.toString(),
          userName: r.user.username,
          userInitials: r.user.username.substring(0, 2).toUpperCase(),
          rating: r.rating,
          comment: r.comment,
          eventName: r.event.title,
          date: r.createdAt
        }));
        setReviews(mappedReviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchReviews();
  }, [fetchEvents, fetchReviews]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  // ── Auth ─────────────────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const userData = await res.json();
        // Map backend user to frontend expected structure
        setUser({
          id: userData.id,
          name: userData.username,
          email: userData.email,
          role: userData.role
        });
        return { success: true, role: userData.role };
      }
      return { success: false, message: "Invalid email or password" };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setBookings([]);
  }, []);

  const register = useCallback(async (data) => {
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role
        })
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({
          id: userData.id,
          name: userData.username,
          email: userData.email,
          role: userData.role
        });
        return { success: true };
      }
      const errorText = await res.text();
      return { success: false, message: errorText || "Registration failed." };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  }, []);

  const updateProfile = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const changePassword = useCallback((currentPassword, newPassword) => {
    if (user?.password !== currentPassword)
      return { success: false, message: "Current password is incorrect" };
    setUser((prev) => ({ ...prev, password: newPassword }));
    return { success: true };
  }, [user]);

  // ── Cart & Wishlist ─────────────────────────────────────────────────────────

  const addToCart = useCallback((event, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === event.id);
      if (existing) {
        return prev.map((i) => i.id === event.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { id: event.id, name: event.title, price: event.price, img: event.image, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => { setCart((prev) => prev.filter((i) => i.id !== id)); }, []);
  const updateCartQty = useCallback((id, qty) => { if (qty < 1) return; setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i))); }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const addToWishlist = useCallback((event) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === event.id)) return prev;
      return [...prev, { id: event.id, name: event.title, price: event.price, img: event.image }];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => { setWishlist((prev) => prev.filter((i) => i.id !== id)); }, []);
  const moveToCart = useCallback((item) => {
    addToCart({ id: item.id, title: item.name, price: item.price, image: item.img }, 1);
    removeFromWishlist(item.id);
  }, [addToCart, removeFromWishlist]);

  // ── Bookings ──────────────────────────────────────────────────────────────────

  const checkout = useCallback(async () => {
    if (!cart.length) return { success: false, message: "Cart is empty" };
    if (!user) return { success: false, message: "Please login first" };
    
    try {
      // Create a booking request for each item in the cart
      for (const item of cart) {
        const isBundle = item.qty > 1;
        const res = await fetch(`${API_BASE}/bookings/book?userId=${user.id}&eventId=${item.id}&quantity=${item.qty}&isBundle=${isBundle}`, {
          method: "POST"
        });
        if (!res.ok) {
            throw new Error("Backend rejected the checkout");
        }
      }
      setCart([]);
      fetchBookings(); // Refresh bookings from backend
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to checkout" };
    }
  }, [cart, user, fetchBookings]);

  const cancelBooking = useCallback((bookingId) => {
    // Ideally this would hit a backend /cancel endpoint. Mocking for now as it's not in the backend.
    setBookings((prev) => prev.map((b) => b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b));
  }, []);

  // ── Reviews ───────────────────────────────────────────────────────────────────

  const addReview = useCallback(async (reviewData) => {
    if (!user) return { success: false, message: "Must be logged in" };
    try {
      // Find the event ID based on the eventName passed by the frontend
      const targetEvent = events.find(e => e.title === reviewData.eventName);
      if (!targetEvent) return { success: false, message: "Event not found" };

      const res = await fetch(`${API_BASE}/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: user.id },
          event: { id: targetEvent.id },
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });
      if (res.ok) {
        fetchReviews(); // Refresh reviews from backend
        return { success: true };
      }
      return { success: false, message: "Failed to post review" };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  }, [user, events, fetchReviews]);

  // ── Events ────────────────────────────────────────────────────────────────────

  const createEvent = useCallback(async (eventData) => {
    if (!user) return { success: false, message: "Must be logged in" };
    try {
      const params = new URLSearchParams({
        type: eventData.type,
        title: eventData.title,
        description: eventData.description,
        dateStr: eventData.dateStr,
        price: eventData.price,
        tickets: eventData.tickets,
        creatorId: user.id
      });
      if (eventData.location) {
        params.append("location", eventData.location);
      }
      if (eventData.imageUrl) {
        params.append("imageUrl", eventData.imageUrl);
      }

      const res = await fetch(`${API_BASE}/events/create?${params.toString()}`, {
        method: "POST"
      });
      
      if (res.ok) {
        fetchEvents();
        return { success: true };
      }
      return { success: false, message: "Failed to create event" };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  }, [user, fetchEvents]);

  // ── Context value ─────────────────────────────────────────────────────────────

  const value = {
    user, isLoggedIn, login, logout, register, updateProfile, changePassword,
    events, createEvent,
    cart, addToCart, removeFromCart, updateCartQty, clearCart,
    wishlist, addToWishlist, removeFromWishlist, moveToCart,
    bookings, checkout, cancelBooking,
    reviews, addReview,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}