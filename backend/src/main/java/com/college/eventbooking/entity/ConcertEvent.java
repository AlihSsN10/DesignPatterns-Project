package com.college.eventbooking.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CONCERT")
public class ConcertEvent extends Event {
    // In a real application, you might add concert-specific fields here (e.g. bandName)
}
