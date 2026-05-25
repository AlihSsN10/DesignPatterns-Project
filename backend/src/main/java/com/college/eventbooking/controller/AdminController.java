package com.college.eventbooking.controller;

import com.college.eventbooking.entity.Role;
import com.college.eventbooking.entity.User;
import com.college.eventbooking.repository.BookingRepository;
import com.college.eventbooking.repository.EventRepository;
import com.college.eventbooking.repository.UserRepository;
import com.college.eventbooking.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public AdminController(UserRepository userRepository, EventRepository eventRepository, BookingRepository bookingRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats(@RequestParam Long adminId) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(Map.of("error", "Access Denied: Admin privileges required"));
        }

        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalBookings = bookingRepository.count();

        // New Metrics
        java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
        long newUsers30Days = userRepository.countByCreatedAtAfter(thirtyDaysAgo);
        long activeEvents = eventRepository.countByDateTimeAfter(java.time.LocalDateTime.now());
        
        java.math.BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = java.math.BigDecimal.ZERO;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalEvents", totalEvents);
        stats.put("totalBookings", totalBookings);
        stats.put("newUsers30Days", newUsers30Days);
        stats.put("activeEvents", activeEvents);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reports")
    public ResponseEntity<?> generateReport(@RequestParam Long adminId, @RequestParam String format) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied: Admin privileges required");
        }

        java.util.List<com.college.eventbooking.entity.Event> events = eventRepository.findAll();
        com.college.eventbooking.pattern.template.ReportGenerator generator;

        if ("csv".equalsIgnoreCase(format)) {
            generator = new com.college.eventbooking.pattern.template.CsvReportGenerator();
        } else {
            generator = new com.college.eventbooking.pattern.template.PdfReportGenerator();
        }

        String report = generator.generateReport(events);
        return ResponseEntity.ok(report);
    }

    // --- EVENT MODERATION PIPELINE ---

    @GetMapping("/events")
    public ResponseEntity<?> getAllSystemEvents(@RequestParam Long adminId) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied");
        }
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PutMapping("/events/{eventId}/approve")
    public ResponseEntity<?> approveEvent(@PathVariable Long eventId, @RequestParam Long adminId) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied");
        }
        return eventRepository.findById(eventId).map(event -> {
            event.setStatus("APPROVED");
            eventRepository.save(event);
            return ResponseEntity.ok(Map.of("message", "Event approved successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId, @RequestParam Long adminId) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied");
        }
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }

        // IMPORTANT: Because of MySQL Foreign Keys, we MUST delete all child records before deleting the active event
        reviewRepository.deleteByEventId(eventId);
        bookingRepository.deleteByEventId(eventId);

        eventRepository.deleteById(eventId);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}
