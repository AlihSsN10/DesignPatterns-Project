package com.college.eventbooking.pattern.factory;

import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface EventFactory {
    Event createEvent(String title, String description, LocalDateTime dateTime, BigDecimal price, int totalTickets, User creator, String imageUrl);
}
