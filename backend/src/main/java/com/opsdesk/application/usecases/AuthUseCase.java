package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.UnauthorizedException;
import com.opsdesk.application.ports.PasswordHasherPort;
import com.opsdesk.application.ports.TokenProviderPort;
import com.opsdesk.domain.entities.Role;
import com.opsdesk.domain.entities.User;
import com.opsdesk.domain.repositories.UserRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordHasherPort passwordHasher;
    private final TokenProviderPort tokenProvider;

    public AuthUseCase(UserRepositoryPort userRepository, PasswordHasherPort passwordHasher, TokenProviderPort tokenProvider) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenProvider = tokenProvider;
    }

    public AuthResult register(String fullName, String email, String rawPassword, Role requestedRole) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already in use");
        }

        Role role = requestedRole == null ? Role.USER : requestedRole;

        User user = new User(
                null,
                fullName,
                email,
                passwordHasher.hash(rawPassword),
                role,
                Instant.now()
        );

        User saved = userRepository.save(user);
        String token = tokenProvider.generate(saved);

        return new AuthResult(token, saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole());
    }

    public AuthResult login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = tokenProvider.generate(user);
        return new AuthResult(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
