package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.Runbook;
import com.opsdesk.domain.repositories.RunbookRepositoryPort;
import com.opsdesk.domain.shared.PageResult;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class RunbookUseCase {

    private final RunbookRepositoryPort runbookRepository;

    public RunbookUseCase(RunbookRepositoryPort runbookRepository) {
        this.runbookRepository = runbookRepository;
    }

    public Runbook create(String title, String description, String steps, Long authorId) {
        Runbook runbook = new Runbook(null, title, description, steps, authorId, Instant.now());
        return runbookRepository.save(runbook);
    }

    public List<Runbook> list() {
        return runbookRepository.findAll();
    }

    public PageResult<Runbook> list(int page, int size) {
        return runbookRepository.findAll(page, size);
    }

    public Runbook getById(Long id) {
        return runbookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Runbook nao encontrado"));
    }
}
