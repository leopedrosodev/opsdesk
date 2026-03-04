package com.opsdesk.infrastructure.persistence.mappers;

import com.opsdesk.domain.entities.Asset;
import com.opsdesk.infrastructure.persistence.entities.AssetJpaEntity;

import java.util.HashSet;

public final class AssetPersistenceMapper {

    private AssetPersistenceMapper() {
    }

    public static Asset toDomain(AssetJpaEntity entity) {
        return new Asset(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                entity.getOwnerId(),
                entity.getIp(),
                entity.getLocation(),
                new HashSet<>(entity.getTags())
        );
    }

    public static AssetJpaEntity toEntity(Asset asset) {
        AssetJpaEntity entity = new AssetJpaEntity();
        entity.setId(asset.getId());
        entity.setName(asset.getName());
        entity.setType(asset.getType());
        entity.setOwnerId(asset.getOwnerId());
        entity.setIp(asset.getIp());
        entity.setLocation(asset.getLocation());
        entity.setTags(new HashSet<>(asset.getTags()));
        return entity;
    }
}
