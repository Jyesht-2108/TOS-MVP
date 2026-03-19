package com.school.transport.module.tracking.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.tracking.dto.LiveTrackingResponse;
import com.school.transport.module.tracking.service.GpsTrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracking")
@RequiredArgsConstructor
@Slf4j
public class TrackingController {

    private final GpsTrackingService gpsTrackingService;

    /**
     * Get live tracking data for a route
     * Used by admin dashboard and parent portal for live map
     */
    @GetMapping("/live")
    public ResponseEntity<ApiResponse<LiveTrackingResponse>> getLiveTracking(
            @RequestParam("route_id") UUID routeId) {
        log.info("Fetching live tracking for route: {}", routeId);
        
        try {
            LiveTrackingResponse tracking = gpsTrackingService.getLiveTrackingByRoute(routeId);
            return ResponseEntity.ok(ApiResponse.success(tracking));
        } catch (Exception e) {
            log.error("Error fetching live tracking for route {}: {}", routeId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
