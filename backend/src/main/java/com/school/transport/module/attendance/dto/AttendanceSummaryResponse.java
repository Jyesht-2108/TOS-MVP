package com.school.transport.module.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {
    private UUID tripId;
    private Integer totalStudents;
    private Integer presentCount;
    private Integer absentCount;
    private Integer unmarkedCount;
    private List<AttendanceResponse> students;
}
