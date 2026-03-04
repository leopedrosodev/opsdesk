package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.Asset;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import com.opsdesk.infrastructure.persistence.mappers.AssetPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataAssetRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AssetRepositoryAdapter implements AssetRepositoryPort {

    private final SpringDataAssetRepository repository;

    public AssetRepositoryAdapter(SpringDataAssetRepository repository) {
        this.repository = repository;
    }

    @Override
    public Asset save(Asset asset) {
        return AssetPersistenceMapper.toDomain(repository.save(AssetPersistenceMapper.toEntity(asset)));
    }

    @Override
    public Optional<Asset> findById(Long id) {
        return repository.findById(id).map(AssetPersistenceMapper::toDomain);
    }

    @Override
    public List<Asset> findAll() {
        return repository.findAll().stream().map(AssetPersistenceMapper::toDomain).toList();
    }
}
