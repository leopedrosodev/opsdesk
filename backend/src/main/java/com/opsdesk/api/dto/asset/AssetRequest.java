package com.opsdesk.api.dto.asset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record AssetRequest(
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Size(max = 80) String type,
        Long ownerId,
        @Size(max = 45) String ip,
        @Size(max = 180) String location,
        Set<@Size(max = 50) String> tags
) {
}
