package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.TicketComment;
import com.opsdesk.domain.repositories.TicketCommentRepositoryPort;
import com.opsdesk.infrastructure.persistence.mappers.TicketCommentPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataTicketCommentRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketCommentRepositoryAdapter implements TicketCommentRepositoryPort {

    private final SpringDataTicketCommentRepository repository;

    public TicketCommentRepositoryAdapter(SpringDataTicketCommentRepository repository) {
        this.repository = repository;
    }

    @Override
    public TicketComment save(TicketComment comment) {
        return TicketCommentPersistenceMapper.toDomain(repository.save(TicketCommentPersistenceMapper.toEntity(comment)));
    }

    @Override
    public List<TicketComment> findByTicketId(Long ticketId) {
        return repository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(TicketCommentPersistenceMapper::toDomain)
                .toList();
    }
}
