package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.repositories.TicketAssetRepositoryPort;
import com.opsdesk.infrastructure.persistence.entities.TicketAssetJpaEntity;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataTicketAssetRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketAssetRepositoryAdapter implements TicketAssetRepositoryPort {

    private final SpringDataTicketAssetRepository repository;

    public TicketAssetRepositoryAdapter(SpringDataTicketAssetRepository repository) {
        this.repository = repository;
    }

    @Override
    public void link(Long ticketId, Long assetId) {
        if (repository.existsByTicketIdAndAssetId(ticketId, assetId)) {
            return;
        }

        TicketAssetJpaEntity entity = new TicketAssetJpaEntity();
        entity.setTicketId(ticketId);
        entity.setAssetId(assetId);
        repository.save(entity);
    }

    @Override
    public List<Long> findAssetIdsByTicketId(Long ticketId) {
        return repository.findByTicketId(ticketId)
                .stream()
                .map(TicketAssetJpaEntity::getAssetId)
                .toList();
    }
}
