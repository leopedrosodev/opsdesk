package com.opsdesk.domain.entities;

import java.time.Instant;

public class TicketComment {
    private Long id;
    private Long ticketId;
    private Long authorId;
    private String content;
    private Instant createdAt;

    public TicketComment(Long id, Long ticketId, Long authorId, String content, Instant createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.authorId = authorId;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
