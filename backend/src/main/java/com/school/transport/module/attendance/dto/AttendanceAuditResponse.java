package com.school.transport.module.attendance.dto;

import com.school.transport.module.attendance.entity.Attendance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceAuditResponse {
    private UUID id;
    private UUID attendanceId;
    private UUID tripId;
    private UUID studentId;
    private String studentName;
    private Attendance.AttendanceStatus oldStatus;
    private Attendance.AttendanceStatus newStatus;
    private String reason;
    private UUID editedBy;
    private String editedByName;
    private LocalDateTime editedAt;
}
