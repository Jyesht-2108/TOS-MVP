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
    
    List<Trip> findByTripDate(LocalDate tripDate);
    
    List<Trip> findByStatus(Trip.TripStatus status);
    
    @Query("SELECT t FROM Trip t WHERE t.routeId = :routeId AND t.status = :status")
    List<Trip> findByRouteIdAndStatus(UUID routeId, Trip.TripStatus status);
    
    @Query("SELECT t FROM Trip t WHERE t.routeId = :routeId AND t.tripType = :tripType AND t.status = 'ACTIVE'")
    Optional<Trip> findActiveTrip(UUID routeId, Trip.TripType tripType);
    
    @Query("SELECT t FROM Trip t WHERE t.status = 'ACTIVE'")
    List<Trip> findAllActiveTrips();
    
    @Query("SELECT t FROM Trip t WHERE t.driverId = :driverId AND t.status = 'ACTIVE'")
    List<Trip> findActiveTripsForDriver(UUID driverId);
}
