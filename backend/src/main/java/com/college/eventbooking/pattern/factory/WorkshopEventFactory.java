package com.college.eventbooking.pattern.factory;

import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.WorkshopEvent;
import com.college.eventbooking.entity.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WorkshopEventFactory implements EventFactory {
    @Override
    public Event createEvent(String title, String description, LocalDateTime dateTime, BigDecimal price, int tickets, User creator, String imageUrl) {
        WorkshopEvent event = new WorkshopEvent();
        event.setTitle(title);
        event.setDescription(description);
        event.setDateTime(dateTime);
        event.setPrice(price);
        event.setTotalTickets(tickets);
        event.setAvailableTickets(tickets);
        event.setCreator(creator);
        event.setImageUrl(imageUrl);
        return event;
    }
}
