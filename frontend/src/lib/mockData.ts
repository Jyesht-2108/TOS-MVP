import { RouteResponse, RouteStudent, RouteDriverAssignment, Student, Driver } from '@/types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    tenantId: 'tenant-1',
    name: 'Emma Johnson',
    parentUserId: '550e8400-e29b-41d4-a716-446655440002', // parent@school.com
    parentName: 'Robert Johnson',
    grade: '5',
    section: 'A',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'ACTIVE',
  },
  {
    id: 'student-2',
    tenantId: 'tenant-1',
    name: 'Liam Smith',
    parentUserId: '550e8400-e29b-41d4-a716-446655440002', // parent@school.com
    parentName: 'Jennifer Smith',
    grade: '6',
    section: 'B',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'ACTIVE',
  },
  {
    id: 'student-3',
    tenantId: 'tenant-1',
    name: 'Olivia Brown',
    parentUserId: 'parent-3',
    parentName: 'David Brown',
    grade: '4',
    section: 'A',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'ACTIVE',
  },
  {
    id: 'student-4',
    tenantId: 'tenant-1',
    name: 'Noah Davis',
    parentUserId: 'parent-4',
    parentName: 'Michelle Davis',
    grade: '7',
    section: 'C',
    routeId: 'route-2',
    routeName: 'South District Route',
    status: 'ACTIVE',
  },
  {
    id: 'student-5',
    tenantId: 'tenant-1',
    name: 'Ava Wilson',
    parentUserId: 'parent-5',
    parentName: 'James Wilson',
    grade: '5',
    section: 'B',
    routeId: 'route-2',
    routeName: 'South District Route',
    status: 'ACTIVE',
  },
  {
    id: 'student-6',
    tenantId: 'tenant-1',
    name: 'Ethan Martinez',
    parentUserId: 'parent-6',
    parentName: 'Maria Martinez',
    grade: '8',
    section: 'A',
    routeId: 'route-4',
    routeName: 'West District Route',
    status: 'INACTIVE',
  },
  {
    id: 'student-7',
    tenantId: 'tenant-1',
    name: 'Sophia Garcia',
    parentUserId: 'parent-7',
    parentName: 'Carlos Garcia',
    grade: '3',
    section: 'A',
    routeId: undefined,
    routeName: undefined,
    status: 'ACTIVE',
  },
  {
    id: 'student-8',
    tenantId: 'tenant-1',
    name: 'Mason Lee',
    parentUserId: 'parent-8',
    parentName: 'Linda Lee',
    grade: '6',
    section: 'A',
    routeId: undefined,
    routeName: undefined,
    status: 'ACTIVE',
  },
  {
    id: 'student-9',
    tenantId: 'tenant-1',
    name: 'Isabella Taylor',
    parentUserId: 'parent-9',
    parentName: 'Michael Taylor',
    grade: '4',
    section: 'B',
    routeId: 'route-5',
    routeName: 'Kindergarten Route A',
    status: 'ACTIVE',
  },
  {
    id: 'student-10',
    tenantId: 'tenant-1',
    name: 'Lucas Anderson',
    parentUserId: 'parent-10',
    parentName: 'Sarah Anderson',
    grade: '7',
    section: 'A',
    routeId: 'route-5',
    routeName: 'Kindergarten Route A',
    status: 'ACTIVE',
  },
  {
    id: 'student-11',
    tenantId: 'tenant-1',
    name: 'Mia Robinson',
    parentUserId: 'parent-11',
    parentName: 'James Robinson',
    grade: '5',
    section: 'C',
    routeId: 'route-6',
    routeName: 'High School Route B',
    status: 'ACTIVE',
  },
  {
    id: 'student-12',
    tenantId: 'tenant-1',
    name: 'Elijah White',
    parentUserId: 'parent-12',
    parentName: 'Emily White',
    grade: '6',
    section: 'B',
    routeId: 'route-6',
    routeName: 'High School Route B',
    status: 'ACTIVE',
  },
];

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    tenantId: 'tenant-1',
    name: 'John Anderson',
    phone: '+1-555-0101',
    licenseNumber: 'DL-2024-001',
    vehicleNumber: 'BUS-101',
    routeId: 'route-1', // Primary route
    routeName: 'North District Route',
    status: 'ACTIVE',
  },
  {
    id: 'driver-2',
    tenantId: 'tenant-1',
    name: 'Sarah Thompson',
    phone: '+1-555-0102',
    licenseNumber: 'DL-2024-002',
    vehicleNumber: 'BUS-102',
    routeId: 'route-2',
    routeName: 'South District Route',
    status: 'ACTIVE',
  },
  {
    id: 'driver-3',
    tenantId: 'tenant-1',
    name: 'Michael Chen',
    phone: '+1-555-0103',
    licenseNumber: 'DL-2024-003',
    vehicleNumber: 'BUS-103',
    routeId: 'route-4',
    routeName: 'West District Route',
    status: 'ACTIVE',
  },
  {
    id: 'driver-4',
    tenantId: 'tenant-1',
    name: 'Emily Rodriguez',
    phone: '+1-555-0104',
    licenseNumber: 'DL-2024-004',
    vehicleNumber: 'BUS-104',
    routeId: undefined,
    routeName: undefined,
    status: 'ACTIVE',
  },
  {
    id: 'driver-5',
    tenantId: 'tenant-1',
    name: 'David Kim',
    phone: '+1-555-0105',
    licenseNumber: 'DL-2024-005',
    vehicleNumber: 'BUS-105',
    routeId: undefined,
    routeName: undefined,
    status: 'INACTIVE',
  },
];

// Mock Routes
export const mockRoutes: RouteResponse[] = [
  {
    id: 'route-1',
    tenantId: 'tenant-1',
    name: 'North District Route',
    status: 'ACTIVE',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    driverName: 'John Anderson',
    studentCount: 3,
  },
  {
    id: 'route-2',
    tenantId: 'tenant-1',
    name: 'South District Route',
    status: 'ACTIVE',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    driverName: 'Sarah Thompson',
    studentCount: 2,
  },
  {
    id: 'route-3',
    tenantId: 'tenant-1',
    name: 'East District Route',
    status: 'INACTIVE',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    driverName: undefined,
    studentCount: 0,
  },
  {
    id: 'route-4',
    tenantId: 'tenant-1',
    name: 'West District Route',
    status: 'ACTIVE',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    driverName: 'Michael Chen',
    studentCount: 1,
  },
  {
    id: 'route-5',
    tenantId: 'tenant-1',
    name: 'Kindergarten Route A',
    status: 'ACTIVE',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
    driverName: 'John Anderson',
    studentCount: 2,
  },
  {
    id: 'route-6',
    tenantId: 'tenant-1',
    name: 'High School Route B',
    status: 'ACTIVE',
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
    driverName: 'John Anderson',
    studentCount: 2,
  },
];

// Mock Route Students
export const mockRouteStudents: Record<string, RouteStudent[]> = {
  'route-1': [
    {
      routeId: 'route-1',
      studentId: 'student-1',
      student: mockStudents[0],
      attendancePresent: 18,
      attendanceTotal: 22,
    },
    {
      routeId: 'route-1',
      studentId: 'student-2',
      student: mockStudents[1],
      attendancePresent: 20,
      attendanceTotal: 22,
    },
    {
      routeId: 'route-1',
      studentId: 'student-3',
      student: mockStudents[2],
      attendancePresent: 22,
      attendanceTotal: 22,
    },
  ],
  'route-2': [
    {
      routeId: 'route-2',
      studentId: 'student-4',
      student: mockStudents[3],
      attendancePresent: 19,
      attendanceTotal: 22,
    },
    {
      routeId: 'route-2',
      studentId: 'student-5',
      student: mockStudents[4],
      attendancePresent: 21,
      attendanceTotal: 22,
    },
  ],
  'route-3': [],
  'route-4': [
    {
      routeId: 'route-4',
      studentId: 'student-6',
      student: mockStudents[5],
      attendancePresent: 15,
      attendanceTotal: 22,
    },
  ],
  'route-5': [
    {
      routeId: 'route-5',
      studentId: 'student-9',
      student: mockStudents[8],
      attendancePresent: 20,
      attendanceTotal: 22,
    },
    {
      routeId: 'route-5',
      studentId: 'student-10',
      student: mockStudents[9],
      attendancePresent: 19,
      attendanceTotal: 22,
    },
  ],
  'route-6': [
    {
      routeId: 'route-6',
      studentId: 'student-11',
      student: mockStudents[10],
      attendancePresent: 21,
      attendanceTotal: 22,
    },
    {
      routeId: 'route-6',
      studentId: 'student-12',
      student: mockStudents[11],
      attendancePresent: 22,
      attendanceTotal: 22,
    },
  ],
};

// Mock Driver Assignments - Now supports multiple routes per driver
export const mockDriverAssignments: Record<string, RouteDriverAssignment[]> = {
  'route-1': [
    {
      id: 'assignment-1',
      routeId: 'route-1',
      driverId: 'driver-1',
      activeFrom: '2024-01-15T08:00:00Z',
      activeTo: undefined,
      driver: mockDrivers[0],
    },
  ],
  'route-2': [
    {
      id: 'assignment-2',
      routeId: 'route-2',
      driverId: 'driver-2',
      activeFrom: '2024-01-16T09:30:00Z',
      activeTo: undefined,
      driver: mockDrivers[1],
    },
  ],
  'route-3': [],
  'route-4': [
    {
      id: 'assignment-3',
      routeId: 'route-4',
      driverId: 'driver-3',
      activeFrom: '2024-01-18T11:00:00Z',
      activeTo: undefined,
      driver: mockDrivers[2],
    },
  ],
  'route-5': [
    {
      id: 'assignment-5',
      routeId: 'route-5',
      driverId: 'driver-1',
      activeFrom: '2024-01-20T08:00:00Z',
      activeTo: undefined,
      driver: mockDrivers[0],
    },
  ],
  'route-6': [
    {
      id: 'assignment-6',
      routeId: 'route-6',
      driverId: 'driver-1',
      activeFrom: '2024-01-22T08:00:00Z',
      activeTo: undefined,
      driver: mockDrivers[0],
    },
  ],
};

// Helper function to get route by ID
export const getMockRouteById = (routeId: string): RouteResponse | undefined => {
  return mockRoutes.find((route) => route.id === routeId);
};

// Helper function to get students for a route
export const getMockRouteStudents = (routeId: string): RouteStudent[] => {
  return mockRouteStudents[routeId] || [];
};

// Helper function to get driver assignments for a route
export const getMockDriverAssignments = (routeId: string): RouteDriverAssignment[] => {
  return mockDriverAssignments[routeId] || [];
};

// Helper function to generate children transport info from students data
// This ensures data consistency between admin and parent portals
export const getMockChildrenTransport = (parentUserId?: string): import('@/types').ChildTransportInfo[] => {
  // Filter students by parent if parentUserId is provided
  const filteredStudents = parentUserId 
    ? mockStudents.filter(s => s.parentUserId === parentUserId)
    : mockStudents;

  return filteredStudents.map(student => {
    // Find the route for this student
    const route = student.routeId ? mockRoutes.find(r => r.id === student.routeId) : undefined;
    
    // Find the driver for this route
    const driverAssignment = student.routeId ? mockDriverAssignments[student.routeId]?.[0] : undefined;
    const driver = driverAssignment?.driver;

    return {
      id: student.id,
      name: student.name,
      grade: student.grade,
      routeId: student.routeId,
      routeName: student.routeName,
      routeStatus: route?.status,
      driverName: undefined, // Hide driver name from parents
      driverPhone: undefined, // Hide driver phone from parents
      vehicleNumber: driver?.vehicleNumber,
      pickupTime: student.routeId ? '07:30 AM' : undefined, // Mock pickup time
      dropoffTime: student.routeId ? '03:30 PM' : undefined, // Mock dropoff time
      pickupLocation: undefined, // Hide pickup location from parents
      dropoffLocation: undefined, // Hide dropoff location from parents
    };
  });
};

// For backward compatibility - returns all children transport info
export const mockChildrenTransport = getMockChildrenTransport();

// Helper function to generate live tracking data from routes and drivers
// This ensures data consistency with admin portal
export const getMockLiveTracking = (): import('@/types').LiveRouteTracking[] => {
  return mockRoutes
    .filter(route => route.status === 'ACTIVE')
    .map(route => {
      const driverAssignment = mockDriverAssignments[route.id]?.[0];
      const driver = driverAssignment?.driver;

      // Generate mock GPS coordinates (in a real app, this would come from GPS device)
      const baseLatitude = 40.7128;
      const baseLongitude = -74.0060;
      const routeIndex = mockRoutes.findIndex(r => r.id === route.id);
      
      return {
        routeId: route.id,
        routeName: route.name,
        vehicleNumber: driver?.vehicleNumber,
        driverName: undefined, // Hide driver name from parents
        driverPhone: undefined, // Hide driver phone from parents
        currentLocation: {
          latitude: baseLatitude + (routeIndex * 0.05),
          longitude: baseLongitude + (routeIndex * 0.05),
          timestamp: new Date().toISOString(),
          speed: 25 + (routeIndex * 5),
          heading: 90 + (routeIndex * 45),
        },
        tripStatus: 'ACTIVE' as const,
        lastUpdated: new Date().toISOString(),
        estimatedArrival: new Date(Date.now() + (15 + routeIndex * 5) * 60 * 1000).toISOString(),
      };
    });
};

// Helper function to generate mock active trips for admin monitoring
export const getMockActiveTrips = (): import('@/types').ActiveTrip[] => {
  const now = new Date();
  const trips: import('@/types').ActiveTrip[] = [];

  mockRoutes
    .filter(route => route.status === 'ACTIVE')
    .forEach((route, index) => {
      const driverAssignment = mockDriverAssignments[route.id]?.[0];
      const driver = driverAssignment?.driver;
      const routeStudents = mockRouteStudents[route.id] || [];

      if (!driver) return;

      // Generate GPS health status based on last ping
      const lastPingSeconds = Math.floor(Math.random() * 120); // Random 0-120 seconds
      let gpsHealthStatus: 'HEALTHY' | 'WARNING' | 'STALE';
      if (lastPingSeconds < 30) gpsHealthStatus = 'HEALTHY';
      else if (lastPingSeconds < 90) gpsHealthStatus = 'WARNING';
      else gpsHealthStatus = 'STALE';

      const lastGPSPing = new Date(now.getTime() - lastPingSeconds * 1000).toISOString();

      // Generate attendance data
      const attendance: import('@/types').TripAttendance[] = routeStudents.map(rs => ({
        studentId: rs.studentId,
        studentName: rs.student?.name || 'Unknown',
        status: Math.random() > 0.2 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'PENDING'),
        pickupTime: '07:30 AM',
        pickupLocation: `${rs.student?.name}'s Home`,
      }));

      const presentStudents = attendance.filter(a => a.status === 'PRESENT').length;
      const absentStudents = attendance.filter(a => a.status === 'ABSENT').length;
      const pendingStudents = attendance.filter(a => a.status === 'PENDING').length;

      trips.push({
        tripId: `trip-${route.id}-morning`,
        routeId: route.id,
        routeName: route.name,
        vehicleNumber: driver.vehicleNumber,
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        tripType: 'MORNING',
        startTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // Started 30 mins ago
        currentLocation: {
          latitude: 40.7128 + (index * 0.05),
          longitude: -74.0060 + (index * 0.05),
          timestamp: lastGPSPing,
          speed: 25 + (index * 5),
          heading: 90 + (index * 45),
        },
        lastGPSPing,
        gpsHealthStatus,
        totalStudents: routeStudents.length,
        presentStudents,
        absentStudents,
        pendingStudents,
        attendance,
        status: 'ACTIVE',
      });
    });

  return trips;
};

// Helper function to generate mock driver activity
export const getMockDriverActivity = (): import('@/types').DriverActivity[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  return mockDrivers.map((driver) => {
    const hasActiveTrip = driver.routeId && mockRoutes.find(r => r.id === driver.routeId)?.status === 'ACTIVE';
    const lastGPSSeconds = Math.floor(Math.random() * 180); // Random 0-180 seconds
    
    // Count today's trips for this driver
    const todayTrips = mockTrips.filter(t => t.driverId === driver.id && t.tripDate === today);
    const totalTripsToday = todayTrips.length;
    
    // Get last trip start time
    const lastTrip = todayTrips.length > 0 ? todayTrips[0] : null;
    
    return {
      driverId: driver.id,
      driverName: driver.name,
      vehicleNumber: driver.vehicleNumber,
      currentTripId: hasActiveTrip ? `trip-${driver.routeId}-morning` : undefined,
      lastTripStartTime: lastTrip?.startTime,
      lastTripEndTime: lastTrip?.endTime,
      lastGPSTimestamp: hasActiveTrip ? new Date(now.getTime() - lastGPSSeconds * 1000).toISOString() : undefined,
      totalTripsToday,
      status: hasActiveTrip ? 'ACTIVE' : (driver.status === 'ACTIVE' ? 'IDLE' : 'OFFLINE'),
    };
  });
};

// Mock Trip History Data
export const mockTrips: import('@/types').Trip[] = [
  // Today's trips for driver-1 (John Anderson) - Multiple routes
  {
    id: 'trip-001',
    routeId: 'route-1',
    routeName: 'North District Route',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'PICKUP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(8, 15, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 3,
    presentStudents: 3,
    absentStudents: 0,
  },
  {
    id: 'trip-002',
    routeId: 'route-5',
    routeName: 'Kindergarten Route A',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'PICKUP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 2,
    presentStudents: 2,
    absentStudents: 0,
  },
  {
    id: 'trip-003',
    routeId: 'route-6',
    routeName: 'High School Route B',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'PICKUP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 4,
    presentStudents: 4,
    absentStudents: 0,
  },
  {
    id: 'trip-004',
    routeId: 'route-1',
    routeName: 'North District Route',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'DROP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 15, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 3,
    presentStudents: 3,
    absentStudents: 0,
  },
  {
    id: 'trip-005',
    routeId: 'route-5',
    routeName: 'Kindergarten Route A',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'DROP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 2,
    presentStudents: 2,
    absentStudents: 0,
  },
  {
    id: 'trip-006',
    routeId: 'route-6',
    routeName: 'High School Route B',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'DROP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 4,
    presentStudents: 3,
    absentStudents: 1,
  },
  
  // Yesterday's trips for driver-1
  {
    id: 'trip-007',
    routeId: 'route-1',
    routeName: 'North District Route',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'PICKUP',
    tripDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 8.25 * 3600000).toISOString(),
    status: 'COMPLETED',
    totalStudents: 3,
    presentStudents: 2,
    absentStudents: 1,
  },
  {
    id: 'trip-008',
    routeId: 'route-5',
    routeName: 'Kindergarten Route A',
    driverId: 'driver-1',
    driverName: 'John Anderson',
    vehicleNumber: 'BUS-101',
    tripType: 'PICKUP',
    tripDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 86400000 + 8.5 * 3600000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 9 * 3600000).toISOString(),
    status: 'COMPLETED',
    totalStudents: 2,
    presentStudents: 2,
    absentStudents: 0,
  },
  
  // Today's trips for driver-2 (Sarah Thompson)
  {
    id: 'trip-009',
    routeId: 'route-2',
    routeName: 'South District Route',
    driverId: 'driver-2',
    driverName: 'Sarah Thompson',
    vehicleNumber: 'BUS-102',
    tripType: 'PICKUP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(7, 15, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 2,
    presentStudents: 2,
    absentStudents: 0,
  },
  {
    id: 'trip-010',
    routeId: 'route-2',
    routeName: 'South District Route',
    driverId: 'driver-2',
    driverName: 'Sarah Thompson',
    vehicleNumber: 'BUS-102',
    tripType: 'DROP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 45, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 2,
    presentStudents: 2,
    absentStudents: 0,
  },
  
  // Today's trips for driver-3 (Michael Chen)
  {
    id: 'trip-011',
    routeId: 'route-4',
    routeName: 'West District Route',
    driverId: 'driver-3',
    driverName: 'Michael Chen',
    vehicleNumber: 'BUS-103',
    tripType: 'PICKUP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(8, 45, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 1,
    presentStudents: 1,
    absentStudents: 0,
  },
  {
    id: 'trip-012',
    routeId: 'route-4',
    routeName: 'West District Route',
    driverId: 'driver-3',
    driverName: 'Michael Chen',
    vehicleNumber: 'BUS-103',
    tripType: 'DROP',
    tripDate: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(15, 15, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    status: 'COMPLETED',
    totalStudents: 1,
    presentStudents: 1,
    absentStudents: 0,
  },
];

// Helper function to get all routes assigned to a driver
export const getDriverRoutes = (driverId: string): RouteResponse[] => {
  const driverRoutes: RouteResponse[] = [];
  
  Object.entries(mockDriverAssignments).forEach(([routeId, assignments]) => {
    const activeAssignment = assignments.find(a => a.driverId === driverId && !a.activeTo);
    if (activeAssignment) {
      const route = mockRoutes.find(r => r.id === routeId);
      if (route) {
        driverRoutes.push(route);
      }
    }
  });
  
  return driverRoutes;
};

// Helper function to get driver trip history with filters
export const getDriverTrips = (
  driverId: string,
  filters?: import('@/types').DriverTripFilters
): import('@/types').Trip[] => {
  let trips = mockTrips.filter(trip => trip.driverId === driverId);
  
  // Apply filters
  if (filters?.startDate) {
    trips = trips.filter(trip => trip.tripDate >= filters.startDate!);
  }
  
  if (filters?.endDate) {
    trips = trips.filter(trip => trip.tripDate <= filters.endDate!);
  }
  
  if (filters?.routeId) {
    trips = trips.filter(trip => trip.routeId === filters.routeId);
  }
  
  if (filters?.tripType) {
    trips = trips.filter(trip => trip.tripType === filters.tripType);
  }
  
  // Sort by date and time descending (most recent first)
  return trips.sort((a, b) => {
    const dateCompare = b.tripDate.localeCompare(a.tripDate);
    if (dateCompare !== 0) return dateCompare;
    return b.startTime.localeCompare(a.startTime);
  });
};

// Mock Student Attendance Records
export const mockStudentAttendance: import('@/types').StudentAttendanceRecord[] = [
  // Emma Johnson (student-1) - North District Route
  {
    id: 'att-001',
    studentId: 'student-1',
    studentName: 'Emma Johnson',
    tripId: 'trip-001',
    tripDate: new Date().toISOString().split('T')[0],
    tripType: 'PICKUP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-002',
    studentId: 'student-1',
    studentName: 'Emma Johnson',
    tripId: 'trip-004',
    tripDate: new Date().toISOString().split('T')[0],
    tripType: 'DROP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-003',
    studentId: 'student-1',
    studentName: 'Emma Johnson',
    tripId: 'trip-007',
    tripDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tripType: 'PICKUP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'ABSENT',
    markedAt: new Date(Date.now() - 86400000 + 7.5 * 3600000).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-004',
    studentId: 'student-1',
    studentName: 'Emma Johnson',
    tripId: 'trip-013',
    tripDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    tripType: 'PICKUP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(Date.now() - 2 * 86400000 + 7 * 3600000).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-005',
    studentId: 'student-1',
    studentName: 'Emma Johnson',
    tripId: 'trip-014',
    tripDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    tripType: 'DROP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(Date.now() - 2 * 86400000 + 15 * 3600000).toISOString(),
    markedBy: 'driver-1',
  },
  
  // Liam Smith (student-2) - North District Route
  {
    id: 'att-006',
    studentId: 'student-2',
    studentName: 'Liam Smith',
    tripId: 'trip-001',
    tripDate: new Date().toISOString().split('T')[0],
    tripType: 'PICKUP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(new Date().setHours(7, 35, 0, 0)).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-007',
    studentId: 'student-2',
    studentName: 'Liam Smith',
    tripId: 'trip-004',
    tripDate: new Date().toISOString().split('T')[0],
    tripType: 'DROP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(new Date().setHours(15, 35, 0, 0)).toISOString(),
    markedBy: 'driver-1',
  },
  {
    id: 'att-008',
    studentId: 'student-2',
    studentName: 'Liam Smith',
    tripId: 'trip-007',
    tripDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tripType: 'PICKUP',
    routeId: 'route-1',
    routeName: 'North District Route',
    status: 'PRESENT',
    markedAt: new Date(Date.now() - 86400000 + 7.5 * 3600000).toISOString(),
    markedBy: 'driver-1',
  },
];

// Helper function to get student attendance summary
export const getStudentAttendanceSummary = (studentId: string): import('@/types').StudentAttendanceSummary => {
  const records = mockStudentAttendance.filter(att => att.studentId === studentId);
  
  const totalTrips = records.length;
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const pendingCount = records.filter(r => r.status === 'PENDING').length;
  const attendancePercentage = totalTrips > 0 ? Math.round((presentCount / totalTrips) * 100) : 0;
  
  // Sort by date descending (most recent first)
  const recentRecords = [...records].sort((a, b) => {
    const dateCompare = b.tripDate.localeCompare(a.tripDate);
    if (dateCompare !== 0) return dateCompare;
    return b.tripType.localeCompare(a.tripType);
  }).slice(0, 10); // Last 10 records
  
  return {
    studentId,
    totalTrips,
    presentCount,
    absentCount,
    pendingCount,
    attendancePercentage,
    recentRecords,
  };
};

// Mock Transport Fees
export const mockTransportFees: import('@/types').TransportFee[] = [
  // Emma Johnson (student-1) - Monthly fees
  {
    id: 'fee-001',
    studentId: 'student-1',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-01-28',
    paidAmount: 150,
    status: 'PAID',
    remarks: 'Paid via online banking',
  },
  {
    id: 'fee-002',
    studentId: 'student-1',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
    remarks: 'Payment due soon',
  },
  {
    id: 'fee-003',
    studentId: 'student-1',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-01-01',
    paidDate: '2026-01-05',
    paidAmount: 150,
    status: 'PAID',
    remarks: 'Paid via cash',
  },
  
  // Liam Smith (student-2) - Monthly fees
  {
    id: 'fee-004',
    studentId: 'student-2',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-02-01',
    paidAmount: 150,
    status: 'PAID',
    remarks: 'Paid on time',
  },
  {
    id: 'fee-005',
    studentId: 'student-2',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
  },
  
  // Olivia Brown (student-3) - Quarterly fees
  {
    id: 'fee-006',
    studentId: 'student-3',
    academicYear: '2025-2026',
    frequency: 'QUARTERLY',
    amount: 400,
    currency: 'USD',
    dueDate: '2026-01-15',
    paidDate: '2026-01-10',
    paidAmount: 400,
    status: 'PAID',
    remarks: 'Q1 payment - Paid early',
  },
  {
    id: 'fee-007',
    studentId: 'student-3',
    academicYear: '2025-2026',
    frequency: 'QUARTERLY',
    amount: 400,
    currency: 'USD',
    dueDate: '2026-04-15',
    status: 'PENDING',
    remarks: 'Q2 payment',
  },
  
  // Noah Davis (student-4) - Monthly with overdue
  {
    id: 'fee-008',
    studentId: 'student-4',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-01-01',
    status: 'OVERDUE',
    remarks: 'Payment overdue - please contact admin',
  },
  {
    id: 'fee-009',
    studentId: 'student-4',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-02-05',
    paidAmount: 100,
    status: 'PARTIAL',
    remarks: 'Partial payment received - $50 pending',
  },
  {
    id: 'fee-010',
    studentId: 'student-4',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
  },
  
  // Ava Wilson (student-5) - Annual fee
  {
    id: 'fee-011',
    studentId: 'student-5',
    academicYear: '2025-2026',
    frequency: 'ANNUALLY',
    amount: 1500,
    currency: 'USD',
    dueDate: '2025-09-01',
    paidDate: '2025-08-25',
    paidAmount: 1500,
    status: 'PAID',
    remarks: 'Annual fee paid in full',
  },
  
  // Ethan Martinez (student-6) - Monthly fees
  {
    id: 'fee-012',
    studentId: 'student-6',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-01-30',
    paidAmount: 150,
    status: 'PAID',
  },
  {
    id: 'fee-013',
    studentId: 'student-6',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
  },
  
  // James Johnson (student-7) - Monthly fees
  {
    id: 'fee-014',
    studentId: 'student-7',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-02-02',
    paidAmount: 150,
    status: 'PAID',
  },
  {
    id: 'fee-015',
    studentId: 'student-7',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
  },
  
  // Sophia Garcia (student-8) - No route assigned, no fees
  
  // Mason Lee (student-9) - Monthly fees
  {
    id: 'fee-016',
    studentId: 'student-9',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-02-01',
    paidDate: '2026-02-01',
    paidAmount: 150,
    status: 'PAID',
  },
  {
    id: 'fee-017',
    studentId: 'student-9',
    academicYear: '2025-2026',
    frequency: 'MONTHLY',
    amount: 150,
    currency: 'USD',
    dueDate: '2026-03-01',
    status: 'PENDING',
  },
  
  // Isabella Taylor (student-10) - Quarterly fees
  {
    id: 'fee-018',
    studentId: 'student-10',
    academicYear: '2025-2026',
    frequency: 'QUARTERLY',
    amount: 400,
    currency: 'USD',
    dueDate: '2026-01-15',
    paidDate: '2026-01-20',
    paidAmount: 400,
    status: 'PAID',
    remarks: 'Q1 payment',
  },
  {
    id: 'fee-019',
    studentId: 'student-10',
    academicYear: '2025-2026',
    frequency: 'QUARTERLY',
    amount: 400,
    currency: 'USD',
    dueDate: '2026-04-15',
    status: 'PENDING',
    remarks: 'Q2 payment',
  },
];

// Helper function to get student fees summary
export const getStudentFeesSummary = (studentId: string): import('@/types').StudentFeesSummary => {
  const fees = mockTransportFees.filter(fee => fee.studentId === studentId);
  
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const pendingAmount = fees
    .filter(f => f.status === 'PENDING' || f.status === 'PARTIAL')
    .reduce((sum, fee) => sum + (fee.amount - (fee.paidAmount || 0)), 0);
  const overdueAmount = fees
    .filter(f => f.status === 'OVERDUE')
    .reduce((sum, fee) => sum + fee.amount, 0);
  
  // Sort fees by due date descending (most recent first)
  const sortedFees = [...fees].sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  
  return {
    studentId,
    totalFees,
    paidAmount,
    pendingAmount,
    overdueAmount,
    currency: fees[0]?.currency || 'USD',
    fees: sortedFees,
  };
};
