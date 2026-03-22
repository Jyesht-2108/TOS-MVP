package com.school.transport.module.attendance.repository;

import com.school.transport.module.attendance.entity.AttendanceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceAuditRepository extends JpaRepository<AttendanceAudit, UUID> {
    
    List<AttendanceAudit> findByTripId(UUID tripId);
    
    List<AttendanceAudit> findByStudentId(UUID studentId);
    
    List<AttendanceAudit> findByTripIdAndStudentId(UUID tripId, UUID studentId);
    
    List<AttendanceAudit> findByEditedBy(UUID editedBy);
    
    @Modifying
    @Query(value = "INSERT INTO attendance_audit (id, attendance_id, trip_id, student_id, old_status, new_status, reason, edited_by, edited_at) " +
                   "VALUES (:id, :attendanceId, :tripId, :studentId, CAST(:oldStatus AS attendance_status_enum), CAST(:newStatus AS attendance_status_enum), :reason, :editedBy, :editedAt)",
           nativeQuery = true)
    void insertAuditLog(@Param("id") UUID id,
                       @Param("attendanceId") UUID attendanceId,
                       @Param("tripId") UUID tripId,
                       @Param("studentId") UUID studentId,
                       @Param("oldStatus") String oldStatus,
                       @Param("newStatus") String newStatus,
                       @Param("reason") String reason,
                       @Param("editedBy") UUID editedBy,
                       @Param("editedAt") LocalDateTime editedAt);
}
