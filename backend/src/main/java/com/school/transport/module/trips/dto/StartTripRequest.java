package com.school.transport.module.trips.dto;

import com.school.transport.module.trips.entity.Trip;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartTripRequest {
    
    @NotNull(message = "Route ID is required")
    private UUID routeId;
    
    @NotNull(message = "Trip type is required")
    private Trip.TripType tripType;
}
