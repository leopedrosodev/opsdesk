package com.opsdesk.application.usecases;

import com.opsdesk.domain.entities.Role;

public record AuthResult(String token, Long userId, String fullName, String email, Role role) {
}
