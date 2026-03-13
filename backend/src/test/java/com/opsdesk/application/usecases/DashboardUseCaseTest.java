package com.opsdesk.application.usecases;

import com.opsdesk.domain.entities.TicketStatus;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import com.opsdesk.domain.repositories.RunbookRepositoryPort;
import com.opsdesk.domain.repositories.TicketRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardUseCaseTest {

    @Mock private TicketRepositoryPort ticketRepository;
    @Mock private AssetRepositoryPort assetRepository;
    @Mock private RunbookRepositoryPort runbookRepository;

    @InjectMocks
    private DashboardUseCase dashboardUseCase;

    @Test
    void summary_deveAgregarIndicadoresOperacionais() {
        when(ticketRepository.count()).thenReturn(16L);
        when(ticketRepository.countByStatus(TicketStatus.OPEN)).thenReturn(6L);
        when(ticketRepository.countByStatus(TicketStatus.IN_PROGRESS)).thenReturn(4L);
        when(ticketRepository.countByStatus(TicketStatus.RESOLVED)).thenReturn(3L);
        when(ticketRepository.countByStatus(TicketStatus.CLOSED)).thenReturn(3L);
        when(ticketRepository.countUnassigned()).thenReturn(5L);
        when(assetRepository.count()).thenReturn(41L);
        when(runbookRepository.count()).thenReturn(9L);

        DashboardSummary result = dashboardUseCase.summary();

        assertThat(result.ticketsTotal()).isEqualTo(16L);
        assertThat(result.ticketsOpen()).isEqualTo(6L);
        assertThat(result.ticketsInProgress()).isEqualTo(4L);
        assertThat(result.ticketsResolved()).isEqualTo(3L);
        assertThat(result.ticketsClosed()).isEqualTo(3L);
        assertThat(result.ticketsUnassigned()).isEqualTo(5L);
        assertThat(result.assetsTotal()).isEqualTo(41L);
        assertThat(result.runbooksTotal()).isEqualTo(9L);
    }
}
