package com.school.transport.module.trips.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.trips.dto.StartTripRequest;
import com.school.transport.module.trips.dto.TripResponse;
import com.school.transport.module.trips.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
@Slf4j
public class TripsController {

    private final TripService tripService;
    
    // TODO: Get tenantId from authenticated user context
    private static final UUID MOCK_TENANT_ID = UUID.fromString("a0000000-0000-0000-0000-000000000001");

    /**
     * Start a new trip
     */
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<TripResponse>> startTrip(
            @Valid @RequestBody StartTripRequest request) {
        log.info("Starting trip for driver: {}, route: {}", request.getDriverId(), request.getRouteId());
        TripResponse trip = tripService.startTrip(request, MOCK_TENANT_ID);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip started successfully", trip));
    }

    /**
     * End an active trip
     */
    @PostMapping("/{tripId}/end")
    public ResponseEntity<ApiResponse<TripResponse>> endTrip(@PathVariable UUID tripId) {
        log.info("Ending trip: {}", tripId);
        TripResponse trip = tripService.endTrip(tripId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Trip ended successfully", trip));
    }

    /**
     * Get all active trips
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getActiveTrips() {
        log.info("Fetching active trips for tenant: {}", MOCK_TENANT_ID);
        List<TripResponse> trips = tripService.getActiveTrips(MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    /**
     * Get trip by ID
     */
    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@PathVariable UUID tripId) {
        log.info("Fetching trip: {}", tripId);
        TripResponse trip = tripService.getTripById(tripId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    /**
     * Get trips by driver ID
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getTripsByDriver(@PathVariable UUID driverId) {
        log.info("Fetching trips for driver: {}", driverId);
        List<TripResponse> trips = tripService.getTripsByDriver(driverId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    /**
     * Get active trip for a driver
     */
    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<ApiResponse<TripResponse>> getActiveTripForDriver(@PathVariable UUID driverId) {
        log.info("Fetching active trip for driver: {}", driverId);
        TripResponse trip = tripService.getActiveTripForDriver(driverId, MOCK_TENANT_ID);
        if (trip == null) {
            return ResponseEntity.ok(ApiResponse.success("No active trip", null));
        }
        return ResponseEntity.ok(ApiResponse.success(trip));
    }
}
