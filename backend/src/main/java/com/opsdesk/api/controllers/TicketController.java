package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.common.MessageResponse;
import com.opsdesk.api.dto.ticket.*;
import com.opsdesk.api.mappers.TicketMapper;
import com.opsdesk.application.usecases.CurrentUser;
import com.opsdesk.application.usecases.TicketUseCase;
import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.domain.entities.TicketComment;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketUseCase ticketUseCase;
    private final CurrentUserResolver currentUserResolver;

    public TicketController(TicketUseCase ticketUseCase, CurrentUserResolver currentUserResolver) {
        this.ticketUseCase = ticketUseCase;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public List<TicketResponse> list() {
        return ticketUseCase.listAll()
                .stream()
                .map(ticket -> TicketMapper.toResponse(ticket, ticketUseCase.listLinkedAssets(ticket.getId())))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public TicketResponse create(@Valid @RequestBody TicketRequest request, Authentication authentication) {
        CurrentUser currentUser = currentUserResolver.resolve(authentication);

        Ticket ticket = ticketUseCase.create(
                request.title(),
                request.description(),
                request.priority(),
                currentUser
        );

        return TicketMapper.toResponse(ticket, List.of());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public TicketResponse update(@PathVariable Long id, @Valid @RequestBody TicketRequest request) {
        Ticket ticket = ticketUseCase.update(id, request.title(), request.description(), request.priority());
        return TicketMapper.toResponse(ticket, ticketUseCase.listLinkedAssets(ticket.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public TicketResponse updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusRequest request) {
        Ticket ticket = ticketUseCase.updateStatus(id, request.status());
        return TicketMapper.toResponse(ticket, ticketUseCase.listLinkedAssets(ticket.getId()));
    }

    @PatchMapping("/{id}/assign/{assigneeId}")
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public TicketResponse assign(@PathVariable Long id, @PathVariable Long assigneeId) {
        Ticket ticket = ticketUseCase.assign(id, assigneeId);
        return TicketMapper.toResponse(ticket, ticketUseCase.listLinkedAssets(ticket.getId()));
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public TicketCommentResponse addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request,
            Authentication authentication
    ) {
        CurrentUser currentUser = currentUserResolver.resolve(authentication);
        TicketComment comment = ticketUseCase.addComment(id, currentUser.id(), request.content());
        return TicketMapper.toCommentResponse(comment);
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public List<TicketCommentResponse> listComments(@PathVariable Long id) {
        return ticketUseCase.listComments(id)
                .stream()
                .map(TicketMapper::toCommentResponse)
                .toList();
    }

    @PostMapping("/{id}/assets/{assetId}")
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public MessageResponse linkAsset(@PathVariable Long id, @PathVariable Long assetId) {
        ticketUseCase.linkAsset(id, assetId);
        return new MessageResponse("Asset linked to ticket");
    }
}
