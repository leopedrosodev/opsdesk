package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.domain.entities.TicketStatus;
import com.opsdesk.domain.repositories.TicketRepositoryPort;
import com.opsdesk.domain.shared.PageResult;
import com.opsdesk.infrastructure.persistence.mappers.TicketPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataTicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TicketRepositoryAdapter implements TicketRepositoryPort {

    private final SpringDataTicketRepository repository;

    public TicketRepositoryAdapter(SpringDataTicketRepository repository) {
        this.repository = repository;
    }

    @Override
    public Ticket save(Ticket ticket) {
        return TicketPersistenceMapper.toDomain(repository.save(TicketPersistenceMapper.toEntity(ticket)));
    }

    @Override
    public Optional<Ticket> findById(Long id) {
        return repository.findById(id).map(TicketPersistenceMapper::toDomain);
    }

    @Override
    public List<Ticket> findAll() {
        return repository.findAll().stream().map(TicketPersistenceMapper::toDomain).toList();
    }

    @Override
    public PageResult<Ticket> findAll(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Ticket> result = repository.findAll(pageable).map(TicketPersistenceMapper::toDomain);
        return new PageResult<>(result.getContent(), result.getTotalElements(), page, size, result.getTotalPages());
    }

    @Override
    public long count() {
        return repository.count();
    }

    @Override
    public long countByStatus(TicketStatus status) {
        return repository.countByStatus(status);
    }

    @Override
    public long countUnassigned() {
        return repository.countByAssigneeIdIsNull();
    }
}
