-- School Transport Operations System - Database Schema
-- PostgreSQL Database Schema for MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE trip_type_enum AS ENUM ('PICKUP', 'DROP');
CREATE TYPE trip_status_enum AS ENUM ('ACTIVE', 'ENDED');
CREATE TYPE attendance_status_enum AS ENUM ('PRESENT', 'ABSENT');
CREATE TYPE notification_type_enum AS ENUM ('TRIP_START');
CREATE TYPE notification_status_enum AS ENUM ('QUEUED', 'SENT', 'FAILED');

-- Routes table
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routes_tenant ON routes(tenant_id);
CREATE INDEX idx_routes_status ON routes(status);

-- Route Students junction table
CREATE TABLE route_students (
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (route_id, student_id)
);

CREATE INDEX idx_route_students_student ON route_students(student_id);

-- Route Driver Assignment table
CREATE TABLE route_driver_assignment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL,
    active_from TIMESTAMP NOT NULL DEFAULT NOW(),
    active_to TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_route_driver_route ON route_driver_assignment(route_id);
CREATE INDEX idx_route_driver_driver ON route_driver_assignment(driver_id);
CREATE INDEX idx_route_driver_active ON route_driver_assignment(route_id, active_to) WHERE active_to IS NULL;

-- Constraint: Only one active driver per route
CREATE UNIQUE INDEX idx_one_active_driver_per_route 
    ON route_driver_assignment(route_id) 
    WHERE active_to IS NULL;

-- Trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL,
    trip_type trip_type_enum NOT NULL,
    trip_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    status trip_status_enum NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_route ON trips(route_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_date ON trips(trip_date);
CREATE INDEX idx_trips_status ON trips(status);

-- Constraint: Only one active trip per route per trip type
CREATE UNIQUE INDEX idx_one_active_trip_per_route_type 
    ON trips(route_id, trip_type) 
    WHERE status = 'ACTIVE';

-- Attendance table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    status attendance_status_enum NOT NULL DEFAULT 'ABSENT',
    marked_at TIMESTAMP NULL,
    marked_by UUID NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attendance_trip ON attendance(trip_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE UNIQUE INDEX idx_attendance_trip_student ON attendance(trip_id, student_id);

-- Attendance Audit table
CREATE TABLE attendance_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    old_status attendance_status_enum NOT NULL,
    new_status attendance_status_enum NOT NULL,
    reason TEXT NOT NULL,
    edited_by UUID NOT NULL,
    edited_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attendance_audit_trip ON attendance_audit(trip_id);
CREATE INDEX idx_attendance_audit_student ON attendance_audit(student_id);
CREATE INDEX idx_attendance_audit_edited_by ON attendance_audit(edited_by);

-- Latest Bus Location table (single row per trip)
CREATE TABLE latest_bus_location (
    trip_id UUID PRIMARY KEY REFERENCES trips(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) NULL,
    heading DECIMAL(5, 2) NULL,
    timestamp TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_latest_bus_location_timestamp ON latest_bus_location(timestamp);

-- GPS Logs table (historical tracking)
CREATE TABLE gps_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) NULL,
    heading DECIMAL(5, 2) NULL,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gps_logs_trip ON gps_logs(trip_id);
CREATE INDEX idx_gps_logs_timestamp ON gps_logs(timestamp);
CREATE INDEX idx_gps_logs_trip_timestamp ON gps_logs(trip_id, timestamp DESC);

-- Notification Log table
CREATE TABLE notification_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    recipient_user_id UUID NOT NULL,
    status notification_status_enum NOT NULL DEFAULT 'QUEUED',
    sent_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_log_trip ON notification_log(trip_id);
CREATE INDEX idx_notification_log_recipient ON notification_log(recipient_user_id);
CREATE INDEX idx_notification_log_status ON notification_log(status);

-- Constraint: WhatsApp batch idempotency - one notification per trip per type
CREATE UNIQUE INDEX idx_notification_log_trip_type ON notification_log(trip_id, type);

-- Comments for documentation
COMMENT ON TABLE routes IS 'Transport routes configured by admin';
COMMENT ON TABLE route_students IS 'Junction table mapping students to routes';
COMMENT ON TABLE route_driver_assignment IS 'Driver assignments to routes with temporal tracking';
COMMENT ON TABLE trips IS 'Individual trip instances for routes';
COMMENT ON TABLE attendance IS 'Student attendance records for trips';
COMMENT ON TABLE attendance_audit IS 'Audit trail for attendance corrections';
COMMENT ON TABLE latest_bus_location IS 'Current GPS location for active trips';
COMMENT ON TABLE gps_logs IS 'Historical GPS tracking data';
COMMENT ON TABLE notification_log IS 'WhatsApp notification delivery tracking';
