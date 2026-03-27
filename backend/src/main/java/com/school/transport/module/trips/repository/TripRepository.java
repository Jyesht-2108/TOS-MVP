package com.school.transport.module.trips.repository;

import com.school.transport.module.trips.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {
    
    List<Trip> findByRouteId(UUID routeId);
    
    List<Trip> findByDriverId(UUID driverId);
    
    List<Trip> findByDriverIdAndTenantId(UUID driverId, UUID tenantId);
    
    List<Trip> findByTripDate(LocalDate tripDate);
    
    List<Trip> findByStatus(Trip.TripStatus status);
    
    @Query(value = "SELECT * FROM trips t WHERE t.tenant_id = :tenantId AND t.status = CAST(:status AS trip_status_enum)", nativeQuery = true)
    List<Trip> findByTenantIdAndStatus(UUID tenantId, String status);
    
    @Query("SELECT t FROM Trip t WHERE t.routeId = :routeId AND t.status = :status")
    List<Trip> findByRouteIdAndStatus(UUID routeId, Trip.TripStatus status);
    
    @Query(value = "SELECT * FROM trips t WHERE t.route_id = :routeId AND t.status = 'ACTIVE'", nativeQuery = true)
    Optional<Trip> findActiveByRouteId(UUID routeId);
    
    @Query(value = "SELECT * FROM trips t WHERE t.route_id = :routeId AND t.trip_type::text = :tripType AND t.status = 'ACTIVE'", nativeQuery = true)
    Optional<Trip> findActiveTripByRouteIdAndTripType(UUID routeId, String tripType);
    
    @Query(value = "SELECT * FROM trips t WHERE t.status = 'ACTIVE'", nativeQuery = true)
    List<Trip> findAllActiveTrips();
    
    @Query(value = "SELECT * FROM trips t WHERE t.driver_id = :driverId AND t.status = 'ACTIVE'", nativeQuery = true)
    Optional<Trip> findActiveTripByDriverId(UUID driverId);
    
    long countByStartTimeBetween(java.time.LocalDateTime startOfDay, java.time.LocalDateTime endOfDay);
}
