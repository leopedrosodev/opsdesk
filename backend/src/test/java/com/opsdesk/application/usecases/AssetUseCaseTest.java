package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.Asset;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetUseCaseTest {

    @Mock
    private AssetRepositoryPort assetRepository;

    @InjectMocks
    private AssetUseCase assetUseCase;

    // --- create ---

    @Test
    void create_deveSalvarERetornarAsset() {
        Asset asset = new Asset(1L, "Servidor", "SERVER", 10L, "10.0.0.1", "DC1", Set.of("prod"));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        Asset result = assetUseCase.create("Servidor", "SERVER", 10L, "10.0.0.1", "DC1", Set.of("prod"));

        assertThat(result.getName()).isEqualTo("Servidor");
        assertThat(result.getIp()).isEqualTo("10.0.0.1");
        verify(assetRepository).save(any(Asset.class));
    }

    // --- list ---

    @Test
    void list_deveRetornarTodosOsAssets() {
        Asset a1 = new Asset(1L, "PC-01", "DESKTOP", 1L, null, "Sala A", null);
        Asset a2 = new Asset(2L, "Switch", "NETWORK", 2L, "192.168.1.1", "Rack", null);
        when(assetRepository.findAll()).thenReturn(List.of(a1, a2));

        List<Asset> result = assetUseCase.list();

        assertThat(result).hasSize(2);
    }

    @Test
    void list_deveRetornarListaVazia_quandoNaoHaAssets() {
        when(assetRepository.findAll()).thenReturn(List.of());

        List<Asset> result = assetUseCase.list();

        assertThat(result).isEmpty();
    }

    // --- update ---

    @Test
    void update_deveAtualizarAsset_quandoExiste() {
        Asset existente = new Asset(1L, "Servidor", "SERVER", 10L, "10.0.0.1", "DC1", Set.of("prod"));
        when(assetRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(assetRepository.save(any(Asset.class))).thenReturn(existente);

        Asset result = assetUseCase.update(1L, "Servidor-Novo", "VM", 10L, "10.0.0.2", "DC2", Set.of("dev"));

        assertThat(result.getName()).isEqualTo("Servidor-Novo");
        verify(assetRepository).save(existente);
    }

    @Test
    void update_deveLancarNotFound_quandoAssetNaoExiste() {
        when(assetRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetUseCase.update(99L, "x", "y", 1L, null, null, null))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Ativo nao encontrado");
    }
}
