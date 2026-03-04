package com.opsdesk.api.dto.ticket;

import com.opsdesk.domain.entities.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusRequest(@NotNull TicketStatus status) {
}
