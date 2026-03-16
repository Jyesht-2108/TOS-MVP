package com.school.transport.module.tracking.service;

import com.school.transport.module.tracking.dto.GpsUpdateMessage;
import com.school.transport.module.tracking.entity.GpsLog;
import com.school.transport.module.tracking.entity.LatestBusLocation;
import com.school.transport.module.tracking.repository.GpsLogRepository;
import com.school.transport.module.tracking.repository.LatestBusLocationRepository;
import com.school.transport.module.trips.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GpsTrackingService {

    private final GpsLogRepository gpsLogRepository;
    private final LatestBusLocationRepository latestBusLocationRepository;
    private final TripRepository tripRepository;

    /**
     * Save GPS update from driver
     * - Saves to gps_logs (historical)
     * - Updates latest_bus_location (current)
     */
    @Transactional
    public void saveGpsUpdate(GpsUpdateMessage message) {
        log.debug("Saving GPS update for trip: {}", message.getTripId());
        
        // Verify trip exists
        var trip = tripRepository.findById(message.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found: " + message.getTripId()));
        
        LocalDateTime timestamp = message.getTimestamp() != null ? 
                                  message.getTimestamp() : LocalDateTime.now();
        
        // 1. Save to GPS logs (historical tracking)
        GpsLog gpsLog = GpsLog.builder()
                .tripId(message.getTripId())
                .latitude(message.getLatitude())
                .longitude(message.getLongitude())
                .speed(message.getSpeed())
                .heading(message.getHeading())
                .accuracyM(message.getAccuracy())
                .timestamp(timestamp)
                .receivedAt(LocalDateTime.now())
                .build();
        
        gpsLogRepository.save(gpsLog);
        log.debug("GPS log saved for trip: {}", message.getTripId());
        
        // 2. Update latest bus location (current position)
        LatestBusLocation latestLocation = latestBusLocationRepository
                .findByTripId(message.getTripId())
                .orElse(LatestBusLocation.builder()
                        .tripId(message.getTripId())
                        .routeId(trip.getRouteId())
                        .driverId(trip.getDriverId())
                        .build());
        
        latestLocation.setLatitude(message.getLatitude());
        latestLocation.setLongitude(message.getLongitude());
        latestLocation.setSpeed(message.getSpeed());
        latestLocation.setHeading(message.getHeading());
        latestLocation.setAccuracyM(message.getAccuracy());
        latestLocation.setTimestamp(timestamp);
        latestLocation.setUpdatedAt(LocalDateTime.now());
        
        latestBusLocationRepository.save(latestLocation);
        log.info("Latest bus location updated for trip: {}", message.getTripId());
    }

    /**
     * Get latest bus location for a trip
     * Used by parents to track bus in real-time
     */
    public LatestBusLocation getLatestLocation(UUID tripId) {
        return latestBusLocationRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("No location data found for trip: " + tripId));
    }
}
