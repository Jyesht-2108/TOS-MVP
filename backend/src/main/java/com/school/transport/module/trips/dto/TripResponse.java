package com.school.transport.module.trips.dto;

import com.school.transport.module.trips.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private UUID id;
    private UUID routeId;
    private String routeName;
    private UUID driverId;
    private String driverName;
    private Trip.TripType tripType;
    private LocalDate tripDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Trip.TripStatus status;
    private Integer totalStudents;
    private Integer presentCount;
    private Integer absentCount;
    private LocalDateTime createdAt;
}
