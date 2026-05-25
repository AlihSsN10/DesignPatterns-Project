package com.college.eventbooking.pattern.composite;

import java.math.BigDecimal;

public class SingleTicket implements ITicketComponent {
    private BigDecimal price;

    public SingleTicket(BigDecimal price) {
        this.price = price;
    }

    @Override
    public BigDecimal getPrice() {
        return this.price;
    }
}
