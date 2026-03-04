package com.opsdesk.application.ports;

import com.opsdesk.domain.entities.User;

public interface TokenProviderPort {
    String generate(User user);
}
