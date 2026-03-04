package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.infrastructure.persistence.entities.TicketCommentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataTicketCommentRepository extends JpaRepository<TicketCommentJpaEntity, Long> {
    List<TicketCommentJpaEntity> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
