package com.school.transport.module.routes.repository;

import com.school.transport.module.routes.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {
    
    List<Route> findByTenantId(UUID tenantId);
    
    List<Route> findByTenantIdAndStatus(UUID tenantId, String status);
    
    Optional<Route> findByIdAndTenantId(UUID id, UUID tenantId);
    
    long countByTenantId(UUID tenantId);
    
    long countByTenantIdAndStatus(UUID tenantId, String status);
    
    long countByStatus(String status);
}
