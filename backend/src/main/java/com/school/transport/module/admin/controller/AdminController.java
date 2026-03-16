package com.school.transport.module.admin.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.admin.dto.DashboardStatsResponse;
import com.school.transport.module.admin.service.AdminService;
import com.school.transport.module.trips.dto.TripResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    
    private final AdminService adminService;
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStatistics() {
        log.info("Fetching dashboard statistics");
        DashboardStatsResponse stats = adminService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }
    
    @GetMapping("/dashboard/activity")
    public ResponseEntity<ApiResponse<List<Object>>> getRecentActivity() {
        log.info("Fetching recent activity");
        return ResponseEntity.ok(ApiResponse.success("Recent activity retrieved", java.util.Collections.emptyList()));
    }
    
    @GetMapping("/trips/active")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getActiveTrips() {
        log.info("Admin fetching active trips");
        List<TripResponse> trips = adminService.getActiveTrips();
        return ResponseEntity.ok(ApiResponse.success("Active trips retrieved", trips));
    }
    
    @GetMapping("/trips/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripDetails(@PathVariable UUID tripId) {
        log.info("Admin fetching trip details: {}", tripId);
        TripResponse trip = adminService.getTripDetails(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip details retrieved", trip));
    }
    
    @GetMapping("/drivers/activity")
    public ResponseEntity<ApiResponse<List<Object>>> getDriverActivity() {
        log.info("Fetching driver activity");
        List<Object> activity = adminService.getDriverActivity();
        return ResponseEntity.ok(ApiResponse.success("Driver activity retrieved", activity));
    }
    
    @GetMapping("/drivers/{driverId}/routes")
    public ResponseEntity<ApiResponse<List<Object>>> getDriverRoutes(@PathVariable UUID driverId) {
        log.info("Fetching routes for driver: {}", driverId);
        return ResponseEntity.ok(ApiResponse.success("Driver routes retrieved", java.util.Collections.emptyList()));
    }
    
    @GetMapping("/drivers/{driverId}/trips")
    public ResponseEntity<ApiResponse<List<Object>>> getDriverTrips(@PathVariable UUID driverId) {
        log.info("Fetching trips for driver: {}", driverId);
        return ResponseEntity.ok(ApiResponse.success("Driver trips retrieved", java.util.Collections.emptyList()));
    }
    
    @GetMapping("/drivers/{driverId}/attendance")
    public ResponseEntity<ApiResponse<Object>> getDriverAttendance(@PathVariable UUID driverId) {
        log.info("Fetching attendance for driver: {}", driverId);
        return ResponseEntity.ok(ApiResponse.success("Driver attendance retrieved", null));
    }
    
    @GetMapping("/drivers/attendance/today")
    public ResponseEntity<ApiResponse<List<Object>>> getTodayDriverAttendance() {
        log.info("Fetching today's driver attendance");
        return ResponseEntity.ok(ApiResponse.success("Today's driver attendance retrieved", java.util.Collections.emptyList()));
    }
    
    @GetMapping("/students/{studentId}/attendance")
    public ResponseEntity<ApiResponse<Object>> getStudentAttendance(@PathVariable UUID studentId) {
        log.info("Fetching attendance for student: {}", studentId);
        return ResponseEntity.ok(ApiResponse.success("Student attendance retrieved", null));
    }
    
    @GetMapping("/students/{studentId}/fees")
    public ResponseEntity<ApiResponse<Object>> getStudentFees(@PathVariable UUID studentId) {
        log.info("Fetching fees for student: {}", studentId);
        return ResponseEntity.ok(ApiResponse.success("Student fees retrieved", null));
    }
    
    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<com.school.transport.module.routes.dto.RouteResponse>>> getRoutes() {
        log.info("Admin fetching routes");
        List<com.school.transport.module.routes.dto.RouteResponse> routes = adminService.getRoutes();
        return ResponseEntity.ok(ApiResponse.success("Routes retrieved", routes));
    }
    
    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<com.school.transport.module.drivers.dto.DriverResponse>>> getDrivers() {
        log.info("Admin fetching drivers");
        List<com.school.transport.module.drivers.dto.DriverResponse> drivers = adminService.getDrivers();
        return ResponseEntity.ok(ApiResponse.success("Drivers retrieved", drivers));
    }
    
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<com.school.transport.module.students.dto.StudentResponse>>> getStudents() {
        log.info("Admin fetching students");
        List<com.school.transport.module.students.dto.StudentResponse> students = adminService.getStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }
}
