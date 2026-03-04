package com.opsdesk.infrastructure.persistence.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "ticket_assets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"ticket_id", "asset_id"})
})
public class TicketAssetJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;

    @Column(name = "asset_id", nullable = false)
    private Long assetId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }
}
