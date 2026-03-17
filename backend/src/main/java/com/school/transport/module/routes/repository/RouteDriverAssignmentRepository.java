package com.school.transport.module.routes.repository;

import com.school.transport.module.routes.entity.RouteDriverAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RouteDriverAssignmentRepository extends JpaRepository<RouteDriverAssignment, UUID> {
    
    List<RouteDriverAssignment> findByRouteId(UUID routeId);
    
    List<RouteDriverAssignment> findByDriverId(UUID driverId);
    
    @Query("SELECT rda FROM RouteDriverAssignment rda WHERE rda.routeId = :routeId AND rda.activeTo IS NULL")
    Optional<RouteDriverAssignment> findActiveAssignmentByRouteId(UUID routeId);
    
    @Query("SELECT rda FROM RouteDriverAssignment rda WHERE rda.driverId = :driverId AND rda.activeTo IS NULL")
    List<RouteDriverAssignment> findActiveAssignmentsByDriverId(UUID driverId);
    
    List<RouteDriverAssignment> findByDriverIdAndActiveTo(UUID driverId, java.time.LocalDateTime activeTo);
    
    @Query("SELECT COUNT(rda) FROM RouteDriverAssignment rda WHERE rda.routeId = :routeId AND rda.activeTo IS NULL")
    long countActiveAssignmentsByRouteId(UUID routeId);
    
    @Modifying
    @Query("UPDATE RouteDriverAssignment rda SET rda.activeTo = :activeTo WHERE rda.routeId = :routeId AND rda.activeTo IS NULL")
    int deactivateActiveAssignmentsByRouteId(UUID routeId, LocalDateTime activeTo);
}
