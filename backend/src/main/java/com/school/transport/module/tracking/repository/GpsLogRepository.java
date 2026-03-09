package com.school.transport.module.tracking.repository;

import com.school.transport.module.tracking.entity.GpsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface GpsLogRepository extends JpaRepository<GpsLog, UUID> {
    
    List<GpsLog> findByTripId(UUID tripId);
    
    @Query("SELECT g FROM GpsLog g WHERE g.tripId = :tripId ORDER BY g.timestamp DESC")
    List<GpsLog> findByTripIdOrderByTimestampDesc(UUID tripId);
    
    @Query("SELECT g FROM GpsLog g WHERE g.tripId = :tripId AND g.timestamp BETWEEN :startTime AND :endTime ORDER BY g.timestamp ASC")
    List<GpsLog> findByTripIdAndTimestampBetween(UUID tripId, LocalDateTime startTime, LocalDateTime endTime);
}
