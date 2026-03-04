package com.opsdesk.api.dto.ticket;

import java.time.Instant;

public record TicketCommentResponse(Long id, Long ticketId, Long authorId, String content, Instant createdAt) {
}
