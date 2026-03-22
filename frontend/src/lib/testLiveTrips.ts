/**
 * Test utilities for Live Trips Monitoring
 * 
 * Usage in browser console:
 * 
 * 1. Start a trip:
 *    startTrip('trip-1')
 * 
 * 2. End a trip:
 *    endTrip('trip-1')
 * 
 * 3. View active trips:
 *    viewActiveTrips()
 * 
 * 4. List all trips:
 *    listAllTrips()
 */

import { mockTrips, getMockActiveTrips } from './mockData';

// Start a trip by ID
export const startTrip = (tripId: string) => {
  const trip = mockTrips.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'ACTIVE';
    trip.startTime = new Date().toISOString();
    console.log(`✅ Trip started: ${trip.routeName} (${trip.tripType})`);
    console.log(`   Trip ID: ${tripId}`);
    console.log(`   Driver: ${trip.driverName}`);
    console.log(`   Students: ${trip.totalStudents}`);
    console.log(`\n💡 The admin dashboard will show this trip within 10 seconds.`);
  } else {
    console.error(`❌ Trip not found: ${tripId}`);
    console.log('\n📋 Available trip IDs:');
    mockTrips.forEach(t => {
      console.log(`   - ${t.id}: ${t.routeName} (${t.tripType}) - Status: ${t.status}`);
    });
  }
};

// End a trip by ID
export const endTrip = (tripId: string) => {
  const trip = mockTrips.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'COMPLETED';
    trip.endTime = new Date().toISOString();
    console.log(`🏁 Trip ended: ${trip.routeName} (${trip.tripType})`);
    console.log(`   Trip ID: ${tripId}`);
    console.log(`\n💡 The trip will disappear from the admin dashboard within 10 seconds.`);
  } else {
    console.error(`❌ Trip not found: ${tripId}`);
  }
};

// View all active trips
export const viewActiveTrips = () => {
  const activeTrips = getMockActiveTrips();
  console.log(`\n🚌 Active Trips: ${activeTrips.length}`);
  console.log('─'.repeat(80));
  
  if (activeTrips.length === 0) {
    console.log('No active trips at the moment.');
    console.log('\n💡 Start a trip using: startTrip("trip-1")');
  } else {
    activeTrips.forEach(trip => {
      console.log(`\n📍 ${trip.routeName} (${trip.tripType})`);
      console.log(`   Trip ID: ${trip.tripId}`);
      console.log(`   Driver: ${trip.driverName}`);
      console.log(`   Vehicle: ${trip.vehicleNumber || 'N/A'}`);
      console.log(`   Students: ${trip.presentStudents}/${trip.totalStudents} present`);
      console.log(`   Started: ${new Date(trip.startTime).toLocaleTimeString()}`);
      console.log(`   GPS Status: ${trip.gpsHealthStatus}`);
    });
  }
  console.log('\n' + '─'.repeat(80));
};

// List all trips with their status
export const listAllTrips = () => {
  console.log(`\n📋 All Trips: ${mockTrips.length}`);
  console.log('─'.repeat(80));
  
  const grouped = {
    ACTIVE: mockTrips.filter(t => t.status === 'ACTIVE'),
    COMPLETED: mockTrips.filter(t => t.status === 'COMPLETED'),
    CANCELLED: mockTrips.filter(t => t.status === 'CANCELLED'),
  };
  
  Object.entries(grouped).forEach(([status, trips]) => {
    if (trips.length > 0) {
      console.log(`\n${status} (${trips.length}):`);
      trips.forEach(trip => {
        console.log(`   ${trip.id}: ${trip.routeName} (${trip.tripType}) - ${trip.driverName}`);
      });
    }
  });
  
  console.log('\n' + '─'.repeat(80));
  console.log('\n💡 Commands:');
  console.log('   startTrip("trip-id")  - Start a trip');
  console.log('   endTrip("trip-id")    - End a trip');
  console.log('   viewActiveTrips()     - View active trips');
};

// Expose functions to window for console access
if (typeof window !== 'undefined') {
  (window as any).startTrip = startTrip;
  (window as any).endTrip = endTrip;
  (window as any).viewActiveTrips = viewActiveTrips;
  (window as any).listAllTrips = listAllTrips;
  
  console.log('🎭 Live Trips Test Utilities Loaded');
  console.log('─'.repeat(80));
  console.log('Available commands:');
  console.log('  startTrip("trip-id")  - Start a trip');
  console.log('  endTrip("trip-id")    - End a trip');
  console.log('  viewActiveTrips()     - View active trips');
  console.log('  listAllTrips()        - List all trips');
  console.log('─'.repeat(80));
}
