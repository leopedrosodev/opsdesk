package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.Runbook;

import java.util.List;
import java.util.Optional;

public interface RunbookRepositoryPort {
    Runbook save(Runbook runbook);

    Optional<Runbook> findById(Long id);

    List<Runbook> findAll();
}
