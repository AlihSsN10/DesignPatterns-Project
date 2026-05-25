package com.college.eventbooking.pattern.composite;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class TicketBundle implements ITicketComponent {
    private List<ITicketComponent> tickets = new ArrayList<>();

    public void addTicket(ITicketComponent ticket) {
        tickets.add(ticket);
    }

    public void removeTicket(ITicketComponent ticket) {
        tickets.remove(ticket);
    }

    @Override
    public BigDecimal getPrice() {
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (ITicketComponent ticket : tickets) {
            totalPrice = totalPrice.add(ticket.getPrice());
        }
        return totalPrice;
    }
}
