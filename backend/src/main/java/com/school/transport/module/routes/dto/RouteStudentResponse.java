package com.school.transport.module.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStudentResponse {
    private UUID routeId;
    private UUID studentId;
    private StudentInfo student;
    private Integer attendancePresent;
    private Integer attendanceTotal;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String name;
        private String grade;
        private String section;
        private String status;
    }
}
