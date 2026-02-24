import { RouteResponse, RouteStudent, RouteDriverAssignment, Student, Driver } from '@/types';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    tenantId: 'tenant-1',
    name: 'Emma Johnson',
    parentUserId: 'parent-1',
    status: 'ACTIVE',
  },
  {
    id: 'student-2',
    tenantId: 'tenant-1',
    name: 'Liam Smith',
    parentUserId: 'parent-2',
    status: 'ACTIVE',
  },
  {
    id: 'student-3',
    tenantId: 'tenant-1',
    name: 'Olivia Brown',
    parentUserId: 'parent-3',
    status: 'ACTIVE',
  },
  {
    id: 'student-4',
    tenantId: 'tenant-1',
    name: 'Noah Davis',
    parentUserId: 'parent-4',
    status: 'ACTIVE',
  },
  {
    id: 'student-5',
    tenantId: 'tenant-1',
    name: 'Ava Wilson',
    parentUserId: 'parent-5',
    status: 'ACTIVE',
  },
  {
    id: 'student-6',
    tenantId: 'tenant-1',
    name: 'Ethan Martinez',
    parentUserId: 'parent-6',
    status: 'INACTIVE',
  },
];

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    tenantId: 'tenant-1',
    name: 'John Anderson',
    phone: '+1-555-0101',
    status: 'ACTIVE',
  },
  {
    id: 'driver-2',
    tenantId: 'tenant-1',
    name: 'Sarah Thompson',
    phone: '+1-555-0102',
    status: 'ACTIVE',
  },
  {
    id: 'driver-3',
    tenantId: 'tenant-1',
    name: 'Michael Chen',
    phone: '+1-555-0103',
    status: 'ACTIVE',
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
    },
    {
      routeId: 'route-1',
      studentId: 'student-2',
      student: mockStudents[1],
    },
    {
      routeId: 'route-1',
      studentId: 'student-3',
      student: mockStudents[2],
    },
  ],
  'route-2': [
    {
      routeId: 'route-2',
      studentId: 'student-4',
      student: mockStudents[3],
    },
    {
      routeId: 'route-2',
      studentId: 'student-5',
      student: mockStudents[4],
    },
  ],
  'route-3': [],
  'route-4': [
    {
      routeId: 'route-4',
      studentId: 'student-6',
      student: mockStudents[5],
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
