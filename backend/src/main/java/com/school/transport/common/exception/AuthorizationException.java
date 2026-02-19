package com.school.transport.common.exception;

import org.springframework.http.HttpStatus;

public class AuthorizationException extends AppException {
    public AuthorizationException(String message) {
        super(HttpStatus.FORBIDDEN, "AUTHORIZATION_ERROR", message);
    }
}
