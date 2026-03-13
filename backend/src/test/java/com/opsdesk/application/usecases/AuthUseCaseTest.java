package com.opsdesk.application.usecases;

import com.opsdesk.application.exceptions.BadRequestException;
import com.opsdesk.application.exceptions.UnauthorizedException;
import com.opsdesk.application.ports.PasswordHasherPort;
import com.opsdesk.application.ports.TokenProviderPort;
import com.opsdesk.domain.entities.Role;
import com.opsdesk.domain.entities.User;
import com.opsdesk.domain.repositories.UserRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthUseCaseTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private PasswordHasherPort passwordHasher;

    @Mock
    private TokenProviderPort tokenProvider;

    @InjectMocks
    private AuthUseCase authUseCase;

    private User savedUser;

    @BeforeEach
    void setUp() {
        savedUser = new User(1L, "João Silva", "joao@example.com", "hashed123", Role.USER, Instant.now());
    }

    // --- register ---

    @Test
    void register_deveRetornarAuthResult_quandoDadosValidos() {
        when(userRepository.existsByEmail("joao@example.com")).thenReturn(false);
        when(passwordHasher.hash("senha123")).thenReturn("hashed123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generate(savedUser)).thenReturn("jwt-token");

        AuthResult result = authUseCase.register("João Silva", "joao@example.com", "senha123", Role.USER);

        assertThat(result.token()).isEqualTo("jwt-token");
        assertThat(result.email()).isEqualTo("joao@example.com");
        assertThat(result.role()).isEqualTo(Role.USER);
    }

    @Test
    void register_deveLancarBadRequest_quandoEmailJaExiste() {
        when(userRepository.existsByEmail("joao@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authUseCase.register("João", "joao@example.com", "senha", Role.USER))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email already in use");
    }

    @Test
    void register_deveAtribuirRoleUser_quandoRoleForNula() {
        User userSemRole = new User(2L, "Maria", "maria@example.com", "hash", Role.USER, Instant.now());

        when(userRepository.existsByEmail("maria@example.com")).thenReturn(false);
        when(passwordHasher.hash(any())).thenReturn("hash");
        when(userRepository.save(any(User.class))).thenReturn(userSemRole);
        when(tokenProvider.generate(any())).thenReturn("token");

        AuthResult result = authUseCase.register("Maria", "maria@example.com", "senha", null);

        assertThat(result.role()).isEqualTo(Role.USER);
    }

    // --- login ---

    @Test
    void login_deveRetornarAuthResult_quandoCredenciaisValidas() {
        when(userRepository.findByEmail("joao@example.com")).thenReturn(Optional.of(savedUser));
        when(passwordHasher.matches("senha123", "hashed123")).thenReturn(true);
        when(tokenProvider.generate(savedUser)).thenReturn("jwt-token");

        AuthResult result = authUseCase.login("joao@example.com", "senha123");

        assertThat(result.token()).isEqualTo("jwt-token");
        assertThat(result.userId()).isEqualTo(1L);
    }

    @Test
    void login_deveLancarUnauthorized_quandoEmailNaoEncontrado() {
        when(userRepository.findByEmail("naoexiste@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authUseCase.login("naoexiste@example.com", "qualquer"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void login_deveLancarUnauthorized_quandoSenhaIncorreta() {
        when(userRepository.findByEmail("joao@example.com")).thenReturn(Optional.of(savedUser));
        when(passwordHasher.matches("senhaErrada", "hashed123")).thenReturn(false);

        assertThatThrownBy(() -> authUseCase.login("joao@example.com", "senhaErrada"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid credentials");
    }
}
