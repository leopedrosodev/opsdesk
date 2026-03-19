package com.opsdesk.infrastructure.security;

import com.opsdesk.domain.repositories.UserRepositoryPort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceAdapter implements UserDetailsService {

    private final UserRepositoryPort userRepository;

    public UserDetailsServiceAdapter(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(user -> new SecurityUserPrincipal(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPasswordHash(),
                        user.getRole()
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));
    }
}
