package com.school.transport.module.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalDrivers;
    private Long activeDrivers;
    private Long totalStudents;
    private Long totalRoutes;
    private Long activeRoutes;
    private Long tripsToday;
}
