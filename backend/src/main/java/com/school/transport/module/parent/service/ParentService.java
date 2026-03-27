package com.school.transport.module.parent.service;

import com.school.transport.module.parent.dto.ChildAttendanceSummaryResponse;
import com.school.transport.module.parent.dto.ChildTransportInfoResponse;
import com.school.transport.module.parent.dto.ParentDashboardStatsResponse;
import com.school.transport.module.parent.dto.ParentLiveTripResponse;
import com.school.transport.module.trips.entity.Trip;
import com.school.transport.module.trips.repository.TripRepository;
import com.school.transport.module.routes.entity.Route;
import com.school.transport.module.routes.repository.RouteRepository;
import com.school.transport.module.auth.entity.User;
import com.school.transport.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for Parent Portal operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ParentService {

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Get active live trip for parent's children
     * Returns trip details if any child has an active trip, null otherwise
     */
    @Transactional(readOnly = true)
    public ParentLiveTripResponse getActiveLiveTrip(String parentUserId) {
        log.debug("Finding active trip for parent: {}", parentUserId);
        
        UUID parentUuid = UUID.fromString(parentUserId);
        
        // Query to find children and their routes for this parent
        String sql = """
            SELECT DISTINCT s.id as student_id, s.name as student_name, rs.route_id
            FROM students s
            INNER JOIN student_parents sp ON s.id = sp.student_id
            INNER JOIN route_students rs ON s.id = rs.student_id
            WHERE sp.parent_user_id = ?
            AND s.status = 'ACTIVE'
        """;
        
        List<ChildRouteInfo> childRoutes = jdbcTemplate.query(sql, 
            (rs, rowNum) -> new ChildRouteInfo(
                UUID.fromString(rs.getString("student_id")),
                rs.getString("student_name"),
                UUID.fromString(rs.getString("route_id"))
            ),
            parentUuid
        );
        
        if (childRoutes.isEmpty()) {
            log.debug("No children with routes found for parent: {}", parentUserId);
            return null;
        }
        
        // Check each child's route for an active trip
        for (ChildRouteInfo childRoute : childRoutes) {
            Optional<Trip> activeTripOpt = tripRepository.findActiveByRouteId(childRoute.routeId);
            
            if (activeTripOpt.isPresent()) {
                Trip activeTrip = activeTripOpt.get();
                
                // Get route details
                Optional<Route> routeOpt = routeRepository.findById(childRoute.routeId);
                String routeName = routeOpt.map(Route::getName).orElse("Unknown Route");
                
                // Get driver details and vehicle number
                String driverName = null;
                String vehicleNumber = null;
                
                Optional<User> driverUserOpt = userRepository.findById(activeTrip.getDriverId());
                if (driverUserOpt.isPresent()) {
                    driverName = driverUserOpt.get().getName();
                    
                    // Get vehicle number from drivers table
                    String vehicleSql = "SELECT vehicle_number FROM drivers WHERE user_id = ?";
                    try {
                        vehicleNumber = jdbcTemplate.queryForObject(vehicleSql, String.class, activeTrip.getDriverId());
                    } catch (Exception e) {
                        log.warn("Could not fetch vehicle number for driver: {}", activeTrip.getDriverId());
                    }
                }
                
                log.debug("Found active trip {} for child {} on route {}", 
                    activeTrip.getId(), childRoute.studentName, routeName);
                
                return ParentLiveTripResponse.builder()
                    .tripId(activeTrip.getId().toString())
                    .routeId(activeTrip.getRouteId().toString())
                    .routeName(routeName)
                    .vehicleNumber(vehicleNumber)
                    .driverName(driverName)
                    .childName(childRoute.studentName)
                    .tripType(activeTrip.getTripType().name())
                    .build();
            }
        }
        
        log.debug("No active trips found for any children of parent: {}", parentUserId);
        return null;
    }

    /**
     * Get dashboard statistics for parent
     */
    @Transactional(readOnly = true)
    public ParentDashboardStatsResponse getDashboardStats(String parentUserId) {
        log.debug("Fetching dashboard stats for parent: {}", parentUserId);
        
        UUID parentUuid = UUID.fromString(parentUserId);
        
        // Count children
        String childrenSql = """
            SELECT COUNT(DISTINCT s.id)
            FROM students s
            INNER JOIN student_parents sp ON s.id = sp.student_id
            WHERE sp.parent_user_id = ?
            AND s.status = 'ACTIVE'
        """;
        Integer myChildren = jdbcTemplate.queryForObject(childrenSql, Integer.class, parentUuid);
        
        // Count active routes for children
        String routesSql = """
            SELECT COUNT(DISTINCT rs.route_id)
            FROM students s
            INNER JOIN student_parents sp ON s.id = sp.student_id
            INNER JOIN route_students rs ON s.id = rs.student_id
            INNER JOIN routes r ON rs.route_id = r.id
            WHERE sp.parent_user_id = ?
            AND s.status = 'ACTIVE'
            AND r.status = 'ACTIVE'
        """;
        Integer activeRoutes = jdbcTemplate.queryForObject(routesSql, Integer.class, parentUuid);
        
        // Upcoming trips = active routes * 2 (morning + evening)
        int upcomingTrips = (activeRoutes != null ? activeRoutes : 0) * 2;
        
        return ParentDashboardStatsResponse.builder()
            .myChildren(myChildren != null ? myChildren : 0)
            .activeRoutes(activeRoutes != null ? activeRoutes : 0)
            .upcomingTrips(upcomingTrips)
            .build();
    }

    /**
     * Get children transport information for parent
     */
    @Transactional(readOnly = true)
    public List<ChildTransportInfoResponse> getChildrenTransport(String parentUserId) {
        log.debug("Fetching children transport for parent: {}", parentUserId);
        
        UUID parentUuid = UUID.fromString(parentUserId);
        
        // Query to get children with their route and driver information
        String sql = """
            SELECT DISTINCT ON (s.id)
                s.id as student_id,
                s.name as student_name,
                s.grade,
                r.id as route_id,
                r.name as route_name,
                r.status as route_status,
                u.name as driver_name,
                u.phone as driver_phone,
                d.vehicle_number
            FROM students s
            INNER JOIN student_parents sp ON s.id = sp.student_id
            LEFT JOIN route_students rs ON s.id = rs.student_id
            LEFT JOIN routes r ON rs.route_id = r.id
            LEFT JOIN trips t ON r.id = t.route_id AND t.status = 'ACTIVE'::trip_status_enum
            LEFT JOIN users u ON t.driver_id = u.id
            LEFT JOIN drivers d ON u.id = d.user_id
            WHERE sp.parent_user_id = ?
            AND s.status = 'ACTIVE'
            ORDER BY s.id, r.id
        """;
        
        return jdbcTemplate.query(sql, 
            (rs, rowNum) -> ChildTransportInfoResponse.builder()
                .id(rs.getString("student_id"))
                .name(rs.getString("student_name"))
                .grade(rs.getString("grade"))
                .routeId(rs.getString("route_id"))
                .routeName(rs.getString("route_name"))
                .routeStatus(rs.getString("route_status"))
                .driverName(rs.getString("driver_name"))
                .driverPhone(rs.getString("driver_phone"))
                .vehicleNumber(rs.getString("vehicle_number"))
                .build(),
            parentUuid
        );
    }

    /**
     * Get today's attendance status for a child
     */
    @Transactional(readOnly = true)
    public String getTodayAttendanceStatus(String studentId) {
        log.debug("Fetching today's attendance for student: {}", studentId);
        
        UUID studentUuid = UUID.fromString(studentId);
        
        String sql = """
            SELECT CAST(a.status AS TEXT)
            FROM attendance a
            INNER JOIN trips t ON a.trip_id = t.id
            WHERE a.student_id = ?
            AND t.trip_date = CURRENT_DATE
            AND t.status = 'ACTIVE'::trip_status_enum
            ORDER BY t.start_time DESC
            LIMIT 1
        """;
        
        try {
            return jdbcTemplate.queryForObject(sql, String.class, studentUuid);
        } catch (Exception e) {
            log.debug("No attendance found for student {} today", studentId);
            return null;
        }
    }

    /**
     * Get attendance summary for a specific child
     * Verifies parent has access to this child
     */
    @Transactional(readOnly = true)
    public ChildAttendanceSummaryResponse getChildAttendance(String parentUserId, String studentId) {
        log.debug("Fetching attendance for child: {} by parent: {}", studentId, parentUserId);
        
        UUID parentUuid = UUID.fromString(parentUserId);
        UUID studentUuid = UUID.fromString(studentId);
        
        // Verify parent has access to this child
        String verifySql = """
            SELECT COUNT(*)
            FROM student_parents
            WHERE student_id = ? AND parent_user_id = ?
        """;
        Integer count = jdbcTemplate.queryForObject(verifySql, Integer.class, studentUuid, parentUuid);
        
        if (count == null || count == 0) {
            log.warn("Parent {} does not have access to student {}", parentUserId, studentId);
            return null;
        }
        
        // Get attendance summary
        String sql = """
            SELECT 
                COUNT(*) as total_trips,
                SUM(CASE WHEN a.status::text = 'PRESENT' THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN a.status::text = 'ABSENT' THEN 1 ELSE 0 END) as absent_count,
                SUM(CASE WHEN a.status::text = 'PENDING' THEN 1 ELSE 0 END) as pending_count
            FROM attendance a
            INNER JOIN trips t ON a.trip_id = t.id
            WHERE a.student_id = ?
            AND t.trip_date >= CURRENT_DATE - INTERVAL '30 days'
        """;
        
        AttendanceStats stats = jdbcTemplate.queryForObject(sql,
            (rs, rowNum) -> new AttendanceStats(
                rs.getInt("total_trips"),
                rs.getInt("present_count"),
                rs.getInt("absent_count"),
                rs.getInt("pending_count")
            ),
            studentUuid
        );
        
        if (stats == null || stats.totalTrips == 0) {
            return ChildAttendanceSummaryResponse.builder()
                .studentId(studentId)
                .totalTrips(0)
                .presentCount(0)
                .absentCount(0)
                .pendingCount(0)
                .attendancePercentage(0.0)
                .todayStatus(null)
                .build();
        }
        
        // Calculate percentage
        double percentage = stats.totalTrips > 0 
            ? (stats.presentCount * 100.0) / stats.totalTrips 
            : 0.0;
        
        // Get today's status
        String todayStatus = getTodayAttendanceStatus(studentId);
        
        return ChildAttendanceSummaryResponse.builder()
            .studentId(studentId)
            .totalTrips(stats.totalTrips)
            .presentCount(stats.presentCount)
            .absentCount(stats.absentCount)
            .pendingCount(stats.pendingCount)
            .attendancePercentage(Math.round(percentage * 10.0) / 10.0)
            .todayStatus(todayStatus)
            .build();
    }
    
    /**
     * Helper class to hold child and route information
     */
    private record ChildRouteInfo(UUID studentId, String studentName, UUID routeId) {}
    
    /**
     * Helper class for attendance statistics
     */
    private record AttendanceStats(int totalTrips, int presentCount, int absentCount, int pendingCount) {}
}
