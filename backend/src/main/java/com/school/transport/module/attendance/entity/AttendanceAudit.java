package com.school.transport.module.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendance_audit")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceAudit {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "attendance_id", nullable = false)
    private UUID attendanceId;

    @Column(name = "trip_id", nullable = false)
    private UUID tripId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private Attendance.AttendanceStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status")
    private Attendance.AttendanceStatus newStatus;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "edited_by", nullable = false)
    private UUID editedBy;

    @Column(name = "edited_at", nullable = false)
    private LocalDateTime editedAt;

    @PrePersist
    protected void onCreate() {
        if (editedAt == null) {
            editedAt = LocalDateTime.now();
        }
    }
}
