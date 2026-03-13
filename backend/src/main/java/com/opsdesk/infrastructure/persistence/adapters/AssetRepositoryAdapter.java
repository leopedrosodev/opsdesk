package com.opsdesk.infrastructure.persistence.adapters;

import com.opsdesk.domain.entities.Asset;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import com.opsdesk.domain.shared.PageResult;
import com.opsdesk.infrastructure.persistence.mappers.AssetPersistenceMapper;
import com.opsdesk.infrastructure.persistence.repositories.SpringDataAssetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    @Override
    public PageResult<Asset> findAll(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Asset> result = repository.findAll(pageable).map(AssetPersistenceMapper::toDomain);
        return new PageResult<>(result.getContent(), result.getTotalElements(), page, size, result.getTotalPages());
    }

    @Override
    public long count() {
        return repository.count();
    }
}
