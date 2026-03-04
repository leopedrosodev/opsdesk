package com.opsdesk.domain.repositories;

import java.util.List;

public interface TicketAssetRepositoryPort {
    void link(Long ticketId, Long assetId);

    List<Long> findAssetIdsByTicketId(Long ticketId);
}
