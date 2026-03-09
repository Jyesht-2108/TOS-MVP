package com.school.transport.module.attendance.repository;

import com.school.transport.module.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    
    List<Attendance> findByTripId(UUID tripId);
    
    List<Attendance> findByStudentId(UUID studentId);
    
    Optional<Attendance> findByTripIdAndStudentId(UUID tripId, UUID studentId);
    
    @Query("SELECT a FROM Attendance a WHERE a.tripId = :tripId AND a.status = :status")
    List<Attendance> findByTripIdAndStatus(UUID tripId, Attendance.AttendanceStatus status);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.tripId = :tripId AND a.status = 'PRESENT'")
    long countPresentByTripId(UUID tripId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.tripId = :tripId AND a.status = 'ABSENT'")
    long countAbsentByTripId(UUID tripId);
}
