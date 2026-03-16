package com.school.transport.module.tracking.controller;

import com.school.transport.module.tracking.dto.GpsUpdateMessage;
import com.school.transport.module.tracking.service.GpsTrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
@Slf4j
public class GpsTrackingController {

    private final GpsTrackingService gpsTrackingService;

    /**
     * Receive GPS updates from driver app
     * Driver sends GPS location every 30 seconds during active trip
     */
    @PostMapping("/update")
    public ResponseEntity<?> updateGpsLocation(@RequestBody GpsUpdateMessage message) {
        log.info("Received GPS update for trip: {}, lat: {}, lng: {}", 
                 message.getTripId(), message.getLatitude(), message.getLongitude());
        
        try {
            gpsTrackingService.saveGpsUpdate(message);
            return ResponseEntity.ok().body("GPS location updated successfully");
        } catch (Exception e) {
            log.error("Error saving GPS update: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to update GPS location: " + e.getMessage());
        }
    }

    /**
     * Get latest bus location for a trip
     * Used by parents to track bus in real-time
     */
    @GetMapping("/location/{tripId}")
    public ResponseEntity<?> getLatestLocation(@PathVariable UUID tripId) {
        try {
            var location = gpsTrackingService.getLatestLocation(tripId);
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            log.error("Error fetching location for trip {}: {}", tripId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
