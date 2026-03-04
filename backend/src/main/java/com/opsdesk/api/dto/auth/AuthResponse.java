package com.opsdesk.api.dto.auth;

import com.opsdesk.domain.entities.Role;

public record AuthResponse(String token, Long userId, String fullName, String email, Role role) {
}
