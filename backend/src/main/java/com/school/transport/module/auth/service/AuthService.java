package com.school.transport.module.auth.service;

import com.school.transport.common.exception.ValidationException;
import com.school.transport.module.auth.dto.LoginRequest;
import com.school.transport.module.auth.dto.LoginResponse;
import com.school.transport.module.auth.dto.UserDto;
import com.school.transport.module.auth.entity.User;
import com.school.transport.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    /**
     * Simple login - for MVP, we're not validating password
     * In production, you should use BCrypt or similar
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ValidationException("Invalid email or password"));
        
        // Check if user is active
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new ValidationException("User account is not active");
        }
        
        // For MVP: Skip password validation (in production, validate with BCrypt)
        // if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
        //     throw new ValidationException("Invalid email or password");
        // }
        
        log.info("Login successful for user: {} ({})", user.getName(), user.getRole());
        
        // Generate token (for MVP, using simple token)
        String token = "mock-jwt-token-" + user.getId();
        
        // Map to DTO
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .tenantId(user.getTenantId())
                .role(user.getRole())
                .email(user.getEmail())
                .name(user.getName())
                .status(user.getStatus())
                .build();
        
        return LoginResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }
}
