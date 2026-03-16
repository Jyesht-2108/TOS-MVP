package com.school.transport.module.notifications.controller;

import com.school.transport.module.notifications.service.DriverNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
@Slf4j
public class DriverNotificationController {

    private final DriverNotificationService driverNotificationService;

    /**
     * SSE endpoint for driver to receive real-time notifications
     * Driver connects once and keeps connection alive to receive updates
     * 
     * Events sent to driver:
     * - STUDENT_ASSIGNED: New student added to route
     * - STUDENT_REMOVED: Student removed from route
     * - ROUTE_UPDATED: Route details changed
     * - TRIP_STATUS_CHANGED: Trip status updated by admin
     */
    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents(@RequestParam UUID driverId) {
        log.info("Driver {} connecting to SSE stream", driverId);
        return driverNotificationService.createConnection(driverId);
    }
}
