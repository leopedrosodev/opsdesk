package com.opsdesk.infrastructure.persistence.mappers;

import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.infrastructure.persistence.entities.TicketJpaEntity;

public final class TicketPersistenceMapper {

    private TicketPersistenceMapper() {
    }

    public static Ticket toDomain(TicketJpaEntity entity) {
        return new Ticket(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getPriority(),
                entity.getStatus(),
                entity.getCreatorId(),
                entity.getAssigneeId(),
                entity.getCreatedAt(),
                entity.getClosedAt()
        );
    }

    public static TicketJpaEntity toEntity(Ticket ticket) {
        TicketJpaEntity entity = new TicketJpaEntity();
        entity.setId(ticket.getId());
        entity.setTitle(ticket.getTitle());
        entity.setDescription(ticket.getDescription());
        entity.setPriority(ticket.getPriority());
        entity.setStatus(ticket.getStatus());
        entity.setCreatorId(ticket.getCreatorId());
        entity.setAssigneeId(ticket.getAssigneeId());
        entity.setCreatedAt(ticket.getCreatedAt());
        entity.setClosedAt(ticket.getClosedAt());
        return entity;
    }
}
