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
  parentName?: string;
  grade?: string;
  section?: string;
  routeId?: string;
  routeName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Driver Types
export interface Driver {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  licenseNumber?: string;
  vehicleNumber?: string;
  routeId?: string;
  routeName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Route Assignment Types
export interface RouteStudent {
  routeId: string;
  studentId: string;
  student?: Student;
  attendancePresent?: number;
  attendanceTotal?: number;
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

// Parent Dashboard Types
export interface ParentDashboardStats {
  myChildren: number;
  activeRoutes: number;
  upcomingTrips: number;
}

export interface ChildTransportInfo {
  id: string;
  name: string;
  grade?: string;
  routeId?: string;
  routeName?: string;
  routeStatus?: RouteStatus;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  pickupTime?: string;
  dropoffTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

// Live Tracking Types
export interface BusLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
}

export interface LiveRouteTracking {
  routeId: string;
  routeName: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: BusLocation;
  tripStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  lastUpdated: string;
  estimatedArrival?: string;
}

// Admin Live Monitoring Types
export interface TripAttendance {
  studentId: string;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'PENDING';
  pickupTime?: string;
  pickupLocation?: string;
}

export interface ActiveTrip {
  tripId: string;
  routeId: string;
  routeName: string;
  vehicleNumber?: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  tripType: 'MORNING' | 'EVENING';
  startTime: string;
  endTime?: string;
  currentLocation?: BusLocation;
  lastGPSPing: string;
  gpsHealthStatus: 'HEALTHY' | 'WARNING' | 'STALE';
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  pendingStudents: number;
  attendance: TripAttendance[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface DriverActivity {
  driverId: string;
  driverName: string;
  vehicleNumber?: string;
  currentTripId?: string;
  lastTripStartTime?: string;
  lastTripEndTime?: string;
  lastGPSTimestamp?: string;
  totalTripsToday: number;
  status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
}

// Audit Log Types
export interface AttendanceAuditLog {
  id: string;
  tripId: string;
  studentId: string;
  studentName: string;
  oldStatus: 'PRESENT' | 'ABSENT' | 'PENDING';
  newStatus: 'PRESENT' | 'ABSENT' | 'PENDING';
  reason: string;
  editedBy: string;
  editedByName: string;
  editedAt: string;
}

export interface AttendanceCorrection {
  studentId: string;
  newStatus: 'PRESENT' | 'ABSENT' | 'PENDING';
  reason: string;
}

// Driver Trip History Types
export type TripType = 'PICKUP' | 'DROP';
export type TripStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PENDING';

export interface Trip {
  id: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  vehicleNumber?: string;
  tripType: TripType;
  tripDate: string;
  startTime: string;
  endTime?: string;
  status: TripStatus;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

export interface DriverTripFilters {
  startDate?: string;
  endDate?: string;
  routeId?: string;
  tripType?: TripType;
}

// Student Attendance Types
export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  tripId: string;
  tripDate: string;
  tripType: TripType;
  routeId: string;
  routeName: string;
  status: AttendanceStatus;
  markedAt?: string;
  markedBy?: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  totalTrips: number;
  presentCount: number;
  absentCount: number;
  pendingCount: number;
  attendancePercentage: number;
  recentRecords: StudentAttendanceRecord[];
}

// Transport Fee Types
export type FeePaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
export type FeeFrequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';

export interface TransportFee {
  id: string;
  studentId: string;
  academicYear: string;
  frequency: FeeFrequency;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  status: FeePaymentStatus;
  remarks?: string;
}

export interface StudentFeesSummary {
  studentId: string;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  currency: string;
  fees: TransportFee[];
}

// Driver Attendance Types
export type DriverAttendanceStatus = 'PRESENT' | 'ABSENT' | 'ON_LEAVE';

export interface DriverAttendanceRecord {
  id: string;
  driverId: string;
  driverName: string;
  date: string;
  status: DriverAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  markedBy?: string;
  markedAt?: string;
}

export interface DriverAttendanceSummary {
  driverId: string;
  totalDays: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  attendancePercentage: number;
  recentRecords: DriverAttendanceRecord[];
}
