package com.opsdesk.domain.entities;

import java.time.Instant;

public class Runbook {
    private Long id;
    private String title;
    private String description;
    private String steps;
    private Long authorId;
    private Instant createdAt;

    public Runbook(Long id, String title, String description, String steps, Long authorId, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.steps = steps;
        this.authorId = authorId;
        this.createdAt = createdAt;
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

    public String getSteps() {
        return steps;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
