package com.school.transport.module.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDriverAssignmentResponse {
    private UUID id;
    private UUID routeId;
    private UUID driverId;
    private LocalDateTime activeFrom;
    private LocalDateTime activeTo;
    private DriverInfo driver;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverInfo {
        private UUID id;
        private String name;
        private String phone;
        private String vehicleNumber;
        private String status;
    }
}
