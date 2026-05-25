package com.college.eventbooking.service;

import com.college.eventbooking.entity.Booking;
import com.college.eventbooking.entity.Event;
import com.college.eventbooking.entity.User;
import com.college.eventbooking.pattern.composite.ITicketComponent;
import com.college.eventbooking.repository.BookingRepository;
import com.college.eventbooking.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
    }

    public java.util.List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public java.util.List<Booking> getBookingsByOrganizer(Long organizerId) {
        return bookingRepository.findByEventCreatorId(organizerId);
    }

    @Transactional
    public Booking bookTickets(User user, Event event, int quantity, ITicketComponent ticketComponent) {
        if (event.getAvailableTickets() < quantity) {
            throw new RuntimeException("Not enough tickets available");
        }

        // Use Composite Pattern to get the price (whether single or bundle)
        java.math.BigDecimal totalPrice = ticketComponent.getPrice();

        // Update available tickets
        event.setAvailableTickets(event.getAvailableTickets() - quantity);
        eventRepository.save(event);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(quantity);
        booking.setTotalPrice(ticketComponent.getPrice());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }
}
