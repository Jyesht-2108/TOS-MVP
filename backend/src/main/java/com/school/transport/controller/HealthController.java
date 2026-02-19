package com.school.transport.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, String>> ready() {
        Map<String, String> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                response.put("status", "ready");
                response.put("database", "connected");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("status", "not ready");
            response.put("database", "disconnected");
            return ResponseEntity.status(503).body(response);
        }
        
        response.put("status", "not ready");
        response.put("database", "disconnected");
        return ResponseEntity.status(503).body(response);
    }
}
