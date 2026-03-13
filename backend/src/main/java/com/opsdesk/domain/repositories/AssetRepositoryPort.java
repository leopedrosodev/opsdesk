package com.opsdesk.domain.repositories;

import com.opsdesk.domain.entities.Asset;
import com.opsdesk.domain.shared.PageResult;

import java.util.List;
import java.util.Optional;

public interface AssetRepositoryPort {
    Asset save(Asset asset);

    Optional<Asset> findById(Long id);

    List<Asset> findAll();

    PageResult<Asset> findAll(int page, int size);

    long count();
}
