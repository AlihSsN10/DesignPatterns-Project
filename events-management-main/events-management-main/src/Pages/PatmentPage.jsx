import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import {
  CreditCard, Lock, CheckCircle2, ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function PatmentPage() {
  const navigate  = useNavigate();
  const { cart, checkout, isLoggedIn } = useApp();

  const [form, setForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [paid, setPaid]       = useState(false);

  const total    = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);

  // ── Guard ─────────────────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to continue with payment.</p>
        <Button onClick={() => navigate("/login")} className="bg-teal-800 hover:bg-teal-700">
          Login
        </Button>
      </div>
    );
  }

  if (cart.length === 0 && !paid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-200" />
        <p className="text-gray-500 font-medium">Your cart is empty.</p>
        <Button onClick={() => navigate("/booking")} className="bg-teal-800 hover:bg-teal-700">
          Browse Events
        </Button>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────────

  if (paid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="bg-green-100 p-6 rounded-full">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-teal-950">Payment Successful!</h1>
        <p className="text-gray-500 max-w-sm">
          Your booking is confirmed. Check your profile to view your tickets.
        </p>
        <div className="flex gap-3 mt-2">
          <Button onClick={() => navigate("/profile")} className="bg-teal-800 hover:bg-teal-700">
            View My Bookings
          </Button>
          <Button variant="outline" onClick={() => navigate("/booking")}>
            Browse More Events
          </Button>
        </div>
      </div>
    );
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!form.cardHolder.trim())
      e.cardHolder = "Cardholder name is required";
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Please enter a valid 16-digit card number";
    if (form.expiry.length < 5)
      e.expiry = "Please enter a valid expiry date (MM/YY)";
    if (form.cvv.length < 3)
      e.cvv = "CVV must be at least 3 digits";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(async () => {
      const result = await checkout();
      setLoading(false);
      if (result.success) {
        setPaid(true);
        toast.success("Payment confirmed!");
      } else {
        toast.error(result.message || "Checkout failed");
      }
    }, 1500);
  };

  const set = (field) => (e) => {
    let val = e.target.value;
    if (field === "cardNumber") val = formatCardNumber(val);
    if (field === "expiry")     val = formatExpiry(val);
    if (field === "cvv")        val = val.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-black text-teal-950 mb-8 flex items-center gap-2">
        <Lock size={24} className="text-teal-600" /> Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Payment form */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-teal-900 flex items-center gap-2">
                <CreditCard size={20} /> Card Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Card holder */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Cardholder Name
                  </label>
                  <Input
                    placeholder="Name as on card"
                    value={form.cardHolder}
                    onChange={set("cardHolder")}
                    className={errors.cardHolder ? "border-red-400" : ""}
                  />
                  {errors.cardHolder && (
                    <p className="text-xs text-red-500">{errors.cardHolder}</p>
                  )}
                </div>

                {/* Card number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Card Number
                  </label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={form.cardNumber}
                    onChange={set("cardNumber")}
                    inputMode="numeric"
                    className={errors.cardNumber ? "border-red-400" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-red-500">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Expiry Date
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={set("expiry")}
                      inputMode="numeric"
                      className={errors.expiry ? "border-red-400" : ""}
                    />
                    {errors.expiry && (
                      <p className="text-xs text-red-500">{errors.expiry}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">CVV</label>
                    <Input
                      placeholder="•••"
                      value={form.cvv}
                      onChange={set("cvv")}
                      inputMode="numeric"
                      type="password"
                      className={errors.cvv ? "border-red-400" : ""}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-800 hover:bg-teal-700 h-11 font-semibold mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ${total} EGP`
                  )}
                </Button>

                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                  <Lock size={11} /> Your payment is secured and encrypted
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-teal-900 text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-teal-950 line-clamp-1">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.qty} × {item.price} EGP</p>
                  </div>
                  <p className="font-semibold shrink-0">{item.price * item.qty} EGP</p>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm text-gray-500">
                <span>Tickets</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between font-black text-teal-950 text-lg">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}