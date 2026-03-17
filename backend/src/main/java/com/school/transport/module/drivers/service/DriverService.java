package com.school.transport.module.drivers.service;

import com.school.transport.module.drivers.dto.DriverResponse;
import com.school.transport.module.drivers.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DriverService {

    private final DriverRepository driverRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Fetch all drivers with their user information
     */
    public List<DriverResponse> getAllDrivers(UUID tenantId) {
        log.info("Fetching all drivers for tenant: {}", tenantId);
        
        String sql = "SELECT " +
            "u.id as user_id, " +
            "u.name, " +
            "u.email, " +
            "u.phone, " +
            "d.license_number, " +
            "d.license_expiry, " +
            "d.vehicle_number, " +
            "d.vehicle_type, " +
            "d.status " +
            "FROM users u " +
            "JOIN drivers d ON d.user_id = u.id " +
            "WHERE u.tenant_id = ? " +
            "AND u.role = 'DRIVER' " +
            "ORDER BY u.name";
        
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            DriverResponse.builder()
                .id(UUID.fromString(rs.getString("user_id")))  // Use user_id as the driver ID for assignment
                .userId(UUID.fromString(rs.getString("user_id")))
                .name(rs.getString("name"))
                .email(rs.getString("email"))
                .phone(rs.getString("phone"))
                .licenseNumber(rs.getString("license_number"))
                .licenseExpiry(rs.getDate("license_expiry").toLocalDate())
                .vehicleNumber(rs.getString("vehicle_number"))
                .vehicleType(rs.getString("vehicle_type"))
                .status(rs.getString("status"))
                .build(),
            tenantId
        );
    }
}
