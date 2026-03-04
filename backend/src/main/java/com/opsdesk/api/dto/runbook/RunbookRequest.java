package com.opsdesk.api.dto.runbook;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RunbookRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank String description,
        @NotBlank String steps
) {
}
