package com.opsdesk.api.controllers;

import com.opsdesk.application.usecases.CurrentUser;
import com.opsdesk.infrastructure.security.SecurityUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {

    public CurrentUser resolve(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof SecurityUserPrincipal userPrincipal)) {
            throw new IllegalStateException("Unsupported principal type");
        }

        return new CurrentUser(userPrincipal.getId(), userPrincipal.getUsername(), userPrincipal.getRole());
    }
}
