package com.school.transport.config;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Slf4j
@Configuration
public class LoggingConfig {

    /**
     * Log structured message with context using MDC (Mapped Diagnostic Context).
     * The logback-spring.xml configuration will format this as JSON.
     */
    public static void logStructured(String level, String message, Map<String, Object> context) {
        try {
            // Add context to MDC for structured logging
            if (context != null && !context.isEmpty()) {
                context.forEach((key, value) -> {
                    if (value != null) {
                        MDC.put(key, value.toString());
                    }
                });
            }
            
            // Log the message - logback will format as JSON
            switch (level.toLowerCase()) {
                case "debug":
                    log.debug(message);
                    break;
                case "info":
                    log.info(message);
                    break;
                case "warn":
                    log.warn(message);
                    break;
                case "error":
                    log.error(message);
                    break;
                default:
                    log.info(message);
                    break;
            }
        } finally {
            // Clear MDC to prevent context leakage
            if (context != null) {
                context.keySet().forEach(MDC::remove);
            }
        }
    }

    public static void info(String message, Map<String, Object> context) {
        logStructured("info", message, context);
    }

    public static void debug(String message, Map<String, Object> context) {
        logStructured("debug", message, context);
    }

    public static void warn(String message, Map<String, Object> context) {
        logStructured("warn", message, context);
    }

    public static void error(String message, Map<String, Object> context) {
        logStructured("error", message, context);
    }
    
    public static void info(String message) {
        log.info(message);
    }
    
    public static void debug(String message) {
        log.debug(message);
    }
    
    public static void warn(String message) {
        log.warn(message);
    }
    
    public static void error(String message) {
        log.error(message);
    }
}
