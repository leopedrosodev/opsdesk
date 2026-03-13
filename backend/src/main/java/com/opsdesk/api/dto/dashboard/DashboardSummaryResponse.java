package com.opsdesk.api.dto.dashboard;

import com.opsdesk.application.usecases.DashboardSummary;

public record DashboardSummaryResponse(
        long ticketsTotal,
        long ticketsOpen,
        long ticketsInProgress,
        long ticketsResolved,
        long ticketsClosed,
        long ticketsUnassigned,
        long assetsTotal,
        long runbooksTotal
) {
    public static DashboardSummaryResponse from(DashboardSummary summary) {
        return new DashboardSummaryResponse(
                summary.ticketsTotal(),
                summary.ticketsOpen(),
                summary.ticketsInProgress(),
                summary.ticketsResolved(),
                summary.ticketsClosed(),
                summary.ticketsUnassigned(),
                summary.assetsTotal(),
                summary.runbooksTotal()
        );
    }
}
