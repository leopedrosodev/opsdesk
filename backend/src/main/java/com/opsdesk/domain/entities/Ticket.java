package com.opsdesk.domain.entities;

import java.time.Instant;

public class Ticket {
    private Long id;
    private String title;
    private String description;
    private TicketPriority priority;
    private TicketStatus status;
    private Long creatorId;
    private Long assigneeId;
    private Instant createdAt;
    private Instant closedAt;

    public Ticket(
            Long id,
            String title,
            String description,
            TicketPriority priority,
            TicketStatus status,
            Long creatorId,
            Long assigneeId,
            Instant createdAt,
            Instant closedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.creatorId = creatorId;
        this.assigneeId = assigneeId;
        this.createdAt = createdAt;
        this.closedAt = closedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public void updateDetails(String title, String description, TicketPriority priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    public void assignTo(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public void updateStatus(TicketStatus status) {
        this.status = status;
        if (status == TicketStatus.CLOSED || status == TicketStatus.RESOLVED) {
            this.closedAt = Instant.now();
        } else {
            this.closedAt = null;
        }
    }
}
