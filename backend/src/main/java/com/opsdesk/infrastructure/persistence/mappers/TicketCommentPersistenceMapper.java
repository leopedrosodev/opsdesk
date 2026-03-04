package com.opsdesk.infrastructure.persistence.mappers;

import com.opsdesk.domain.entities.TicketComment;
import com.opsdesk.infrastructure.persistence.entities.TicketCommentJpaEntity;

public final class TicketCommentPersistenceMapper {

    private TicketCommentPersistenceMapper() {
    }

    public static TicketComment toDomain(TicketCommentJpaEntity entity) {
        return new TicketComment(
                entity.getId(),
                entity.getTicketId(),
                entity.getAuthorId(),
                entity.getContent(),
                entity.getCreatedAt()
        );
    }

    public static TicketCommentJpaEntity toEntity(TicketComment comment) {
        TicketCommentJpaEntity entity = new TicketCommentJpaEntity();
        entity.setId(comment.getId());
        entity.setTicketId(comment.getTicketId());
        entity.setAuthorId(comment.getAuthorId());
        entity.setContent(comment.getContent());
        entity.setCreatedAt(comment.getCreatedAt());
        return entity;
    }
}
