import React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/useApp";import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart } = useApp();

  return (
    <div className="container mx-auto p-6 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-teal-950 mb-8 flex items-center gap-2">
        <Heart className="fill-red-500 text-red-500" /> Wishlist
      </h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all">
              <img src={item.img} className="w-full h-48 object-cover" alt={item.name} />
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-xl text-teal-900">{item.name}</h3>
                <p className="text-teal-700 font-semibold">{item.price} EGP</p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => moveToCart(item)} className="flex-1 bg-teal-800 hover:bg-teal-700 rounded-xl">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                  </Button>
                  <Button variant="outline" onClick={() => removeFromWishlist(item.id)} className="border-red-100 text-red-500 hover:bg-red-50 rounded-xl">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="mx-auto h-16 w-16 text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium mb-4">Your wishlist is empty</p>
          <Link to="/booking">
            <Button variant="ghost" className="text-teal-700 hover:bg-teal-50 rounded-xl">Browse Events</Button>
          </Link>
        </div>
      )}
    </div>
  );
}