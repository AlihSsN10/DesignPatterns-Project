package com.college.eventbooking.repository;

import com.college.eventbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(String status);
    List<Event> findByCreatorId(Long creatorId);
    long countByDateTimeAfter(java.time.LocalDateTime date);
}
