package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.Runbook;
import com.opsdesk.domain.shared.PageResult;

import java.util.List;
import java.util.Optional;

public interface RunbookRepositoryPort {
    Runbook save(Runbook runbook);

    Optional<Runbook> findById(Long id);

    List<Runbook> findAll();

    PageResult<Runbook> findAll(int page, int size);

    long count();
}
