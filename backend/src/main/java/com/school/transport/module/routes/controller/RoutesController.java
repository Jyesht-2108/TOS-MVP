package com.school.transport.module.routes.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.routes.dto.*;
import com.school.transport.module.routes.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
public class RoutesController {

    private final RouteService routeService;
    
    // TODO: Get tenantId from authenticated user context
    // Using the actual tenant ID from seed data
    private static final UUID MOCK_TENANT_ID = UUID.fromString("a0000000-0000-0000-0000-000000000001");

    /**
     * Get all routes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes(
            @RequestParam(required = false) String status) {
        List<RouteResponse> routes = routeService.getAllRoutes(MOCK_TENANT_ID, status);
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    /**
     * Get route by ID
     */
    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable UUID routeId) {
        RouteResponse route = routeService.getRouteById(routeId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(route));
    }

    /**
     * Create new route
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody CreateRouteRequest request) {
        RouteResponse route = routeService.createRoute(request, MOCK_TENANT_ID);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Route created successfully", route));
    }

    /**
     * Update route
     */
    @PutMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable UUID routeId,
            @Valid @RequestBody UpdateRouteRequest request) {
        RouteResponse route = routeService.updateRoute(routeId, request, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", route));
    }

    /**
     * Delete route
     */
    @DeleteMapping("/{routeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable UUID routeId) {
        routeService.deleteRoute(routeId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully", null));
    }

    /**
     * Assign driver to route
     */
    @PostMapping("/{routeId}/assign-driver")
    public ResponseEntity<ApiResponse<Void>> assignDriver(
            @PathVariable UUID routeId,
            @Valid @RequestBody AssignDriverRequest request) {
        routeService.assignDriver(routeId, request, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Driver assigned successfully", null));
    }

    /**
     * Assign students to route
     */
    @PostMapping("/{routeId}/assign-students")
    public ResponseEntity<ApiResponse<Void>> assignStudents(
            @PathVariable UUID routeId,
            @Valid @RequestBody AssignStudentsRequest request) {
        routeService.assignStudents(routeId, request, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Students assigned successfully", null));
    }

    /**
     * Remove student from route
     */
    @DeleteMapping("/{routeId}/students/{studentId}")
    public ResponseEntity<ApiResponse<Void>> removeStudent(
            @PathVariable UUID routeId,
            @PathVariable UUID studentId) {
        routeService.removeStudent(routeId, studentId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success("Student removed successfully", null));
    }

    /**
     * Get students assigned to a route
     */
    @GetMapping("/{routeId}/students")
    public ResponseEntity<ApiResponse<List<com.school.transport.module.routes.dto.RouteStudentResponse>>> getRouteStudents(@PathVariable UUID routeId) {
        List<com.school.transport.module.routes.dto.RouteStudentResponse> students = routeService.getRouteStudents(routeId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    /**
     * Get driver assignments for a route
     */
    @GetMapping("/{routeId}/drivers")
    public ResponseEntity<ApiResponse<List<com.school.transport.module.routes.dto.RouteDriverAssignmentResponse>>> getRouteDrivers(@PathVariable UUID routeId) {
        List<com.school.transport.module.routes.dto.RouteDriverAssignmentResponse> drivers = routeService.getRouteDriverAssignments(routeId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(drivers));
    }

    /**
     * Get routes assigned to a specific driver
     * Used by driver mobile app to fetch their assigned routes
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByDriver(
            @PathVariable UUID driverId) {
        List<RouteResponse> routes = routeService.getRoutesByDriver(driverId, MOCK_TENANT_ID);
        return ResponseEntity.ok(ApiResponse.success(routes));
    }
}
