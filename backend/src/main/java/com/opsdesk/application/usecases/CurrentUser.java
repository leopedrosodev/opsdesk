package com.opsdesk.application.usecases;

import com.opsdesk.domain.entities.Role;

public record CurrentUser(Long id, String email, Role role) {
    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isTech() {
        return role == Role.TECH;
    }
}
