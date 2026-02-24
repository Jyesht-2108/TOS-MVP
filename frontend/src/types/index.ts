// User and Authentication Types
export interface User {
  id: string;
  tenantId: string;
  role: 'ADMIN' | 'DRIVER' | 'PARENT';
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Route Types
export type RouteStatus = 'ACTIVE' | 'INACTIVE';

export interface Route {
  id: string;
  tenantId: string;
  name: string;
  status: RouteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteRequest {
  name: string;
  status: RouteStatus;
}

export interface RouteResponse extends Route {
  driverName?: string;
  studentCount: number;
}

// Student Types
export interface Student {
  id: string;
  tenantId: string;
  name: string;
  parentUserId?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Driver Types
export interface Driver {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Route Assignment Types
export interface RouteStudent {
  routeId: string;
  studentId: string;
  student?: Student;
}

export interface RouteDriverAssignment {
  id: string;
  routeId: string;
  driverId: string;
  activeFrom: string;
  activeTo?: string;
  driver?: Driver;
}

export interface AssignDriverRequest {
  driverId: string;
}

export interface AssignStudentsRequest {
  studentIds: string[];
}

// Admin Dashboard Types
export interface DashboardStats {
  totalRoutes: number;
  activeRoutes: number;
  totalDrivers: number;
  totalStudents: number;
}

export interface RecentActivity {
  id: string;
  type: 'ROUTE_CREATED' | 'DRIVER_ASSIGNED' | 'STUDENT_ASSIGNED' | 'ROUTE_UPDATED';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}
