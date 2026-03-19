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
import java.util.regex.Pattern;

@Service
public class AuthUseCase {
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[^A-Za-z0-9]");

    private final UserRepositoryPort userRepository;
    private final PasswordHasherPort passwordHasher;
    private final TokenProviderPort tokenProvider;

    public AuthUseCase(UserRepositoryPort userRepository, PasswordHasherPort passwordHasher, TokenProviderPort tokenProvider) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenProvider = tokenProvider;
    }

    public AuthResult register(
            String fullName,
            String email,
            String rawPassword,
            String confirmPassword,
            Role requestedRole
    ) {
        validatePasswordRules(rawPassword, confirmPassword);

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Este email ja esta em uso");
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

    private void validatePasswordRules(String rawPassword, String confirmPassword) {
        if (!rawPassword.equals(confirmPassword)) {
            throw new BadRequestException("Senha e confirmacao de senha devem ser iguais");
        }

        if (rawPassword.length() < 8) {
            throw new BadRequestException("A senha deve ter pelo menos 8 caracteres");
        }

        if (!LOWERCASE_PATTERN.matcher(rawPassword).find()) {
            throw new BadRequestException("A senha deve incluir pelo menos uma letra minuscula");
        }

        if (!UPPERCASE_PATTERN.matcher(rawPassword).find()) {
            throw new BadRequestException("A senha deve incluir pelo menos uma letra maiuscula");
        }

        if (!DIGIT_PATTERN.matcher(rawPassword).find()) {
            throw new BadRequestException("A senha deve incluir pelo menos um numero");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(rawPassword).find()) {
            throw new BadRequestException("A senha deve incluir pelo menos um caractere especial");
        }
    }

    public AuthResult login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Credenciais invalidas"));

        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais invalidas");
        }

        String token = tokenProvider.generate(user);
        return new AuthResult(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
