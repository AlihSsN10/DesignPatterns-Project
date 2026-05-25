package com.college.eventbooking.repository;

import com.college.eventbooking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEventId(Long eventId);

    @org.springframework.transaction.annotation.Transactional
    void deleteByEventId(Long eventId);
}
