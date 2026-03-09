package com.school.transport.module.routes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "route_students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RouteStudent.RouteStudentId.class)
public class RouteStudent {

    @Id
    @Column(name = "route_id", nullable = false)
    private UUID routeId;

    @Id
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Composite key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteStudentId implements Serializable {
        private UUID routeId;
        private UUID studentId;
    }
}
