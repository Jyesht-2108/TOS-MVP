package com.school.transport.module.attendance.service;

import com.school.transport.common.exception.NotFoundException;
import com.school.transport.module.attendance.dto.AttendanceResponse;
import com.school.transport.module.attendance.dto.AttendanceSummaryResponse;
import com.school.transport.module.attendance.entity.Attendance;
import com.school.transport.module.attendance.entity.AttendanceAudit;
import com.school.transport.module.attendance.repository.AttendanceAuditRepository;
import com.school.transport.module.attendance.repository.AttendanceRepository;
import com.school.transport.module.students.entity.Student;
import com.school.transport.module.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceAuditRepository attendanceAuditRepository;
    private final StudentRepository studentRepository;

    /**
     * Get attendance summary for a trip with student details
     */
    @Transactional(readOnly = true)
    public AttendanceSummaryResponse getTripAttendanceSummary(UUID tripId) {
        log.info("Fetching attendance summary for trip: {}", tripId);
        
        List<Attendance> attendanceList = attendanceRepository.findByTripId(tripId);
        
        if (attendanceList.isEmpty()) {
            log.warn("No attendance records found for trip: {}", tripId);
            return AttendanceSummaryResponse.builder()
                    .tripId(tripId)
                    .totalStudents(0)
                    .presentCount(0)
                    .absentCount(0)
                    .unmarkedCount(0)
                    .students(List.of())
                    .build();
        }
        
        // Get all student IDs
        List<UUID> studentIds = attendanceList.stream()
                .map(Attendance::getStudentId)
                .collect(Collectors.toList());
        
        // Fetch student details
        Map<UUID, Student> studentMap = studentRepository.findAllById(studentIds).stream()
                .collect(Collectors.toMap(Student::getId, s -> s));
        
        // Build response list
        List<AttendanceResponse> studentAttendance = attendanceList.stream()
                .map(attendance -> {
                    Student student = studentMap.get(attendance.getStudentId());
                    return AttendanceResponse.builder()
                            .id(attendance.getId())
                            .tripId(attendance.getTripId())
                            .studentId(attendance.getStudentId())
                            .studentName(student != null ? student.getName() : "Unknown")
                            .status(attendance.getStatus())
                            .markedAt(attendance.getMarkedAt())
                            .markedBy(attendance.getMarkedBy())
                            .createdAt(attendance.getCreatedAt())
                            .updatedAt(attendance.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());
        
        // Calculate counts
        long presentCount = attendanceList.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
        
        long absentCount = attendanceList.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                .count();
        
        long unmarkedCount = attendanceList.stream()
                .filter(a -> a.getStatus() == null)
                .count();
        
        return AttendanceSummaryResponse.builder()
                .tripId(tripId)
                .totalStudents(attendanceList.size())
                .presentCount((int) presentCount)
                .absentCount((int) absentCount)
                .unmarkedCount((int) unmarkedCount)
                .students(studentAttendance)
                .build();
    }

    /**
     * Get single attendance record by ID
     */
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(UUID attendanceId) {
        log.info("Fetching attendance record: {}", attendanceId);
        
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new NotFoundException("Attendance record not found: " + attendanceId));
        
        Student student = studentRepository.findById(attendance.getStudentId())
                .orElse(null);
        
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .tripId(attendance.getTripId())
                .studentId(attendance.getStudentId())
                .studentName(student != null ? student.getName() : "Unknown")
                .status(attendance.getStatus())
                .markedAt(attendance.getMarkedAt())
                .markedBy(attendance.getMarkedBy())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }

    /**
     * Admin override attendance status
     */
    @Transactional
    public AttendanceResponse overrideAttendance(UUID attendanceId, Attendance.AttendanceStatus newStatus, 
                                                  String reason, UUID adminUserId) {
        log.info("Admin override for attendance: {} by user: {}", attendanceId, adminUserId);
        
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new NotFoundException("Attendance record not found: " + attendanceId));
        
        Attendance.AttendanceStatus oldStatus = attendance.getStatus();
        
        // Update attendance
        attendance.setStatus(newStatus);
        attendance.setUpdatedAt(LocalDateTime.now());
        attendanceRepository.save(attendance);
        
        // Create audit log using native query to handle PostgreSQL enum
        attendanceAuditRepository.insertAuditLog(
                UUID.randomUUID(),
                attendanceId,
                attendance.getTripId(),
                attendance.getStudentId(),
                oldStatus != null ? oldStatus.name() : null,
                newStatus.name(),
                reason,
                adminUserId,
                LocalDateTime.now()
        );
        
        log.info("Attendance override completed. Old: {}, New: {}", oldStatus, newStatus);
        
        return getAttendanceById(attendanceId);
    }
}
