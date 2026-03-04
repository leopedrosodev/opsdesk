package com.opsdesk.domain.entities;

import java.time.Instant;

public class User {
    private Long id;
    private String fullName;
    private String email;
    private String passwordHash;
    private Role role;
    private Instant createdAt;

    public User(Long id, String fullName, String email, String passwordHash, Role role, Instant createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
