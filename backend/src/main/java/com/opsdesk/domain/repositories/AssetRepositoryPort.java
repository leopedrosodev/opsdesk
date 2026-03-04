package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.Asset;

import java.util.List;
import java.util.Optional;

public interface AssetRepositoryPort {
    Asset save(Asset asset);

    Optional<Asset> findById(Long id);

    List<Asset> findAll();
}
