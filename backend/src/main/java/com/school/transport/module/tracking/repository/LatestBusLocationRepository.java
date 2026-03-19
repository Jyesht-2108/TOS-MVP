package com.school.transport.module.tracking.repository;

import com.school.transport.module.tracking.entity.LatestBusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LatestBusLocationRepository extends JpaRepository<LatestBusLocation, UUID> {
    
    Optional<LatestBusLocation> findByTripId(UUID tripId);
    
    Optional<LatestBusLocation> findByRouteId(UUID routeId);
}
