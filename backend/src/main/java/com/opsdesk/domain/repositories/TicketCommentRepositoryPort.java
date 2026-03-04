package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.TicketComment;

import java.util.List;

public interface TicketCommentRepositoryPort {
    TicketComment save(TicketComment comment);

    List<TicketComment> findByTicketId(Long ticketId);
}
