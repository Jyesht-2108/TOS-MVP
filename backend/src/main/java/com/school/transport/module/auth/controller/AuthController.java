package com.school.transport.module.auth.controller;

import com.school.transport.common.dto.ApiResponse;
import com.school.transport.module.auth.dto.LoginRequest;
import com.school.transport.module.auth.dto.LoginResponse;
import com.school.transport.module.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Login endpoint
     * For MVP: Simple authentication without password validation
     * In production: Add proper password hashing and JWT token generation
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
