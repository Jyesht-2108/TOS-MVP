package com.school.transport.module.tracking.dto;

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
public class LiveTrackingResponse {
    private Double lat;
    private Double lng;
    private LocalDateTime updated_at;
    private UUID trip_id;
    private String trip_type;
    private Double speed;
    private Double heading;
}
