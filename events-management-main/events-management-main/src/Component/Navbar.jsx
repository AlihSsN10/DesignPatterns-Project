import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import {
  ShoppingCart, Heart, User, LogOut, LayoutDashboard,
  Menu, X, Ticket, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "Events",  to: "/booking" },
  { label: "Reviews", to: "/reviews" },
];

function Badge({ count }) {
  if (!count || count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, isLoggedIn, logout, cart, wishlist } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount    = cart.reduce((sum, i) => sum + i.qty, 0);
  const wishlistCount = wishlist.length;

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-teal-800 text-white p-1.5 rounded-lg">
              <Ticket size={18} />
            </div>
            <span className="font-black text-teal-950 text-xl tracking-tight">
              EM<span className="text-teal-600">-Booking</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-teal-50 text-teal-800"
                    : "text-gray-600 hover:text-teal-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (user?.role === "EVENT_CREATOR" || user?.role === "ADMIN") && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-teal-50 text-teal-800"
                    : "text-gray-600 hover:text-teal-800 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-1">

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 rounded-lg text-gray-500 hover:text-teal-800 hover:bg-gray-50 transition-colors"
              title="Wishlist"
            >
              <Heart size={20} />
              <Badge count={wishlistCount} />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-lg text-gray-500 hover:text-teal-800 hover:bg-gray-50 transition-colors"
              title="Cart"
            >
              <ShoppingCart size={20} />
              <Badge count={cartCount} />
            </button>

            {/* User menu or Login */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors ml-1">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-teal-800 text-white text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-semibold text-teal-950 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="font-semibold text-teal-950 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[11px] bg-teal-100 text-teal-700 rounded px-1.5 py-0.5 font-medium">
                      {user?.role}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  {(user?.role === "EVENT_CREATOR" || user?.role === "ADMIN") && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-teal-800"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="bg-teal-800 hover:bg-teal-700 font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden ml-1 p-2 rounded-lg text-gray-500 hover:bg-gray-50"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.to)
                    ? "bg-teal-50 text-teal-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (user?.role === "EVENT_CREATOR" || user?.role === "ADMIN") && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}