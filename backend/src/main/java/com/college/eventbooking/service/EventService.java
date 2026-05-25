package com.college.eventbooking.service;

import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.User;
import com.college.eventbooking.pattern.factory.EventFactory;
import com.college.eventbooking.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findByStatus("APPROVED");
    }

    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByCreatorId(organizerId);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // Uses the Factory Pattern to create the event!
    public Event createEvent(EventFactory factory, String title, String description, LocalDateTime dateTime, BigDecimal price, int tickets, User creator, String imageUrl) {
        Event event = factory.createEvent(title, description, dateTime, price, tickets, creator, imageUrl);
        return eventRepository.save(event);
    }

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }
}
