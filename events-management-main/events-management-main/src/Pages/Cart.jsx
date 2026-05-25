import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, clearCart, isLoggedIn } = useApp();

  const total    = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="h-16 w-16 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Please login to view your cart</h2>
        <Button onClick={() => navigate("/login")} className="bg-teal-800 hover:bg-teal-700">
          Login
        </Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="h-16 w-16 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add some events to get started</p>
        <Button onClick={() => navigate("/booking")} className="bg-teal-800 hover:bg-teal-700">
          Browse Events
        </Button>
      </div>
    );
  }

  const handleRemove = (item) => {
    removeFromCart(item.id);
    toast.success(`"${item.name}" removed from cart`);
  };

  const handleClear = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-teal-950">
          Your Cart
          <span className="text-base font-normal text-gray-400 ml-2">
            ({quantity} ticket{quantity !== 1 ? "s" : ""})
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1.5" /> Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <Card key={item.id} className="border-none shadow-sm">
              <CardContent className="p-4 flex gap-4 items-center">
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-20 w-28 object-cover rounded-lg shrink-0 bg-teal-100"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${item.id}/200/100`;
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-teal-950 line-clamp-1">{item.name}</h3>
                  <p className="text-teal-700 font-semibold text-sm mt-0.5">
                    {item.price} EGP / ticket
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Subtotal: {item.price * item.qty} EGP
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateCartQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold text-teal-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.id, item.qty + 1)}
                    className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-400 hover:text-red-600 transition-colors ml-2 shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm sticky top-24">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-teal-950">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="line-clamp-1 flex-1 mr-2">{item.name} × {item.qty}</span>
                    <span className="shrink-0 font-medium">{item.price * item.qty} EGP</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-black text-teal-950 text-lg">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>

              <Button
                onClick={() => navigate("/payment")}
                className="w-full bg-teal-800 hover:bg-teal-700 h-11 font-semibold"
              >
                Checkout Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/booking")}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}