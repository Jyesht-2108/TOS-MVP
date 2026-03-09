package com.school.transport.module.routes.repository;

import com.school.transport.module.routes.entity.RouteStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RouteStudentRepository extends JpaRepository<RouteStudent, RouteStudent.RouteStudentId> {
    
    List<RouteStudent> findByRouteId(UUID routeId);
    
    List<RouteStudent> findByStudentId(UUID studentId);
    
    long countByRouteId(UUID routeId);
    
    void deleteByRouteIdAndStudentId(UUID routeId, UUID studentId);
    
    boolean existsByRouteIdAndStudentId(UUID routeId, UUID studentId);
}
