package com.opsdesk.application.usecases;

import com.opsdesk.domain.entities.TicketStatus;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import com.opsdesk.domain.repositories.RunbookRepositoryPort;
import com.opsdesk.domain.repositories.TicketRepositoryPort;
import org.springframework.stereotype.Service;

@Service
public class DashboardUseCase {

    private final TicketRepositoryPort ticketRepository;
    private final AssetRepositoryPort assetRepository;
    private final RunbookRepositoryPort runbookRepository;

    public DashboardUseCase(
            TicketRepositoryPort ticketRepository,
            AssetRepositoryPort assetRepository,
            RunbookRepositoryPort runbookRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.assetRepository = assetRepository;
        this.runbookRepository = runbookRepository;
    }

    public DashboardSummary summary() {
        return new DashboardSummary(
                ticketRepository.count(),
                ticketRepository.countByStatus(TicketStatus.OPEN),
                ticketRepository.countByStatus(TicketStatus.IN_PROGRESS),
                ticketRepository.countByStatus(TicketStatus.RESOLVED),
                ticketRepository.countByStatus(TicketStatus.CLOSED),
                ticketRepository.countUnassigned(),
                assetRepository.count(),
                runbookRepository.count()
        );
    }
}
