package com.opsdesk.api.mappers;

import com.opsdesk.api.dto.ticket.TicketCommentResponse;
import com.opsdesk.api.dto.ticket.TicketResponse;
import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.domain.entities.TicketComment;

import java.util.List;

public final class TicketMapper {

    private TicketMapper() {
    }

    public static TicketResponse toResponse(Ticket ticket, List<Long> assetIds) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatorId(),
                ticket.getAssigneeId(),
                ticket.getCreatedAt(),
                ticket.getClosedAt(),
                assetIds
        );
    }

    public static TicketCommentResponse toCommentResponse(TicketComment comment) {
        return new TicketCommentResponse(
                comment.getId(),
                comment.getTicketId(),
                comment.getAuthorId(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
