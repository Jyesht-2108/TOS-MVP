package com.school.transport.module.drivers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private String phone;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String vehicleNumber;
    private String vehicleType;
    private String status;
}
