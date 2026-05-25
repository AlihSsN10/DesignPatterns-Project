import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-teal-50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              EM-<span className="text-teal-400">Booking</span>
            </h2>
            <p className="text-teal-200/70 text-sm leading-relaxed">
              The leading platform for discovering and booking events, workshops, and conferences. Making experiences accessible to everyone.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-teal-200/70">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link to="/booking" className="hover:text-teal-400 transition-colors">Browse Tickets</Link></li>
              <li><Link to="/reviews" className="hover:text-teal-400 transition-colors">Reviews</Link></li>
              <li><Link to="/signup" className="hover:text-teal-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm text-teal-200/70">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400" />
                <span>support@embooking.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-400" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-teal-400" />
                <span>New Cairo, Egypt</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-teal-900 p-2 rounded-full hover:bg-teal-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-teal-900 p-2 rounded-full hover:bg-teal-700 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-teal-900 p-2 rounded-full hover:bg-teal-700 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-teal-500">
          <p>© 2025 EM-Booking. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-300">Privacy Policy</a>
            <a href="#" className="hover:text-teal-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}