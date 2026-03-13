package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.domain.entities.TicketStatus;
import com.opsdesk.infrastructure.persistence.entities.TicketJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataTicketRepository extends JpaRepository<TicketJpaEntity, Long> {
    long countByStatus(TicketStatus status);

    long countByAssigneeIdIsNull();
}
