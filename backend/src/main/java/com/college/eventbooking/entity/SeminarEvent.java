package com.college.eventbooking.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SEMINAR")
public class SeminarEvent extends Event {
    // In a real application, you might add seminar-specific fields here (e.g. speakerName)
}
