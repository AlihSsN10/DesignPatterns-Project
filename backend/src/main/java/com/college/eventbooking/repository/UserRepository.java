package com.college.eventbooking.repository;

import com.college.eventbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByCreatedAtAfter(java.time.LocalDateTime date);
    Optional<User> findByUsername(String username);
}
