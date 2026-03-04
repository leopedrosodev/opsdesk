package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.infrastructure.persistence.entities.TicketJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataTicketRepository extends JpaRepository<TicketJpaEntity, Long> {
}
