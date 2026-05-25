package com.college.eventbooking.controller;

import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.User;
import com.college.eventbooking.pattern.factory.EventFactory;
import com.college.eventbooking.pattern.factory.WorkshopEventFactory;
import com.college.eventbooking.pattern.factory.SeminarEventFactory;
import com.college.eventbooking.pattern.factory.ConcertEventFactory;
import com.college.eventbooking.service.EventService;
import com.college.eventbooking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // Allows your React app to call this API
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    // React calls this to display events on the homepage
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId));
    }

    // React calls this when an Event Creator submits the "Create Event" form
    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(
            @RequestParam String type,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String dateStr,
            @RequestParam BigDecimal price,
            @RequestParam int tickets,
            @RequestParam Long creatorId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String imageUrl) {
        
        User creator = userService.getUserById(creatorId);
        LocalDateTime dateTime = LocalDateTime.parse(dateStr);
        
        // Choose the correct factory based on the request!
        EventFactory factory;
        if ("SEMINAR".equalsIgnoreCase(type)) {
            factory = new SeminarEventFactory();
        } else if ("CONCERT".equalsIgnoreCase(type)) {
            factory = new ConcertEventFactory();
        } else {
            factory = new WorkshopEventFactory(); // default
        }

        Event newEvent = eventService.createEvent(factory, title, description, dateTime, price, tickets, creator, imageUrl);
        // All events are now physical, so ensure location is set
        newEvent.setLocation(location);
        return ResponseEntity.ok(newEvent);
    }

    // React calls this when an Organizer wants to close their event
    @PutMapping("/{eventId}/close")
    public ResponseEntity<?> closeEvent(@PathVariable Long eventId, @RequestParam Long organizerId) {
        Event event = eventService.getEventById(eventId);
        if (!event.getCreator().getId().equals(organizerId)) {
            return ResponseEntity.status(403).body(java.util.Map.of("error", "Access Denied: You do not own this event"));
        }
        event.setStatus("CLOSED");
        eventService.saveEvent(event);
        return ResponseEntity.ok(java.util.Map.of("message", "Event successfully closed"));
    }
}
