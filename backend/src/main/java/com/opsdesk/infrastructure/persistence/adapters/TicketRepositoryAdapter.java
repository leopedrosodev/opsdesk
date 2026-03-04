package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.Ticket;
import com.opsdesk.domain.repositories.TicketRepositoryPort;
import com.opsdesk.infrastructure.persistence.mappers.TicketPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataTicketRepository;
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
}
