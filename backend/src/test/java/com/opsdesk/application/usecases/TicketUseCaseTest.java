package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.*;
import com.opsdesk.domain.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketUseCaseTest {

    @Mock private TicketRepositoryPort ticketRepository;
    @Mock private UserRepositoryPort userRepository;
    @Mock private TicketCommentRepositoryPort commentRepository;
    @Mock private AssetRepositoryPort assetRepository;
    @Mock private TicketAssetRepositoryPort ticketAssetRepository;

    @InjectMocks
    private TicketUseCase ticketUseCase;

    private Ticket ticketSemAssignee;
    private Ticket ticketComAssignee;
    private CurrentUser currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new CurrentUser(10L, "user@example.com", Role.USER);

        ticketSemAssignee = new Ticket(1L, "Servidor caiu", "Desc", TicketPriority.HIGH,
                TicketStatus.OPEN, 10L, null, Instant.now(), null);

        ticketComAssignee = new Ticket(2L, "Lentidão", "Desc", TicketPriority.LOW,
                TicketStatus.OPEN, 10L, 5L, Instant.now(), null);
    }

    // --- create ---

    @Test
    void create_deveCriarTicketComStatusOpen() {
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticketSemAssignee);

        Ticket result = ticketUseCase.create("Servidor caiu", "Desc", TicketPriority.HIGH, currentUser);

        assertThat(result.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(result.getCreatorId()).isEqualTo(10L);
        verify(ticketRepository).save(any(Ticket.class));
    }

    // --- update ---

    @Test
    void update_deveAtualizarCamposDoTicket() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticketSemAssignee);

        Ticket result = ticketUseCase.update(1L, "Novo título", "Nova desc", TicketPriority.CRITICAL);

        assertThat(result.getTitle()).isEqualTo("Novo título");
        verify(ticketRepository).save(ticketSemAssignee);
    }

    @Test
    void update_deveLancarNotFound_quandoTicketNaoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.update(99L, "x", "y", TicketPriority.LOW))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Ticket not found");
    }

    // --- updateStatus ---

    @Test
    void updateStatus_deveAtualizarStatus_quandoValido() {
        when(ticketRepository.findById(2L)).thenReturn(Optional.of(ticketComAssignee));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticketComAssignee);

        Ticket result = ticketUseCase.updateStatus(2L, TicketStatus.IN_PROGRESS);

        assertThat(result.getStatus()).isEqualTo(TicketStatus.IN_PROGRESS);
    }

    @Test
    void updateStatus_deveLancarBadRequest_quandoInProgressSemAssignee() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));

        assertThatThrownBy(() -> ticketUseCase.updateStatus(1L, TicketStatus.IN_PROGRESS))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Ticket must be assigned before moving to IN_PROGRESS");
    }

    @Test
    void updateStatus_deveLancarNotFound_quandoTicketNaoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.updateStatus(99L, TicketStatus.RESOLVED))
                .isInstanceOf(NotFoundException.class);
    }

    // --- assign ---

    @Test
    void assign_deveAtribuirAssignee_quandoUserETech() {
        User tech = new User(5L, "Técnico", "tech@example.com", "hash", Role.TECH, Instant.now());

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(userRepository.findById(5L)).thenReturn(Optional.of(tech));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticketSemAssignee);

        Ticket result = ticketUseCase.assign(1L, 5L);

        assertThat(result.getAssigneeId()).isEqualTo(5L);
    }

    @Test
    void assign_deveLancarBadRequest_quandoAssigneeEhUser() {
        User userComum = new User(7L, "Comum", "comum@example.com", "hash", Role.USER, Instant.now());

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(userRepository.findById(7L)).thenReturn(Optional.of(userComum));

        assertThatThrownBy(() -> ticketUseCase.assign(1L, 7L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Assignee must be TECH or ADMIN");
    }

    @Test
    void assign_deveLancarNotFound_quandoAssigneeNaoExiste() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.assign(1L, 99L))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Assignee not found");
    }

    // --- addComment ---

    @Test
    void addComment_deveSalvarComentario_quandoTicketExiste() {
        TicketComment comment = new TicketComment(1L, 1L, 10L, "Comentário", Instant.now());

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(commentRepository.save(any(TicketComment.class))).thenReturn(comment);

        TicketComment result = ticketUseCase.addComment(1L, 10L, "Comentário");

        assertThat(result.getContent()).isEqualTo("Comentário");
        assertThat(result.getAuthorId()).isEqualTo(10L);
    }

    @Test
    void addComment_deveLancarNotFound_quandoTicketNaoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.addComment(99L, 10L, "Texto"))
                .isInstanceOf(NotFoundException.class);
    }

    // --- listComments ---

    @Test
    void listComments_deveRetornarLista_quandoTicketExiste() {
        TicketComment c1 = new TicketComment(1L, 1L, 10L, "ok", Instant.now());
        TicketComment c2 = new TicketComment(2L, 1L, 10L, "ok2", Instant.now());

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(commentRepository.findByTicketId(1L)).thenReturn(List.of(c1, c2));

        List<TicketComment> result = ticketUseCase.listComments(1L);

        assertThat(result).hasSize(2);
    }

    @Test
    void listComments_deveLancarNotFound_quandoTicketNaoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.listComments(99L))
                .isInstanceOf(NotFoundException.class);
    }

    // --- linkAsset ---

    @Test
    void linkAsset_deveChamarLink_quandoTicketEAssetExistem() {
        Asset asset = new Asset(3L, "Servidor", "SERVER", 1L, "10.0.0.1", "DC1", null);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(assetRepository.findById(3L)).thenReturn(Optional.of(asset));

        ticketUseCase.linkAsset(1L, 3L);

        verify(ticketAssetRepository).link(1L, 3L);
    }

    @Test
    void linkAsset_deveLancarNotFound_quandoTicketNaoExiste() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.linkAsset(99L, 3L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void linkAsset_deveLancarNotFound_quandoAssetNaoExiste() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticketSemAssignee));
        when(assetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketUseCase.linkAsset(1L, 99L))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Asset not found");
    }
}
