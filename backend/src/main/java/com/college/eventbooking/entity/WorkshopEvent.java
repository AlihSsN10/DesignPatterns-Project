package com.college.eventbooking.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("WORKSHOP")
public class WorkshopEvent extends Event {
    // In a real application, you might add workshop-specific fields here (e.g. materialsRequired)
}
