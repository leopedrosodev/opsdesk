package com.opsdesk.api.dto.runbook;

import java.time.Instant;

public record RunbookResponse(Long id, String title, String description, String steps, Long authorId, Instant createdAt) {
}
