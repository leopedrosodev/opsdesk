package com.opsdesk.api.mappers;

import com.opsdesk.api.dto.runbook.RunbookResponse;
import com.opsdesk.domain.entities.Runbook;

public final class RunbookMapper {

    private RunbookMapper() {
    }

    public static RunbookResponse toResponse(Runbook runbook) {
        return new RunbookResponse(
                runbook.getId(),
                runbook.getTitle(),
                runbook.getDescription(),
                runbook.getSteps(),
                runbook.getAuthorId(),
                runbook.getCreatedAt()
        );
    }
}
