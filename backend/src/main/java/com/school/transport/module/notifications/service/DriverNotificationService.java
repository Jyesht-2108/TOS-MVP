package com.school.transport.module.notifications.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class DriverNotificationService {

    private final ObjectMapper objectMapper;
    
    // Store active SSE connections: driverId -> SseEmitter
    private final Map<UUID, SseEmitter> driverConnections = new ConcurrentHashMap<>();

    /**
     * Create SSE connection for driver
     * Connection stays open until driver logs out or connection drops
     */
    public SseEmitter createConnection(UUID driverId) {
        // Create emitter with no timeout (stays open indefinitely)
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        // Store connection
        driverConnections.put(driverId, emitter);
        log.info("SSE connection established for driver: {}", driverId);
        
        // Remove connection on completion or timeout
        emitter.onCompletion(() -> {
            driverConnections.remove(driverId);
            log.info("SSE connection completed for driver: {}", driverId);
        });
        
        emitter.onTimeout(() -> {
            driverConnections.remove(driverId);
            log.warn("SSE connection timeout for driver: {}", driverId);
        });
        
        emitter.onError((ex) -> {
            driverConnections.remove(driverId);
            log.error("SSE connection error for driver {}: {}", driverId, ex.getMessage());
        });
        
        // Send initial connection success event
        try {
            emitter.send(SseEmitter.event()
                    .name("CONNECTED")
                    .data("Connection established"));
        } catch (IOException e) {
            log.error("Error sending initial event to driver {}: {}", driverId, e.getMessage());
        }
        
        return emitter;
    }

    /**
     * Send notification to specific driver
     * Used when admin makes changes (assign student, update route, etc.)
     */
    public void notifyDriver(UUID driverId, String eventType, Object data) {
        SseEmitter emitter = driverConnections.get(driverId);
        
        if (emitter == null) {
            log.warn("No active SSE connection for driver: {}", driverId);
            return;
        }
        
        try {
            String jsonData = objectMapper.writeValueAsString(data);
            emitter.send(SseEmitter.event()
                    .name(eventType)
                    .data(jsonData));
            
            log.info("Sent {} event to driver: {}", eventType, driverId);
        } catch (IOException e) {
            log.error("Error sending event to driver {}: {}", driverId, e.getMessage());
            // Remove dead connection
            driverConnections.remove(driverId);
        }
    }

    /**
     * Check if driver is connected
     */
    public boolean isDriverConnected(UUID driverId) {
        return driverConnections.containsKey(driverId);
    }

    /**
     * Get count of active connections
     */
    public int getActiveConnectionCount() {
        return driverConnections.size();
    }

    /**
     * Disconnect driver (called on logout)
     */
    public void disconnectDriver(UUID driverId) {
        SseEmitter emitter = driverConnections.remove(driverId);
        if (emitter != null) {
            emitter.complete();
            log.info("Driver {} disconnected", driverId);
        }
    }
}
