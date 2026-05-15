package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.auth.AuthResponse;
import com.opsdesk.api.dto.auth.LoginRequest;
import com.opsdesk.api.dto.auth.RegisterRequest;
import com.opsdesk.api.mappers.AuthMapper;
import com.opsdesk.application.usecases.AuthResult;
import com.opsdesk.application.usecases.AuthUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        AuthResult result = authUseCase.register(
                request.fullName(),
                request.email(),
                request.password(),
                request.confirmPassword()
        );

        return AuthMapper.toResponse(result);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        AuthResult result = authUseCase.login(request.email(), request.password());
        return AuthMapper.toResponse(result);
    }
}
