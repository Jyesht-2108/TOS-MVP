package com.school.transport.common.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends AppException {
    public NotFoundException(String resource, String identifier) {
        super(HttpStatus.NOT_FOUND, "NOT_FOUND", 
              identifier != null 
                  ? String.format("%s with identifier %s not found", resource, identifier)
                  : String.format("%s not found", resource));
    }

    public NotFoundException(String resource) {
        this(resource, null);
    }
}
