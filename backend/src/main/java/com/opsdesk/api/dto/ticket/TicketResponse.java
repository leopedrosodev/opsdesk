package com.opsdesk.api.dto.ticket;

import com.opsdesk.domain.entities.TicketPriority;
import com.opsdesk.domain.entities.TicketStatus;

import java.time.Instant;
import java.util.List;

public record TicketResponse(
        Long id,
        String title,
        String description,
        TicketPriority priority,
        TicketStatus status,
        Long creatorId,
        Long assigneeId,
        Instant createdAt,
        Instant closedAt,
        List<Long> assetIds
) {
}
