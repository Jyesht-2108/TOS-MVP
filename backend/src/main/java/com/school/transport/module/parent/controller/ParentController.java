package com.school.transport.module.parent.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.parent.dto.ChildAttendanceSummaryResponse;
import com.school.transport.module.parent.dto.ChildTransportInfoResponse;
import com.school.transport.module.parent.dto.ParentDashboardStatsResponse;
import com.school.transport.module.parent.dto.ParentLiveTripResponse;
import com.school.transport.module.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Parent Portal endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/parent")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    /**
     * Get active live trip for parent's children
     * Returns trip details if any child has an active trip, 404 otherwise
     */
    @GetMapping("/live-trip")
    public ResponseEntity<ApiResponse<ParentLiveTripResponse>> getActiveLiveTrip(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        // For MVP: Get user ID from header or use default parent
        String parentUserId = userIdHeader != null ? userIdHeader : "30000000-0000-0000-0000-000000000001";
        
        log.debug("Fetching active live trip for parent: {}", parentUserId);
        
        ParentLiveTripResponse liveTrip = parentService.getActiveLiveTrip(parentUserId);
        
        if (liveTrip == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(ApiResponse.success(liveTrip));
    }

    /**
     * Get dashboard statistics for parent
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<ParentDashboardStatsResponse>> getDashboardStats(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        // For MVP: Get user ID from header or use default parent
        String parentUserId = userIdHeader != null ? userIdHeader : "30000000-0000-0000-0000-000000000001";
        
        log.debug("Fetching dashboard stats for parent: {}", parentUserId);
        
        ParentDashboardStatsResponse stats = parentService.getDashboardStats(parentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get children transport information for parent
     */
    @GetMapping("/children/transport")
    public ResponseEntity<ApiResponse<List<ChildTransportInfoResponse>>> getChildrenTransport(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        // For MVP: Get user ID from header or use default parent
        String parentUserId = userIdHeader != null ? userIdHeader : "30000000-0000-0000-0000-000000000001";
        
        log.debug("Fetching children transport for parent: {}", parentUserId);
        
        List<ChildTransportInfoResponse> children = parentService.getChildrenTransport(parentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(children));
    }

    /**
     * Get attendance summary for a specific child
     */
    @GetMapping("/children/{childId}/attendance")
    public ResponseEntity<ApiResponse<ChildAttendanceSummaryResponse>> getChildAttendance(
            @PathVariable String childId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        // For MVP: Get user ID from header or use default parent
        String parentUserId = userIdHeader != null ? userIdHeader : "30000000-0000-0000-0000-000000000001";
        
        log.debug("Fetching attendance for child: {} by parent: {}", childId, parentUserId);
        
        ChildAttendanceSummaryResponse attendance = parentService.getChildAttendance(parentUserId, childId);
        
        return ResponseEntity.ok(ApiResponse.success(attendance));
    }
}
