package com.opsdesk.api.controllers;

import com.opsdesk.api.dto.dashboard.DashboardSummaryResponse;
import com.opsdesk.application.usecases.DashboardUseCase;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardUseCase dashboardUseCase;

    public DashboardController(DashboardUseCase dashboardUseCase) {
        this.dashboardUseCase = dashboardUseCase;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','TECH','USER')")
    public DashboardSummaryResponse summary() {
        return DashboardSummaryResponse.from(dashboardUseCase.summary());
    }
}
