package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.*;
import com.opsdesk.domain.repositories.*;
import com.opsdesk.domain.shared.PageResult;
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

    public PageResult<Ticket> listAll(int page, int size) {
        return ticketRepository.findAll(page, size);
    }

    public Ticket update(Long id, String title, String description, TicketPriority priority) {
        Ticket ticket = getById(id);
        ticket.updateDetails(title, description, priority);
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(Long id, TicketStatus status) {
        Ticket ticket = getById(id);

        if (status == TicketStatus.IN_PROGRESS && ticket.getAssigneeId() == null) {
            throw new BadRequestException("O ticket precisa estar atribuido antes de ir para IN_PROGRESS");
        }

        ticket.updateStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket assign(Long ticketId, Long assigneeId) {
        Ticket ticket = getById(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new NotFoundException("Responsavel nao encontrado"));

        if (assignee.getRole() != Role.TECH && assignee.getRole() != Role.ADMIN) {
            throw new BadRequestException("O responsavel precisa ter perfil TECH ou ADMIN");
        }

        ticket.assignTo(assigneeId);
        return ticketRepository.save(ticket);
    }

    public CommentWithAuthor addComment(Long ticketId, Long authorId, String content) {
        getById(ticketId);

        TicketComment comment = new TicketComment(
                null,
                ticketId,
                authorId,
                content,
                Instant.now()
        );

        TicketComment saved = commentRepository.save(comment);
        String authorName = userRepository.findById(authorId).map(User::getFullName).orElse("Usuário desconhecido");
        return new CommentWithAuthor(saved, authorName);
    }

    public List<CommentWithAuthor> listComments(Long ticketId) {
        getById(ticketId);
        return commentRepository.findByTicketId(ticketId).stream()
                .map(c -> {
                    String name = userRepository.findById(c.getAuthorId()).map(User::getFullName).orElse("Usuário desconhecido");
                    return new CommentWithAuthor(c, name);
                })
                .toList();
    }

    public void linkAsset(Long ticketId, Long assetId) {
        getById(ticketId);
        assetRepository.findById(assetId).orElseThrow(() -> new NotFoundException("Ativo nao encontrado"));
        ticketAssetRepository.link(ticketId, assetId);
    }

    public List<Long> listLinkedAssets(Long ticketId) {
        getById(ticketId);
        return ticketAssetRepository.findAssetIdsByTicketId(ticketId);
    }

    private Ticket getById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket nao encontrado"));
    }
}
