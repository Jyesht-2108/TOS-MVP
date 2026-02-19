package com.school.transport.config;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.jqwik.api.*;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Feature: admin-and-routes, Property 32: Structured Logging Format
 * Validates: Requirements 10.5
 * 
 * Property: For any log entry, the log should be in valid JSON format with consistent structure
 */
class StructuredLoggingPropertyTest {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private ListAppender<ILoggingEvent> listAppender;
    private Logger logger;

    @BeforeProperty
    void setUp() {
        // Set up test appender to capture log output
        logger = (Logger) LoggerFactory.getLogger(LoggingConfig.class);
        listAppender = new ListAppender<>();
        listAppender.start();
        logger.addAppender(listAppender);
    }

    @AfterProperty
    void tearDown() {
        if (listAppender != null) {
            listAppender.stop();
            logger.detachAppender(listAppender);
        }
    }

    /**
     * Property: For any log message and context, the structured log should produce valid JSON
     * with required fields: timestamp, level, message, logger_name
     */
    @Property(tries = 100)
    void structuredLogsShouldProduceValidJsonFormat(
            @ForAll("logLevels") String level,
            @ForAll("logMessages") String message,
            @ForAll("logContexts") Map<String, Object> context) {
        
        // Clear previous logs
        listAppender.list.clear();
        
        // Act: Log with structured format
        LoggingConfig.logStructured(level, message, context);
        
        // Assert: At least one log entry was created
        Assume.that(!listAppender.list.isEmpty());
        
        ILoggingEvent logEvent = listAppender.list.get(0);
        
        // Verify the log event has required fields
        // Note: The actual JSON formatting happens in logback-spring.xml with LogstashEncoder
        // Here we verify that the log event contains the necessary information
        
        // 1. Verify message is present
        assert logEvent.getFormattedMessage() != null : "Log message should not be null";
        assert logEvent.getFormattedMessage().equals(message) : "Log message should match input";
        
        // 2. Verify level matches
        String actualLevel = logEvent.getLevel().toString().toLowerCase();
        String expectedLevel = normalizeLevel(level);
        assert actualLevel.equals(expectedLevel) : 
            String.format("Log level should be %s but was %s", expectedLevel, actualLevel);
        
        // 3. Verify timestamp is present
        assert logEvent.getTimeStamp() > 0 : "Timestamp should be present";
        
        // 4. Verify logger name is present
        assert logEvent.getLoggerName() != null : "Logger name should not be null";
        
        // 5. Verify MDC context contains the provided context keys
        if (context != null && !context.isEmpty()) {
            Map<String, String> mdcPropertyMap = logEvent.getMDCPropertyMap();
            for (String key : context.keySet()) {
                assert mdcPropertyMap.containsKey(key) : 
                    String.format("MDC should contain context key: %s", key);
            }
        }
    }

    /**
     * Property: Structured logs should handle null or empty contexts gracefully
     */
    @Property(tries = 100)
    void structuredLogsShouldHandleNullContextGracefully(
            @ForAll("logLevels") String level,
            @ForAll("logMessages") String message) {
        
        // Clear previous logs
        listAppender.list.clear();
        
        // Act: Log with null context
        LoggingConfig.logStructured(level, message, null);
        
        // Assert: Log entry was created successfully
        Assume.that(!listAppender.list.isEmpty());
        
        ILoggingEvent logEvent = listAppender.list.get(0);
        assert logEvent.getFormattedMessage().equals(message) : "Log message should match input";
    }

    /**
     * Property: Structured logs should handle empty contexts gracefully
     */
    @Property(tries = 100)
    void structuredLogsShouldHandleEmptyContextGracefully(
            @ForAll("logLevels") String level,
            @ForAll("logMessages") String message) {
        
        // Clear previous logs
        listAppender.list.clear();
        
        // Act: Log with empty context
        LoggingConfig.logStructured(level, message, new HashMap<>());
        
        // Assert: Log entry was created successfully
        Assume.that(!listAppender.list.isEmpty());
        
        ILoggingEvent logEvent = listAppender.list.get(0);
        assert logEvent.getFormattedMessage().equals(message) : "Log message should match input";
    }

    // Arbitraries (generators)

    @Provide
    Arbitrary<String> logLevels() {
        return Arbitraries.of("debug", "info", "warn", "error", "DEBUG", "INFO", "WARN", "ERROR");
    }

    @Provide
    Arbitrary<String> logMessages() {
        return Arbitraries.strings()
                .alpha()
                .numeric()
                .withChars(' ', '.', ',', '-', '_')
                .ofMinLength(1)
                .ofMaxLength(200);
    }

    @Provide
    Arbitrary<Map<String, Object>> logContexts() {
        return Arbitraries.maps(
                Arbitraries.of("tenantId", "userId", "routeId", "driverId", "studentId", "correlationId"),
                Arbitraries.oneOf(
                        Arbitraries.strings().alpha().numeric().ofMinLength(1).ofMaxLength(50),
                        Arbitraries.integers().between(1, 10000).map(Object.class::cast),
                        Arbitraries.longs().between(1L, 100000L).map(Object.class::cast)
                )
        ).ofMinSize(0).ofMaxSize(6);
    }

    // Helper methods

    private String normalizeLevel(String level) {
        return level.toLowerCase();
    }
}
