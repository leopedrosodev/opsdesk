package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.asset.AssetRequest;
import com.opsdesk.api.dto.asset.AssetResponse;
import com.opsdesk.api.dto.common.PagedResponse;
import com.opsdesk.api.mappers.AssetMapper;
import com.opsdesk.application.usecases.AssetUseCase;
import com.opsdesk.domain.entities.Asset;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetUseCase assetUseCase;

    public AssetController(AssetUseCase assetUseCase) {
        this.assetUseCase = assetUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public PagedResponse<AssetResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return PagedResponse.from(assetUseCase.list(page, size), AssetMapper::toResponse);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public AssetResponse create(@Valid @RequestBody AssetRequest request) {
        Asset asset = assetUseCase.create(
                request.name(),
                request.type(),
                request.ownerId(),
                request.ip(),
                request.location(),
                request.tags() == null ? new HashSet<>() : request.tags()
        );

        return AssetMapper.toResponse(asset);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TECH')")
    public AssetResponse update(@PathVariable Long id, @Valid @RequestBody AssetRequest request) {
        Asset asset = assetUseCase.update(
                id,
                request.name(),
                request.type(),
                request.ownerId(),
                request.ip(),
                request.location(),
                request.tags() == null ? new HashSet<>() : request.tags()
        );

        return AssetMapper.toResponse(asset);
    }
}
