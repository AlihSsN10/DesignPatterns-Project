import React from 'react'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function TicketSearch({ value, onChange }) {
  return (
    <div className="relative w-full mt-4 mb-8">
      {/* أيقونة البحث */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      {/* حقل الإدخال */}
      <Input
        type="text"
        placeholder=' Search for events, tickets, venues...'
        className="pl-10 focus-visible:ring-teal-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}