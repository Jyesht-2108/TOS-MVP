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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStudentRepository routeStudentRepository;
    private final RouteDriverAssignmentRepository routeDriverAssignmentRepository;

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
        
        // Check if there's already an active assignment
        routeDriverAssignmentRepository.findActiveAssignmentByRouteId(routeId)
                .ifPresent(existingAssignment -> {
                    // Deactivate existing assignment
                    existingAssignment.setActiveTo(LocalDateTime.now());
                    routeDriverAssignmentRepository.save(existingAssignment);
                    log.info("Deactivated previous driver assignment for route: {}", routeId);
                });
        
        // Create new assignment
        RouteDriverAssignment assignment = RouteDriverAssignment.builder()
                .routeId(routeId)
                .driverId(request.getDriverId())
                .activeFrom(LocalDateTime.now())
                .build();
        
        routeDriverAssignmentRepository.save(assignment);
        log.info("Driver assigned successfully to route: {}", routeId);
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
}
