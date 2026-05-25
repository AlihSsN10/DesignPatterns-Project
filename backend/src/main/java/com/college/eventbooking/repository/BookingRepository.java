package com.college.eventbooking.repository;

import com.college.eventbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByEventId(Long eventId);
    List<Booking> findByEventCreatorId(Long creatorId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.totalPrice) FROM Booking b")
    java.math.BigDecimal calculateTotalRevenue();

    @org.springframework.transaction.annotation.Transactional
    void deleteByEventId(Long eventId);
}
