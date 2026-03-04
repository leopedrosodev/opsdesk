package com.opsdesk.api.mappers;

import com.opsdesk.api.dto.auth.AuthResponse;
import com.opsdesk.application.usecases.AuthResult;

public final class AuthMapper {

    private AuthMapper() {
    }

    public static AuthResponse toResponse(AuthResult result) {
        return new AuthResponse(
                result.token(),
                result.userId(),
                result.fullName(),
                result.email(),
                result.role()
        );
    }
}
