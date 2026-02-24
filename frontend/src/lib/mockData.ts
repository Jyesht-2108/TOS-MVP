import { RouteResponse, RouteStudent, RouteDriverAssignment, Student, Driver } from '@/types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    tenantId: 'tenant-1',
    name: 'Emma Johnson',
    parentUserId: 'parent-1',
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
    parentUserId: 'parent-2',
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

// Mock Children Transport Info for Parent Portal
export const mockChildrenTransport: import('@/types').ChildTransportInfo[] = [
  {
    id: 'student-1',
    name: 'Emma Johnson',
    grade: '5',
    routeId: 'route-1',
    routeName: 'North District Route',
    routeStatus: 'ACTIVE',
    driverName: 'John Anderson',
    driverPhone: '+1-555-0101',
    vehicleNumber: 'BUS-101',
    pickupTime: '07:30 AM',
    dropoffTime: '03:30 PM',
    pickupLocation: '123 Main St, North District',
    dropoffLocation: 'School Main Entrance',
  },
  {
    id: 'student-2',
    name: 'Liam Smith',
    grade: '6',
    routeId: 'route-1',
    routeName: 'North District Route',
    routeStatus: 'ACTIVE',
    driverName: 'John Anderson',
    driverPhone: '+1-555-0101',
    vehicleNumber: 'BUS-101',
    pickupTime: '07:35 AM',
    dropoffTime: '03:30 PM',
    pickupLocation: '456 Oak Ave, North District',
    dropoffLocation: 'School Main Entrance',
  },
];
