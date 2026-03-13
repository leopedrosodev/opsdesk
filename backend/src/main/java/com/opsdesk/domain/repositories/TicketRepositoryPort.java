package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.domain.entities.TicketStatus;
import com.opsdesk.domain.shared.PageResult;

import java.util.List;
import java.util.Optional;

public interface TicketRepositoryPort {
    Ticket save(Ticket ticket);

    Optional<Ticket> findById(Long id);

    List<Ticket> findAll();

    PageResult<Ticket> findAll(int page, int size);

    long count();

    long countByStatus(TicketStatus status);

    long countUnassigned();
}
