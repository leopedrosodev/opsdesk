package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.Runbook;
import com.opsdesk.domain.repositories.RunbookRepositoryPort;
import com.opsdesk.infrastructure.persistence.mappers.RunbookPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataRunbookRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class RunbookRepositoryAdapter implements RunbookRepositoryPort {

    private final SpringDataRunbookRepository repository;

    public RunbookRepositoryAdapter(SpringDataRunbookRepository repository) {
        this.repository = repository;
    }

    @Override
    public Runbook save(Runbook runbook) {
        return RunbookPersistenceMapper.toDomain(repository.save(RunbookPersistenceMapper.toEntity(runbook)));
    }

    @Override
    public Optional<Runbook> findById(Long id) {
        return repository.findById(id).map(RunbookPersistenceMapper::toDomain);
    }

    @Override
    public List<Runbook> findAll() {
        return repository.findAll().stream().map(RunbookPersistenceMapper::toDomain).toList();
    }
}
