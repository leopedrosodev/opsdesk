package com.opsdesk.infrastructure.persistence.repositories;

import com.opsdesk.infrastructure.persistence.entities.AssetJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataAssetRepository extends JpaRepository<AssetJpaEntity, Long> {
}
