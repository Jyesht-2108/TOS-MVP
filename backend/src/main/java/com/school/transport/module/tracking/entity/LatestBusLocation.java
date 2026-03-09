package com.school.transport.module.tracking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "latest_bus_location")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LatestBusLocation {

    @Id
    @Column(name = "trip_id", nullable = false)
    private UUID tripId;

    @Column(name = "route_id", nullable = false)
    private UUID routeId;

    @Column(name = "driver_id", nullable = false)
    private UUID driverId;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "speed", precision = 5, scale = 2)
    private BigDecimal speed;

    @Column(name = "heading", precision = 5, scale = 2)
    private BigDecimal heading;

    @Column(name = "accuracy_m", precision = 5, scale = 2)
    private BigDecimal accuracyM;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
