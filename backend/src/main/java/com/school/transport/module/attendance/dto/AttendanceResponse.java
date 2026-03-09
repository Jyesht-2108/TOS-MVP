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
public class AttendanceResponse {
    private UUID id;
    private UUID tripId;
    private UUID studentId;
    private String studentName;
    private Attendance.AttendanceStatus status;
    private LocalDateTime markedAt;
    private UUID markedBy;
    private String markedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
