package com.school.transport.module.admin.service;

import com.school.transport.module.admin.dto.DashboardStatsResponse;
import com.school.transport.module.auth.entity.User;
import com.school.transport.module.auth.repository.UserRepository;
import com.school.transport.module.drivers.dto.DriverResponse;
import com.school.transport.module.drivers.entity.Driver;
import com.school.transport.module.drivers.repository.DriverRepository;
import com.school.transport.module.routes.dto.RouteResponse;
import com.school.transport.module.routes.entity.Route;
import com.school.transport.module.routes.repository.RouteRepository;
import com.school.transport.module.students.dto.StudentResponse;
import com.school.transport.module.students.entity.Student;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    
    private final DriverRepository driverRepository;
    private final StudentRepository studentRepository;
    private final RouteRepository routeRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;
    private final UserRepository userRepository;
    
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
        return java.util.Collections.emptyList();
    }
    
    public List<DriverResponse> getDrivers() {
        log.info("Fetching all drivers");
        List<Driver> drivers = driverRepository.findAll();
        
        return drivers.stream()
                .map(driver -> {
                    User user = userRepository.findById(driver.getUserId()).orElse(null);
                    return DriverResponse.builder()
                            .id(driver.getUserId())  // Use userId as the ID for driver assignment
                            .userId(driver.getUserId())
                            .name(user != null ? user.getName() : "Unknown")
                            .email(user != null ? user.getEmail() : "")
                            .phone(user != null ? user.getPhone() : "")
                            .licenseNumber(driver.getLicenseNumber())
                            .licenseExpiry(driver.getLicenseExpiry())
                            .vehicleNumber(driver.getVehicleNumber())
                            .vehicleType(driver.getVehicleType())
                            .status(driver.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    public List<StudentResponse> getStudents() {
        log.info("Fetching all students");
        List<Student> students = studentRepository.findAll();
        
        return students.stream()
                .map(student -> StudentResponse.builder()
                        .id(student.getId())
                        .name(student.getName())
                        .grade(student.getGrade())
                        .section(student.getSection())
                        .rollNumber(student.getRollNumber())
                        .dateOfBirth(student.getDateOfBirth())
                        .gender(student.getGender())
                        .bloodGroup(student.getBloodGroup())
                        .address(student.getAddress())
                        .status(student.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
    
    public List<RouteResponse> getRoutes() {
        log.info("Fetching all routes");
        List<Route> routes = routeRepository.findAll();
        
        return routes.stream()
                .map(route -> RouteResponse.builder()
                        .id(route.getId())
                        .name(route.getName())
                        .status(route.getStatus())
                        .createdAt(route.getCreatedAt())
                        .updatedAt(route.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
