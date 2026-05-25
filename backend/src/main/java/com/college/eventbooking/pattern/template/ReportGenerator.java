package com.college.eventbooking.pattern.template;

import com.college.eventbooking.entity.Event;
import java.util.List;

public abstract class ReportGenerator {
    
    // The Template Method (final so it cannot be overridden)
    public final String generateReport(List<Event> events) {
        String rawData = fetchStatistics(events);
        String formattedData = formatData(rawData);
        return exportReport(formattedData);
    }

    // Common implementation
    private String fetchStatistics(List<Event> events) {
        int totalEvents = events.size();
        int totalTicketsSold = events.stream()
                .mapToInt(e -> e.getTotalTickets() - e.getAvailableTickets())
                .sum();
        return "Total Events: " + totalEvents + ", Total Tickets Sold: " + totalTicketsSold;
    }

    // Abstract methods to be implemented by subclasses
    protected abstract String formatData(String rawData);
    protected abstract String exportReport(String formattedData);
}
