package com.school.transport.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for parent dashboard statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentDashboardStatsResponse {
    private int myChildren;
    private int activeRoutes;
    private int upcomingTrips;
}
