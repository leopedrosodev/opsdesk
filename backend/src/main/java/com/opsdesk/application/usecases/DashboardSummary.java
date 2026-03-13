package com.opsdesk.application.usecases;

public record DashboardSummary(
        long ticketsTotal,
        long ticketsOpen,
        long ticketsInProgress,
        long ticketsResolved,
        long ticketsClosed,
        long ticketsUnassigned,
        long assetsTotal,
        long runbooksTotal
) {
}
