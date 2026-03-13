package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.NotFoundException;
import com.opsdesk.domain.entities.Asset;
import com.opsdesk.domain.repositories.AssetRepositoryPort;
import com.opsdesk.domain.shared.PageResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class AssetUseCase {

    private final AssetRepositoryPort assetRepository;

    public AssetUseCase(AssetRepositoryPort assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset create(String name, String type, Long ownerId, String ip, String location, Set<String> tags) {
        Asset asset = new Asset(null, name, type, ownerId, ip, location, tags);
        return assetRepository.save(asset);
    }

    public List<Asset> list() {
        return assetRepository.findAll();
    }

    public PageResult<Asset> list(int page, int size) {
        return assetRepository.findAll(page, size);
    }

    public Asset update(Long id, String name, String type, Long ownerId, String ip, String location, Set<String> tags) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Asset not found"));

        asset.update(name, type, ownerId, ip, location, tags);
        return assetRepository.save(asset);
    }
}
