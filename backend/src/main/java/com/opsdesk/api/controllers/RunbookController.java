package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.common.PagedResponse;
import com.opsdesk.api.dto.runbook.RunbookRequest;
import com.opsdesk.api.dto.runbook.RunbookResponse;
import com.opsdesk.api.mappers.RunbookMapper;
import com.opsdesk.application.usecases.CurrentUser;
import com.opsdesk.application.usecases.RunbookUseCase;
import com.opsdesk.domain.entities.Runbook;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/runbooks")
public class RunbookController {

    private final RunbookUseCase runbookUseCase;
    private final CurrentUserResolver currentUserResolver;

    public RunbookController(RunbookUseCase runbookUseCase, CurrentUserResolver currentUserResolver) {
        this.runbookUseCase = runbookUseCase;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public PagedResponse<RunbookResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return PagedResponse.from(runbookUseCase.list(page, size), RunbookMapper::toResponse);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public RunbookResponse getById(@PathVariable Long id) {
        return RunbookMapper.toResponse(runbookUseCase.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public RunbookResponse create(@Valid @RequestBody RunbookRequest request, Authentication authentication) {
        CurrentUser currentUser = currentUserResolver.resolve(authentication);

        Runbook runbook = runbookUseCase.create(
                request.title(),
                request.description(),
                request.steps(),
                currentUser.id()
        );

        return RunbookMapper.toResponse(runbook);
    }
}
