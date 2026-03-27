package com.school.transport.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for parent's active live trip
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentLiveTripResponse {
    private String tripId;
    private String routeId;
    private String routeName;
    private String vehicleNumber;
    private String driverName;
    private String childName;
    private String tripType; // PICKUP or DROP
}
