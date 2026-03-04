package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.infrastructure.persistence.entities.RunbookJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataRunbookRepository extends JpaRepository<RunbookJpaEntity, Long> {
}
