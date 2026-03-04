package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.infrastructure.persistence.entities.TicketAssetJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataTicketAssetRepository extends JpaRepository<TicketAssetJpaEntity, Long> {
    boolean existsByTicketIdAndAssetId(Long ticketId, Long assetId);

    List<TicketAssetJpaEntity> findByTicketId(Long ticketId);
}
