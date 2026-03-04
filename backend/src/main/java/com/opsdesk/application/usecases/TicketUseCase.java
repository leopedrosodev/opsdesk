package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.*;
import com.opsdesk.domain.repositories.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TicketUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final UserRepositoryPort userRepository;
    private final TicketCommentRepositoryPort commentRepository;
    private final AssetRepositoryPort assetRepository;
    private final TicketAssetRepositoryPort ticketAssetRepository;

    public TicketUseCase(
            TicketRepositoryPort ticketRepository,
            UserRepositoryPort userRepository,
            TicketCommentRepositoryPort commentRepository,
            AssetRepositoryPort assetRepository,
            TicketAssetRepositoryPort ticketAssetRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.assetRepository = assetRepository;
        this.ticketAssetRepository = ticketAssetRepository;
    }

    public Ticket create(String title, String description, TicketPriority priority, CurrentUser currentUser) {
        Ticket ticket = new Ticket(
                null,
                title,
                description,
                priority,
                TicketStatus.OPEN,
                currentUser.id(),
                null,
                Instant.now(),
                null
        );

        return ticketRepository.save(ticket);
    }

    public List<Ticket> listAll() {
        return ticketRepository.findAll();
    }

    public Ticket update(Long id, String title, String description, TicketPriority priority) {
        Ticket ticket = getById(id);
        ticket.updateDetails(title, description, priority);
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(Long id, TicketStatus status) {
        Ticket ticket = getById(id);

        if (status == TicketStatus.IN_PROGRESS && ticket.getAssigneeId() == null) {
            throw new BadRequestException("Ticket must be assigned before moving to IN_PROGRESS");
        }

        ticket.updateStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket assign(Long ticketId, Long assigneeId) {
        Ticket ticket = getById(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new NotFoundException("Assignee not found"));

        if (assignee.getRole() != Role.TECH && assignee.getRole() != Role.ADMIN) {
            throw new BadRequestException("Assignee must be TECH or ADMIN");
        }

        ticket.assignTo(assigneeId);
        return ticketRepository.save(ticket);
    }

    public TicketComment addComment(Long ticketId, Long authorId, String content) {
        getById(ticketId);

        TicketComment comment = new TicketComment(
                null,
                ticketId,
                authorId,
                content,
                Instant.now()
        );

        return commentRepository.save(comment);
    }

    public List<TicketComment> listComments(Long ticketId) {
        getById(ticketId);
        return commentRepository.findByTicketId(ticketId);
    }

    public void linkAsset(Long ticketId, Long assetId) {
        getById(ticketId);
        assetRepository.findById(assetId).orElseThrow(() -> new NotFoundException("Asset not found"));
        ticketAssetRepository.link(ticketId, assetId);
    }

    public List<Long> listLinkedAssets(Long ticketId) {
        getById(ticketId);
        return ticketAssetRepository.findAssetIdsByTicketId(ticketId);
    }

    private Ticket getById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
    }
}
