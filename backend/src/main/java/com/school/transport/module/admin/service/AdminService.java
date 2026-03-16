package com.school.transport.module.admin.service;

import com.school.transport.module.admin.dto.DashboardStatsResponse;
import com.school.transport.module.drivers.repository.DriverRepository;
import com.school.transport.module.routes.repository.RouteRepository;
import com.school.transport.module.students.repository.StudentRepository;
import com.school.transport.module.trips.dto.TripResponse;
import com.school.transport.module.trips.repository.TripRepository;
import com.school.transport.module.trips.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    
    private final DriverRepository driverRepository;
    private final StudentRepository studentRepository;
    private final RouteRepository routeRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;
    
    private static final UUID MOCK_TENANT_ID = UUID.fromString("a0000000-0000-0000-0000-000000000001");
    
    public DashboardStatsResponse getDashboardStatistics() {
        log.info("Calculating dashboard statistics");
        
        long totalDrivers = driverRepository.count();
        long activeDrivers = driverRepository.countByStatus("ACTIVE");
        long totalStudents = studentRepository.count();
        long totalRoutes = routeRepository.count();
        long activeRoutes = routeRepository.countByStatus("ACTIVE");
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long tripsToday = tripRepository.countByStartTimeBetween(startOfDay, endOfDay);
        
        return DashboardStatsResponse.builder()
                .totalDrivers(totalDrivers)
                .activeDrivers(activeDrivers)
                .totalStudents(totalStudents)
                .totalRoutes(totalRoutes)
                .activeRoutes(activeRoutes)
                .tripsToday(tripsToday)
                .build();
    }
    
    public List<TripResponse> getActiveTrips() {
        log.info("Fetching active trips for admin");
        return tripService.getActiveTrips(MOCK_TENANT_ID);
    }
    
    public TripResponse getTripDetails(UUID tripId) {
        log.info("Fetching trip details for admin: {}", tripId);
        return tripService.getTripById(tripId, MOCK_TENANT_ID);
    }
    
    public List<Object> getDriverActivity() {
        log.info("Fetching driver activity");
        // TODO: Implement driver activity tracking
        return java.util.Collections.emptyList();
    }
}
