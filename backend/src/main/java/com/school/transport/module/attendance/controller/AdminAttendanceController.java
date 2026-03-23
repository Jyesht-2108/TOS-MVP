package com.school.transport.module.attendance.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.attendance.dto.AdminOverrideRequest;
import com.school.transport.module.attendance.dto.AttendanceAuditResponse;
import com.school.transport.module.attendance.dto.AttendanceResponse;
import com.school.transport.module.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/attendance")
@RequiredArgsConstructor
public class AdminAttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Admin override attendance status
     * PATCH /api/v1/admin/attendance/{attendanceId}
     */
    @PatchMapping("/{attendanceId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> overrideAttendance(
            @PathVariable UUID attendanceId,
            @Valid @RequestBody AdminOverrideRequest request) {
        
        log.info("Admin override request for attendance: {}, new status: {}", 
                attendanceId, request.getStatus());
        
        // TODO: Get actual admin user ID from security context
        // For now, using a placeholder admin ID
        UUID adminUserId = UUID.fromString("10000000-0000-0000-0000-000000000001");
        
        AttendanceResponse response = attendanceService.overrideAttendance(
                attendanceId, 
                request.getStatus(), 
                request.getReason(), 
                adminUserId
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get attendance audit log for a trip
     * GET /api/v1/admin/attendance/audit?trip_id={tripId}
     */
    @GetMapping("/audit")
    public ResponseEntity<ApiResponse<List<AttendanceAuditResponse>>> getAuditLog(
            @RequestParam("trip_id") UUID tripId) {
        
        log.info("Fetching attendance audit log for trip: {}", tripId);
        
        List<AttendanceAuditResponse> auditLog = attendanceService.getAttendanceAuditLog(tripId);
        
        return ResponseEntity.ok(ApiResponse.success(auditLog));
    }
}
