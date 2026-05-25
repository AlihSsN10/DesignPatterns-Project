package com.college.eventbooking.controller;

import com.college.eventbooking.entity.Booking;
import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.User;
import com.college.eventbooking.pattern.composite.ITicketComponent;
import com.college.eventbooking.pattern.composite.SingleTicket;
import com.college.eventbooking.pattern.composite.TicketBundle;
import com.college.eventbooking.service.BookingService;
import com.college.eventbooking.service.EventService;
import com.college.eventbooking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;
    private final EventService eventService;

    public BookingController(BookingService bookingService, UserService userService, EventService eventService) {
        this.bookingService = bookingService;
        this.userService = userService;
        this.eventService = eventService;
    }

    // React calls this when a user clicks "Book Now"
    @PostMapping("/book")
    public ResponseEntity<Booking> bookTicket(
            @RequestParam Long userId,
            @RequestParam Long eventId,
            @RequestParam int quantity,
            @RequestParam boolean isBundle) {

        User user = userService.getUserById(userId);
        Event event = eventService.getEventById(eventId);
        
        ITicketComponent ticketComponent;
        
        // Use our Composite Pattern logic!
        if (isBundle && quantity > 1) {
            TicketBundle bundle = new TicketBundle();
            // Safeguard in case the event was created manually without a price
            java.math.BigDecimal basePrice = event.getPrice() != null ? event.getPrice() : java.math.BigDecimal.ZERO;

            // Let's say a bundle applies a 10% discount on each ticket
            java.math.BigDecimal discountedPrice = basePrice.multiply(new java.math.BigDecimal("0.90"));
            for (int i = 0; i < quantity; i++) {
                bundle.addTicket(new SingleTicket(discountedPrice));
            }
            ticketComponent = bundle;
        } else {
            java.math.BigDecimal basePrice = event.getPrice() != null ? event.getPrice() : java.math.BigDecimal.ZERO;
            ticketComponent = new SingleTicket(basePrice);
        }

        Booking booking = bookingService.bookTickets(user, event, quantity, ticketComponent);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<java.util.List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<java.util.List<Booking>> getBookingsByOrganizer(@PathVariable Long organizerId) {
        return ResponseEntity.ok(bookingService.getBookingsByOrganizer(organizerId));
    }
}
