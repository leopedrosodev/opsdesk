package com.opsdesk.api.dto.auth;

import com.opsdesk.domain.entities.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(min = 8, max = 120) String password,
        @NotBlank @Size(min = 8, max = 120) String confirmPassword,
        @NotNull Role role
) {
}
