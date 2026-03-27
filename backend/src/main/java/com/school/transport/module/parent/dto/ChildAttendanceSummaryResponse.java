package com.school.transport.module.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for child attendance summary
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildAttendanceSummaryResponse {
    private String studentId;
    private int totalTrips;
    private int presentCount;
    private int absentCount;
    private int pendingCount;
    private double attendancePercentage;
    private String todayStatus; // PRESENT, ABSENT, or null if not marked yet
}
