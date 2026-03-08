-- Seed Data: 001_initial_seed
-- Description: Initial seed data for School Transport Operations System
-- Created: 2026-02-26

-- Note: This seed data matches the frontend mock data structure
-- UUIDs are hardcoded for consistency with frontend mock data

-- ============================================
-- Insert Routes
-- ============================================

INSERT INTO routes (id, tenant_id, name, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'North District Route', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'South District Route', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'East District Route', 'INACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'West District Route', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440000', 'Kindergarten Route A', 'ACTIVE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440000', 'High School Route B', 'ACTIVE', NOW(), NOW());

-- ============================================
-- Insert Route Students
-- ============================================

-- Students for North District Route
INSERT INTO route_students (route_id, student_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', NOW()),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', NOW()),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', NOW());

-- Students for South District Route
INSERT INTO route_students (route_id, student_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440023', NOW()),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440024', NOW());

-- Students for West District Route
INSERT INTO route_students (route_id, student_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440025', NOW());

-- Students for Kindergarten Route A
INSERT INTO route_students (route_id, student_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440026', NOW()),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440027', NOW());

-- Students for High School Route B
INSERT INTO route_students (route_id, student_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440028', NOW()),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440029', NOW());

-- ============================================
-- Insert Route Driver Assignments
-- ============================================

-- John Anderson (driver-1) assigned to North District Route
INSERT INTO route_driver_assignment (id, route_id, driver_id, active_from, active_to, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440040', NOW() - INTERVAL '30 days', NULL, NOW() - INTERVAL '30 days');

-- Sarah Thompson (driver-2) assigned to South District Route
INSERT INTO route_driver_assignment (id, route_id, driver_id, active_from, active_to, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '20 days', NULL, NOW() - INTERVAL '20 days');

-- Michael Chen (driver-3) assigned to West District Route
INSERT INTO route_driver_assignment (id, route_id, driver_id, active_from, active_to, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440042', NOW() - INTERVAL '15 days', NULL, NOW() - INTERVAL '15 days');

-- John Anderson (driver-1) also assigned to Kindergarten Route A
INSERT INTO route_driver_assignment (id, route_id, driver_id, active_from, active_to, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440040', NOW() - INTERVAL '25 days', NULL, NOW() - INTERVAL '25 days');

-- John Anderson (driver-1) also assigned to High School Route B
INSERT INTO route_driver_assignment (id, route_id, driver_id, active_from, active_to, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440040', NOW() - INTERVAL '20 days', NULL, NOW() - INTERVAL '20 days');

-- ============================================
-- Insert Active Trips
-- ============================================

-- Active morning trip for North District Route
INSERT INTO trips (id, route_id, driver_id, trip_type, trip_date, start_time, end_time, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440040', 'PICKUP', CURRENT_DATE, NOW() - INTERVAL '30 minutes', NULL, 'ACTIVE', NOW() - INTERVAL '30 minutes');

-- Active morning trip for South District Route
INSERT INTO trips (id, route_id, driver_id, trip_type, trip_date, start_time, end_time, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440041', 'PICKUP', CURRENT_DATE, NOW() - INTERVAL '25 minutes', NULL, 'ACTIVE', NOW() - INTERVAL '25 minutes');

-- Completed trip from yesterday
INSERT INTO trips (id, route_id, driver_id, trip_type, trip_date, start_time, end_time, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440040', 'PICKUP', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '07:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:15:00', 'ENDED', (CURRENT_DATE - INTERVAL '1 day') + TIME '07:00:00');

-- ============================================
-- Insert Attendance Records
-- ============================================

-- Attendance for active North District Route trip
INSERT INTO attendance (id, trip_id, student_id, status, marked_at, marked_by, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440020', 'PRESENT', NOW() - INTERVAL '28 minutes', '550e8400-e29b-41d4-a716-446655440040', NOW() - INTERVAL '28 minutes', NOW() - INTERVAL '28 minutes'),
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440021', 'PRESENT', NOW() - INTERVAL '26 minutes', '550e8400-e29b-41d4-a716-446655440040', NOW() - INTERVAL '26 minutes', NOW() - INTERVAL '26 minutes'),
('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440022', 'ABSENT', NULL, NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes');

-- Attendance for active South District Route trip
INSERT INTO attendance (id, trip_id, student_id, status, marked_at, marked_by, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440023', 'PRESENT', NOW() - INTERVAL '23 minutes', '550e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '23 minutes', NOW() - INTERVAL '23 minutes'),
('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440024', 'PRESENT', NOW() - INTERVAL '21 minutes', '550e8400-e29b-41d4-a716-446655440041', NOW() - INTERVAL '21 minutes', NOW() - INTERVAL '21 minutes');

-- ============================================
-- Insert Attendance Audit Records
-- ============================================

-- Sample attendance correction
INSERT INTO attendance_audit (id, trip_id, student_id, old_status, new_status, reason, edited_by, edited_at) VALUES
('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440020', 'ABSENT', 'PRESENT', 'Student was present but not marked initially', '550e8400-e29b-41d4-a716-446655440001', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:00:00');

-- ============================================
-- Insert Latest Bus Locations
-- ============================================

-- Current location for North District Route trip
INSERT INTO latest_bus_location (trip_id, latitude, longitude, speed, heading, timestamp, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440050', 40.7128, -74.0060, 25.50, 90.00, NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '2 minutes');

-- Current location for South District Route trip
INSERT INTO latest_bus_location (trip_id, latitude, longitude, speed, heading, timestamp, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440051', 40.7628, -73.9560, 30.00, 135.00, NOW() - INTERVAL '1 minute', NOW() - INTERVAL '1 minute');

-- ============================================
-- Insert GPS Logs (Historical Tracking)
-- ============================================

-- GPS logs for North District Route trip (last 30 minutes)
INSERT INTO gps_logs (id, trip_id, latitude, longitude, speed, heading, timestamp, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440050', 40.7000, -74.0100, 20.00, 85.00, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440050', 40.7050, -74.0080, 22.50, 87.00, NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '20 minutes'),
('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440050', 40.7100, -74.0070, 24.00, 88.50, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes'),
('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440050', 40.7128, -74.0060, 25.50, 90.00, NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '2 minutes');

-- GPS logs for South District Route trip
INSERT INTO gps_logs (id, trip_id, latitude, longitude, speed, heading, timestamp, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440051', 40.7500, -73.9600, 28.00, 130.00, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes'),
('550e8400-e29b-41d4-a716-446655440085', '550e8400-e29b-41d4-a716-446655440051', 40.7550, -73.9580, 29.00, 132.00, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440086', '550e8400-e29b-41d4-a716-446655440051', 40.7628, -73.9560, 30.00, 135.00, NOW() - INTERVAL '1 minute', NOW() - INTERVAL '1 minute');

-- ============================================
-- Insert Notification Logs
-- ============================================

-- Trip start notifications for active trips
INSERT INTO notification_log (id, trip_id, type, recipient_user_id, status, sent_at, error_message, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440050', 'TRIP_START', '550e8400-e29b-41d4-a716-446655440002', 'SENT', NOW() - INTERVAL '29 minutes', NULL, NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440051', 'TRIP_START', '550e8400-e29b-41d4-a716-446655440002', 'SENT', NOW() - INTERVAL '24 minutes', NULL, NOW() - INTERVAL '25 minutes');

-- Sample failed notification
INSERT INTO notification_log (id, trip_id, type, recipient_user_id, status, sent_at, error_message, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440052', 'TRIP_START', '550e8400-e29b-41d4-a716-446655440002', 'FAILED', NULL, 'WhatsApp API timeout', (CURRENT_DATE - INTERVAL '1 day') + TIME '07:00:00');

-- ============================================
-- Verification Queries (commented out)
-- ============================================

-- SELECT COUNT(*) as route_count FROM routes;
-- SELECT COUNT(*) as student_assignment_count FROM route_students;
-- SELECT COUNT(*) as driver_assignment_count FROM route_driver_assignment;
-- SELECT COUNT(*) as active_trip_count FROM trips WHERE status = 'ACTIVE';
-- SELECT COUNT(*) as attendance_count FROM attendance;
-- SELECT COUNT(*) as gps_log_count FROM gps_logs;
-- SELECT COUNT(*) as notification_count FROM notification_log;

-- Verify constraint: Only one active driver per route
-- SELECT route_id, COUNT(*) FROM route_driver_assignment WHERE active_to IS NULL GROUP BY route_id HAVING COUNT(*) > 1;

-- Verify constraint: Only one active trip per route per type
-- SELECT route_id, trip_type, COUNT(*) FROM trips WHERE status = 'ACTIVE' GROUP BY route_id, trip_type HAVING COUNT(*) > 1;
