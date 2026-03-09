package com.school.transport.module.attendance.repository;

import com.school.transport.module.attendance.entity.AttendanceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceAuditRepository extends JpaRepository<AttendanceAudit, UUID> {
    
    List<AttendanceAudit> findByTripId(UUID tripId);
    
    List<AttendanceAudit> findByStudentId(UUID studentId);
    
    List<AttendanceAudit> findByTripIdAndStudentId(UUID tripId, UUID studentId);
    
    List<AttendanceAudit> findByEditedBy(UUID editedBy);
}
