package com.school.transport.module.trips.service;

import com.school.transport.common.exception.NotFoundException;
import com.school.transport.common.exception.ValidationException;
import com.school.transport.module.routes.repository.RouteRepository;
import com.school.transport.module.trips.dto.StartTripRequest;
import com.school.transport.module.trips.dto.TripResponse;
import com.school.transport.module.trips.entity.Trip;
import com.school.transport.module.trips.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;

    /**
     * Start a new trip
     */
    @Transactional
    public TripResponse startTrip(StartTripRequest request, UUID tenantId) {
        log.info("Starting trip for driver: {}, route: {}, type: {}", 
                request.getDriverId(), request.getRouteId(), request.getTripType());
        
        // Verify route exists
        routeRepository.findByIdAndTenantId(request.getRouteId(), tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + request.getRouteId()));
        
        // Check if driver already has an active trip
        tripRepository.findActiveTripByDriverId(request.getDriverId())
                .ifPresent(existingTrip -> {
                    throw new ValidationException("Driver already has an active trip: " + existingTrip.getId());
                });
        
        // Check if route already has an active trip of this type
        tripRepository.findActiveTripByRouteIdAndTripType(request.getRouteId(), request.getTripType().name())
                .ifPresent(existingTrip -> {
                    throw new ValidationException("Route already has an active " + request.getTripType() + " trip");
                });
        
        // Create new trip
        Trip trip = Trip.builder()
                .tenantId(tenantId)
                .routeId(request.getRouteId())
                .driverId(request.getDriverId())
                .tripType(request.getTripType())
                .tripDate(LocalDate.now())
                .startTime(LocalDateTime.now())
                .status(Trip.TripStatus.ACTIVE)
                .build();
        
        trip = tripRepository.save(trip);
        log.info("Trip started successfully with id: {}", trip.getId());
        
        return mapToTripResponse(trip);
    }

    /**
     * End an active trip
     */
    @Transactional
    public TripResponse endTrip(UUID tripId, UUID tenantId) {
        log.info("Ending trip: {}", tripId);
        
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found with id: " + tripId));
        
        if (!trip.getTenantId().equals(tenantId)) {
            throw new ValidationException("Trip does not belong to this tenant");
        }
        
        if (trip.getStatus() != Trip.TripStatus.ACTIVE) {
            throw new ValidationException("Trip is not active");
        }
        
        trip.setEndTime(LocalDateTime.now());
        trip.setStatus(Trip.TripStatus.ENDED);
        
        trip = tripRepository.save(trip);
        log.info("Trip ended successfully: {}", tripId);
        
        return mapToTripResponse(trip);
    }

    /**
     * Get all active trips for a tenant
     */
    public List<TripResponse> getActiveTrips(UUID tenantId) {
        log.info("Fetching active trips for tenant: {}", tenantId);
        
        List<Trip> trips = tripRepository.findByTenantIdAndStatus(tenantId, "ACTIVE");
        
        return trips.stream()
                .map(this::mapToTripResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get trip by ID
     */
    public TripResponse getTripById(UUID tripId, UUID tenantId) {
        log.info("Fetching trip: {}", tripId);
        
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found with id: " + tripId));
        
        if (!trip.getTenantId().equals(tenantId)) {
            throw new ValidationException("Trip does not belong to this tenant");
        }
        
        return mapToTripResponse(trip);
    }

    /**
     * Get all trips for a driver
     */
    public List<TripResponse> getTripsByDriver(UUID driverId, UUID tenantId) {
        log.info("Fetching trips for driver: {}", driverId);
        
        List<Trip> trips = tripRepository.findByDriverIdAndTenantId(driverId, tenantId);
        
        return trips.stream()
                .map(this::mapToTripResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get active trip for a driver
     */
    public TripResponse getActiveTripForDriver(UUID driverId, UUID tenantId) {
        log.info("Fetching active trip for driver: {}", driverId);
        
        return tripRepository.findActiveTripByDriverId(driverId)
                .map(this::mapToTripResponse)
                .orElse(null);
    }

    /**
     * Map Trip entity to TripResponse DTO
     */
    private TripResponse mapToTripResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .routeId(trip.getRouteId())
                .driverId(trip.getDriverId())
                .tripType(trip.getTripType())
                .tripDate(trip.getTripDate())
                .startTime(trip.getStartTime())
                .endTime(trip.getEndTime())
                .status(trip.getStatus())
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
