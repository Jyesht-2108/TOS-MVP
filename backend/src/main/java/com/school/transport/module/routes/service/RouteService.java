package com.school.transport.module.routes.service;

import com.school.transport.common.exception.NotFoundException;
import com.school.transport.common.exception.ValidationException;
import com.school.transport.module.routes.dto.*;
import com.school.transport.module.routes.entity.Route;
import com.school.transport.module.routes.entity.RouteDriverAssignment;
import com.school.transport.module.routes.entity.RouteStudent;
import com.school.transport.module.routes.repository.RouteDriverAssignmentRepository;
import com.school.transport.module.routes.repository.RouteRepository;
import com.school.transport.module.routes.repository.RouteStudentRepository;
import com.school.transport.module.notifications.service.DriverNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStudentRepository routeStudentRepository;
    private final RouteDriverAssignmentRepository routeDriverAssignmentRepository;
    private final DriverNotificationService driverNotificationService;
    
    // Add repositories for fetching related data
    private final com.school.transport.module.students.repository.StudentRepository studentRepository;
    private final com.school.transport.module.auth.repository.UserRepository userRepository;
    private final com.school.transport.module.drivers.repository.DriverRepository driverRepository;

    /**
     * Fetch all routes for a tenant
     */
    public List<RouteResponse> getAllRoutes(UUID tenantId, String status) {
        log.info("Fetching routes for tenant: {}, status: {}", tenantId, status);
        
        List<Route> routes;
        if (status != null) {
            routes = routeRepository.findByTenantIdAndStatus(tenantId, status);
        } else {
            routes = routeRepository.findByTenantId(tenantId);
        }
        
        return routes.stream()
                .map(this::mapToRouteResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get route by ID
     */
    public RouteResponse getRouteById(UUID routeId, UUID tenantId) {
        log.info("Fetching route: {} for tenant: {}", routeId, tenantId);
        
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        return mapToRouteResponse(route);
    }

    /**
     * Create a new route
     */
    @Transactional
    public RouteResponse createRoute(CreateRouteRequest request, UUID tenantId) {
        log.info("Creating route: {} for tenant: {}", request.getName(), tenantId);
        
        Route route = Route.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        
        route = routeRepository.save(route);
        log.info("Route created successfully with id: {}", route.getId());
        
        return mapToRouteResponse(route);
    }

    /**
     * Update an existing route
     */
    @Transactional
    public RouteResponse updateRoute(UUID routeId, UpdateRouteRequest request, UUID tenantId) {
        log.info("Updating route: {} for tenant: {}", routeId, tenantId);
        
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        if (request.getName() != null) {
            route.setName(request.getName());
        }
        if (request.getStatus() != null) {
            route.setStatus(request.getStatus());
        }
        
        route = routeRepository.save(route);
        log.info("Route updated successfully: {}", routeId);
        
        return mapToRouteResponse(route);
    }

    /**
     * Delete a route
     */
    @Transactional
    public void deleteRoute(UUID routeId, UUID tenantId) {
        log.info("Deleting route: {} for tenant: {}", routeId, tenantId);
        
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        routeRepository.delete(route);
        log.info("Route deleted successfully: {}", routeId);
    }

    /**
     * Assign driver to route
     */
    @Transactional
    public void assignDriver(UUID routeId, AssignDriverRequest request, UUID tenantId) {
        log.info("Assigning driver {} to route {} for tenant {}", request.getDriverId(), routeId, tenantId);
        
        // Verify route exists and belongs to tenant
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        // Check if driver is already assigned to this route
        Optional<RouteDriverAssignment> existingAssignment = 
                routeDriverAssignmentRepository.findActiveAssignmentByRouteId(routeId);
        
        if (existingAssignment.isPresent()) {
            RouteDriverAssignment existing = existingAssignment.get();
            
            // If same driver, no need to do anything
            if (existing.getDriverId().equals(request.getDriverId())) {
                log.info("Driver {} is already assigned to route {}", request.getDriverId(), routeId);
                return;
            }
            
            // Deactivate all existing assignments for this route using bulk update
            int deactivated = routeDriverAssignmentRepository
                    .deactivateActiveAssignmentsByRouteId(routeId, LocalDateTime.now());
            log.info("Deactivated {} previous driver assignment(s) for route: {}", deactivated, routeId);
        }
        
        // Create new assignment
        RouteDriverAssignment assignment = RouteDriverAssignment.builder()
                .routeId(routeId)
                .driverId(request.getDriverId())
                .activeFrom(LocalDateTime.now())
                .build();
        
        routeDriverAssignmentRepository.save(assignment);
        log.info("Driver {} assigned successfully to route: {}", request.getDriverId(), routeId);
    }

    /**
     * Assign students to route
     */
    @Transactional
    public void assignStudents(UUID routeId, AssignStudentsRequest request, UUID tenantId) {
        log.info("Assigning {} students to route {} for tenant {}", 
                request.getStudentIds().size(), routeId, tenantId);
        
        // Verify route exists and belongs to tenant
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        // Create route-student assignments
        List<RouteStudent> assignments = request.getStudentIds().stream()
                .filter(studentId -> !routeStudentRepository.existsByRouteIdAndStudentId(routeId, studentId))
                .map(studentId -> RouteStudent.builder()
                        .routeId(routeId)
                        .studentId(studentId)
                        .build())
                .collect(Collectors.toList());
        
        routeStudentRepository.saveAll(assignments);
        log.info("Assigned {} students to route: {}", assignments.size(), routeId);
        
        // Get the driver assigned to this route
        RouteDriverAssignment activeDriver = routeDriverAssignmentRepository
                .findActiveAssignmentByRouteId(routeId)
                .orElse(null);
        
        // Send SSE notification to driver for each student assigned
        if (activeDriver != null) {
            for (UUID studentId : request.getStudentIds()) {
                driverNotificationService.notifyDriver(
                    activeDriver.getDriverId(), 
                    "STUDENT_ASSIGNED", 
                    java.util.Map.of(
                        "studentId", studentId,
                        "routeId", routeId
                    )
                );
            }
        }
    }

    /**
     * Remove student from route
     */
    @Transactional
    public void removeStudent(UUID routeId, UUID studentId, UUID tenantId) {
        log.info("Removing student {} from route {} for tenant {}", studentId, routeId, tenantId);
        
        // Verify route exists and belongs to tenant
        Route route = routeRepository.findByIdAndTenantId(routeId, tenantId)
                .orElseThrow(() -> new NotFoundException("Route not found with id: " + routeId));
        
        if (!routeStudentRepository.existsByRouteIdAndStudentId(routeId, studentId)) {
            throw new NotFoundException("Student not assigned to this route");
        }
        
        routeStudentRepository.deleteByRouteIdAndStudentId(routeId, studentId);
        log.info("Student removed from route successfully");
        
        // Get the driver assigned to this route
        RouteDriverAssignment activeDriver = routeDriverAssignmentRepository
                .findActiveAssignmentByRouteId(routeId)
                .orElse(null);
        
        // Send SSE notification to driver
        if (activeDriver != null) {
            driverNotificationService.notifyDriver(
                activeDriver.getDriverId(),
                "STUDENT_REMOVED", 
                java.util.Map.of(
                    "studentId", studentId,
                    "routeId", routeId
                )
            );
        }
    }

    /**
     * Get routes assigned to a specific driver
     */
    public List<RouteResponse> getRoutesByDriver(UUID driverId, UUID tenantId) {
        log.info("Fetching routes for driver: {} in tenant: {}", driverId, tenantId);
        
        // Get all active assignments for this driver
        List<RouteDriverAssignment> assignments = routeDriverAssignmentRepository
                .findByDriverIdAndActiveTo(driverId, null);
        
        // Get route IDs
        List<UUID> routeIds = assignments.stream()
                .map(RouteDriverAssignment::getRouteId)
                .collect(Collectors.toList());
        
        if (routeIds.isEmpty()) {
            log.info("No routes found for driver: {}", driverId);
            return List.of();
        }
        
        // Fetch routes
        List<Route> routes = routeRepository.findAllById(routeIds);
        
        return routes.stream()
                .filter(route -> route.getTenantId().equals(tenantId))
                .map(this::mapToRouteResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map Route entity to RouteResponse DTO
     */
    private RouteResponse mapToRouteResponse(Route route) {
        // Get active driver assignment
        RouteDriverAssignment activeDriver = routeDriverAssignmentRepository
                .findActiveAssignmentByRouteId(route.getId())
                .orElse(null);
        
        // Get student count
        long studentCount = routeStudentRepository.countByRouteId(route.getId());
        
        return RouteResponse.builder()
                .id(route.getId())
                .tenantId(route.getTenantId())
                .name(route.getName())
                .status(route.getStatus())
                .driverId(activeDriver != null ? activeDriver.getDriverId() : null)
                .driverName(null) // TODO: Fetch from user service when implemented
                .studentCount((int) studentCount)
                .createdAt(route.getCreatedAt())
                .updatedAt(route.getUpdatedAt())
                .build();
    }

    /**
     * Get students assigned to a route
     */
    public List<com.school.transport.module.routes.dto.RouteStudentResponse> getRouteStudents(UUID routeId, UUID tenantId) {
        log.info("Fetching students for route: {}", routeId);
        
        // Verify route exists and belongs to tenant
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new NotFoundException("Route not found"));
        
        if (!route.getTenantId().equals(tenantId)) {
            throw new ValidationException("Route does not belong to this tenant");
        }
        
        // Get all students for this route
        List<RouteStudent> routeStudents = routeStudentRepository.findByRouteId(routeId);
        
        // Map to DTOs with student details
        return routeStudents.stream()
                .map(rs -> {
                    var student = studentRepository.findById(rs.getStudentId()).orElse(null);
                    
                    return com.school.transport.module.routes.dto.RouteStudentResponse.builder()
                            .routeId(rs.getRouteId())
                            .studentId(rs.getStudentId())
                            .student(student != null ? 
                                com.school.transport.module.routes.dto.RouteStudentResponse.StudentInfo.builder()
                                    .id(student.getId())
                                    .name(student.getName())
                                    .grade(student.getGrade())
                                    .section(student.getSection())
                                    .status(student.getStatus())
                                    .build()
                                : null)
                            .attendancePresent(0) // TODO: Calculate from attendance records
                            .attendanceTotal(0)   // TODO: Calculate from attendance records
                            .createdAt(rs.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get driver assignments for a route
     */
    public List<com.school.transport.module.routes.dto.RouteDriverAssignmentResponse> getRouteDriverAssignments(UUID routeId, UUID tenantId) {
        log.info("Fetching driver assignments for route: {}", routeId);
        
        // Verify route exists and belongs to tenant
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new NotFoundException("Route not found"));
        
        if (!route.getTenantId().equals(tenantId)) {
            throw new ValidationException("Route does not belong to this tenant");
        }
        
        // Get all driver assignments for this route
        List<RouteDriverAssignment> assignments = routeDriverAssignmentRepository.findByRouteId(routeId);
        
        // Map to DTOs with driver details
        return assignments.stream()
                .map(assignment -> {
                    var user = userRepository.findById(assignment.getDriverId()).orElse(null);
                    com.school.transport.module.drivers.entity.Driver driver = null;
                    if (user != null) {
                        driver = driverRepository.findByUserId(user.getId()).orElse(null);
                    }
                    
                    final com.school.transport.module.drivers.entity.Driver finalDriver = driver;
                    
                    return com.school.transport.module.routes.dto.RouteDriverAssignmentResponse.builder()
                            .id(assignment.getId())
                            .routeId(assignment.getRouteId())
                            .driverId(assignment.getDriverId())
                            .activeFrom(assignment.getActiveFrom())
                            .activeTo(assignment.getActiveTo())
                            .driver(user != null ?
                                com.school.transport.module.routes.dto.RouteDriverAssignmentResponse.DriverInfo.builder()
                                    .id(user.getId())
                                    .name(user.getName())
                                    .phone(user.getPhone())
                                    .vehicleNumber(finalDriver != null ? finalDriver.getVehicleNumber() : null)
                                    .status(user.getStatus().toString())
                                    .build()
                                : null)
                            .createdAt(assignment.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
