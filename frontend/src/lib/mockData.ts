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
    routeId: 'route-1',
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
};

// Mock Driver Assignments
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
  
  return mockDrivers.map((driver, index) => {
    const hasActiveTrip = driver.routeId && mockRoutes.find(r => r.id === driver.routeId)?.status === 'ACTIVE';
    const lastGPSSeconds = Math.floor(Math.random() * 180); // Random 0-180 seconds
    
    return {
      driverId: driver.id,
      driverName: driver.name,
      vehicleNumber: driver.vehicleNumber,
      currentTripId: hasActiveTrip ? `trip-${driver.routeId}-morning` : undefined,
      lastTripStartTime: hasActiveTrip ? new Date(now.getTime() - 30 * 60 * 1000).toISOString() : undefined,
      lastTripEndTime: !hasActiveTrip && index % 2 === 0 ? new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() : undefined,
      lastGPSTimestamp: hasActiveTrip ? new Date(now.getTime() - lastGPSSeconds * 1000).toISOString() : undefined,
      totalTripsToday: hasActiveTrip ? 1 : (index % 3),
      status: hasActiveTrip ? 'ACTIVE' : (driver.status === 'ACTIVE' ? 'IDLE' : 'OFFLINE'),
    };
  });
};
