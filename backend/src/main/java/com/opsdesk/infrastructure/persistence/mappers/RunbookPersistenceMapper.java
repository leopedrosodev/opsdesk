package com.opsdesk.infrastructure.persistence.mappers;

import com.opsdesk.domain.entities.Runbook;
import com.opsdesk.infrastructure.persistence.entities.RunbookJpaEntity;

public final class RunbookPersistenceMapper {

    private RunbookPersistenceMapper() {
    }

    public static Runbook toDomain(RunbookJpaEntity entity) {
        return new Runbook(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getSteps(),
                entity.getAuthorId(),
                entity.getCreatedAt()
        );
    }

    public static RunbookJpaEntity toEntity(Runbook runbook) {
        RunbookJpaEntity entity = new RunbookJpaEntity();
        entity.setId(runbook.getId());
        entity.setTitle(runbook.getTitle());
        entity.setDescription(runbook.getDescription());
        entity.setSteps(runbook.getSteps());
        entity.setAuthorId(runbook.getAuthorId());
        entity.setCreatedAt(runbook.getCreatedAt());
        return entity;
    }
}
