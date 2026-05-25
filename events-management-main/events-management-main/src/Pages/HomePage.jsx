import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import img from "@/assets/em.jpg";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full font-sans">
      
      {/* 1. Hero Section - Engaging Top Part */}
      <section className="relative bg-teal-900 text-white py-20 px-6 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <Badge className="bg-teal-500 hover:bg-teal-500 text-white px-4 py-1">
              Explore 2025 Events
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Book Your Next Experience <br /> 
              <span className="text-teal-400">With One Click</span>
            </h1>
            <p className="text-teal-100 text-lg max-w-xl mx-auto md:ml-0">
              Your premier platform to discover and book tickets for workshops, 
              tech conferences, and music festivals all in one secure place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/booking">
                <Button size="lg" className="bg-white text-teal-900 hover:bg-teal-50 font-bold px-8">
                  Browse Tickets
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-white  hover:bg-white text-teal-900">
                  Join Us Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-teal-500/20 rounded-full blur-3xl"></div>
              <img 
                src={img} 
                alt="Event Hero" 
                className="relative z-10 rounded-2xl shadow-2xl border-4 border-teal-800/50 transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section - Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <div className="h-1.5 w-20 bg-teal-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Secure Payments", desc: "100% encrypted and secure transactions to protect your data." },
              { icon: <Calendar className="w-8 h-8" />, title: "Diverse Events", desc: "We cover everything from educational workshops to major festivals." },
              { icon: <Users className="w-8 h-8" />, title: "24/7 Support", desc: "Our dedicated support team is always available to help you." }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-none text-center hover:bg-teal-50 transition-colors p-6 group">
                <CardContent className="pt-6">
                  <div className="bg-teal-100 text-teal-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Static Stats Section */}
      <section className="py-16 bg-teal-50 border-y border-teal-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-teal-800">+10k</p>
              <p className="text-gray-600 font-medium">Tickets Sold</p>
            </div>
            <div>
              <p className="text-4xl font-black text-teal-800">+500</p>
              <p className="text-gray-600 font-medium">Events Hosted</p>
            </div>
            <div>
              <p className="text-4xl font-black text-teal-800">+50</p>
              <p className="text-gray-600 font-medium">Top Organizers</p>
            </div>
            <div>
              <p className="text-4xl font-black text-teal-800">4.9/5</p>
              <p className="text-gray-600 font-medium">User Rating</p>
            </div>
          </div>
        </div>
      </section>

     

    </div>
  );
}