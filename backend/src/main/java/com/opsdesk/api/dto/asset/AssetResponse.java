package com.opsdesk.api.dto.asset;

import java.util.Set;

public record AssetResponse(Long id, String name, String type, Long ownerId, String ip, String location, Set<String> tags) {
}
