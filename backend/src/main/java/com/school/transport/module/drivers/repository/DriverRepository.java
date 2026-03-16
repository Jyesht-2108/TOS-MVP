package com.school.transport.module.drivers.repository;

import com.school.transport.module.drivers.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {
    long countByStatus(String status);
}
