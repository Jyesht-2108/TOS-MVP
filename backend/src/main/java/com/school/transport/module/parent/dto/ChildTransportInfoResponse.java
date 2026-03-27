package com.school.transport.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for child transport information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildTransportInfoResponse {
    private String id;
    private String name;
    private String grade;
    private String routeId;
    private String routeName;
    private String routeStatus;
    private String driverName;
    private String driverPhone;
    private String vehicleNumber;
}
