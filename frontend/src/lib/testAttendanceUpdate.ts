/**
 * Test utility to simulate driver marking attendance
 * This can be called from browser console to test real-time updates
 */

import { markMockAttendance } from './mockData';

// Make it available globally for testing
declare global {
  interface Window {
    testMarkAttendance: (attendanceId: string, status: 'PRESENT' | 'ABSENT') => void;
    testMarkAllPresent: (tripId: string) => void;
    testMarkAllAbsent: (tripId: string) => void;
  }
}

/**
 * Mark a single attendance record
 * Usage in console: window.testMarkAttendance('att-3', 'PRESENT')
 */
window.testMarkAttendance = (attendanceId: string, status: 'PRESENT' | 'ABSENT') => {
  const result = markMockAttendance(attendanceId, status, 'driver-test');
  if (result) {
    console.log('✅ Attendance marked successfully!');
    console.log('🔄 Admin UI should update within 10 seconds...');
  } else {
    console.error('❌ Attendance record not found');
  }
};

/**
 * Mark all students as present for a trip
 * Usage in console: window.testMarkAllPresent('trip-1')
 */
window.testMarkAllPresent = (tripId: string) => {
  const { mockTripAttendance } = require('./mockData');
  const trip = mockTripAttendance[tripId];
  
  if (!trip) {
    console.error(`❌ Trip ${tripId} not found`);
    return;
  }
  
  let count = 0;
  trip.attendance.forEach((att: any) => {
    if (att.status === null) {
      markMockAttendance(att.id, 'PRESENT', 'driver-test');
      count++;
    }
  });
  
  console.log(`✅ Marked ${count} students as PRESENT`);
  console.log('🔄 Admin UI should update within 10 seconds...');
};

/**
 * Mark all students as absent for a trip
 * Usage in console: window.testMarkAllAbsent('trip-1')
 */
window.testMarkAllAbsent = (tripId: string) => {
  const { mockTripAttendance } = require('./mockData');
  const trip = mockTripAttendance[tripId];
  
  if (!trip) {
    console.error(`❌ Trip ${tripId} not found`);
    return;
  }
  
  let count = 0;
  trip.attendance.forEach((att: any) => {
    if (att.status === null) {
      markMockAttendance(att.id, 'ABSENT', 'driver-test');
      count++;
    }
  });
  
  console.log(`✅ Marked ${count} students as ABSENT`);
  console.log('🔄 Admin UI should update within 10 seconds...');
};

console.log('🧪 Test utilities loaded!');
console.log('Available commands:');
console.log('  window.testMarkAttendance("att-3", "PRESENT")');
console.log('  window.testMarkAllPresent("trip-1")');
console.log('  window.testMarkAllAbsent("trip-1")');

export {};
