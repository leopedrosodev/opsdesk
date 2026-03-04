package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.common.MessageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public MessageResponse health() {
        return new MessageResponse("ok");
    }
}
