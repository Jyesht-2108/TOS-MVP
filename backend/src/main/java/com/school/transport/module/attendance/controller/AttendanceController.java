package com.school.transport.module.attendance.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.attendance.dto.AttendanceResponse;
import com.school.transport.module.attendance.dto.AttendanceSummaryResponse;
import com.school.transport.module.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Get attendance summary for a trip
     * Used by admin portal to view real-time attendance
     */
    @GetMapping
    public ResponseEntity<ApiResponse<AttendanceSummaryResponse>> getTripAttendance(
            @RequestParam("trip_id") UUID tripId) {
        log.info("Fetching attendance for trip: {}", tripId);
        
        AttendanceSummaryResponse summary = attendanceService.getTripAttendanceSummary(tripId);
        
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    /**
     * Get single attendance record by ID
     */
    @GetMapping("/{attendanceId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(
            @PathVariable UUID attendanceId) {
        log.info("Fetching attendance record: {}", attendanceId);
        
        AttendanceResponse attendance = attendanceService.getAttendanceById(attendanceId);
        
        return ResponseEntity.ok(ApiResponse.success(attendance));
    }
}
