package com.opsdesk.api.mappers;

import com.opsdesk.api.dto.asset.AssetResponse;
import com.opsdesk.domain.entities.Asset;

public final class AssetMapper {

    private AssetMapper() {
    }

    public static AssetResponse toResponse(Asset asset) {
        return new AssetResponse(
                asset.getId(),
                asset.getName(),
                asset.getType(),
                asset.getOwnerId(),
                asset.getIp(),
                asset.getLocation(),
                asset.getTags()
        );
    }
}
