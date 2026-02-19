package com.school.transport.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.jqwik.api.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Feature: admin-and-routes, Property 32: Structured Logging Format
 * Validates: Requirements 10.5
 */
class LoggingConfigPropertyTest {

    private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        System.setOut(new PrintStream(outputStream));
    }

    @AfterEach
    void tearDown() {
        System.setOut(originalOut);
    }

    @Property(tries = 100)
    @Label("Property 32: For any log entry, the log should be in valid JSON format with consistent structure")
    void structuredLoggingFormatProperty(
            @ForAll("logLevel") String level,
            @ForAll("logMessage") String message,
            @ForAll("logContext") Map<String, Object> context
    ) {
        // Reset output stream for this iteration
        outputStream.reset();

        // Call the logging method
        LoggingConfig.logStructured(level, message, context);

        // Get the log output
        String logOutput = outputStream.toString().trim();

        // Extract JSON from log output (skip timestamp and log level prefix)
        String jsonPart = extractJsonFromLogOutput(logOutput);

        try {
            // Property 1: The output must be valid JSON
            JsonNode parsed = objectMapper.readTree(jsonPart);

            // Property 2: The JSON must have required fields
            Assertions.assertThat(parsed.has("level")).isTrue();
            Assertions.assertThat(parsed.has("message")).isTrue();
            Assertions.assertThat(parsed.has("timestamp")).isTrue();

            // Property 3: The level must match what was logged
            Assertions.assertThat(parsed.get("level").asText()).isEqualTo(level);

            // Property 4: The message must match what was logged
            Assertions.assertThat(parsed.get("message").asText()).isEqualTo(message);

            // Property 5: The timestamp must be a valid ISO 8601 string
            String timestamp = parsed.get("timestamp").asText();
            Assertions.assertThat(timestamp).matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.*Z");

            // Property 6: If context was provided and not empty, it should be present
            if (context != null && !context.isEmpty()) {
                Assertions.assertThat(parsed.has("context")).isTrue();
            }

            // Property 7: The structure should be consistent (only expected fields)
            int expectedFieldCount = 3; // level, message, timestamp
            if (context != null && !context.isEmpty()) {
                expectedFieldCount = 4; // + context
            }
            Assertions.assertThat(parsed.size()).isEqualTo(expectedFieldCount);

        } catch (Exception e) {
            throw new AssertionError("Failed to parse log output as JSON: " + jsonPart, e);
        }
    }

    private String extractJsonFromLogOutput(String logOutput) {
        // Log output format: "timestamp - {json}"
        // We need to extract the JSON part
        int jsonStart = logOutput.indexOf('{');
        if (jsonStart != -1) {
            return logOutput.substring(jsonStart);
        }
        return logOutput;
    }

    @Provide
    Arbitrary<String> logLevel() {
        return Arbitraries.of("debug", "info", "warn", "error");
    }

    @Provide
    Arbitrary<String> logMessage() {
        return Arbitraries.strings()
                .withCharRange('a', 'z')
                .withCharRange('A', 'Z')
                .withCharRange('0', '9')
                .withChars(' ', '.', ',', '!', '?')
                .ofMinLength(1)
                .ofMaxLength(200);
    }

    @Provide
    Arbitrary<Map<String, Object>> logContext() {
        return Arbitraries.maps(
                Arbitraries.strings().alpha().ofMinLength(1).ofMaxLength(50),
                Arbitraries.oneOf(
                        Arbitraries.strings().ofMaxLength(100),
                        Arbitraries.integers(),
                        Arbitraries.just(true),
                        Arbitraries.just(false),
                        Arbitraries.just(null)
                )
        ).ofMaxSize(5);
    }
}
