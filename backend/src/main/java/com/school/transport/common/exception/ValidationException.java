package com.school.transport.common.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends AppException {
    public ValidationException(String message) {
        super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    public ValidationException(String message, Object details) {
        super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message, details);
    }
}
