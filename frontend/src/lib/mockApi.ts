import { AxiosInstance } from 'axios';
import {
  mockRoutes,
  getMockRouteById,
  getMockRouteStudents,
  getMockDriverAssignments,
  mockRouteStudents,
  mockDrivers,
  mockStudents,
  mockDriverAssignments,
} from './mockData';

// Flag to enable/disable mock API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const setupMockApi = (api: AxiosInstance) => {
  if (!USE_MOCK_API) {
    return;
  }

  console.log('🎭 Mock API enabled - Using sample data');
  console.log('📋 Available sample routes:', mockRoutes.length);
  console.log('👥 Sample students:', mockRouteStudents);
  console.log('🚗 Sample drivers:', getMockDriverAssignments);

  // Intercept requests and return mock data
  api.interceptors.request.use(
    async (config) => {
      const { method, url } = config;

      // Mock GET /routes
      if (method === 'get' && url === '/routes') {
        return Promise.reject({
          config,
          response: {
            data: mockRoutes,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
          __isMockResponse: true, // Add marker for mock responses
        });
      }

      // Mock GET /routes/:routeId
      if (method === 'get' && url?.match(/^\/routes\/[^/]+$/)) {
        const routeId = url.split('/')[2];
        const route = getMockRouteById(routeId);

        if (route) {
          return Promise.reject({
            config,
            response: {
              data: route,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
            },
            __isMockResponse: true,
          });
        } else {
          return Promise.reject({
            config,
            response: {
              data: { message: 'Route not found' },
              status: 404,
              statusText: 'Not Found',
              headers: {},
              config,
            },
            __isMockResponse: true,
          });
        }
      }

      // Mock GET /routes/:routeId/students
      if (method === 'get' && url?.match(/^\/routes\/[^/]+\/students$/)) {
        const routeId = url.split('/')[2];
        const students = getMockRouteStudents(routeId);

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: students,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /routes/:routeId/drivers
      if (method === 'get' && url?.match(/^\/routes\/[^/]+\/drivers$/)) {
        const routeId = url.split('/')[2];
        const assignments = getMockDriverAssignments(routeId);

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: assignments,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock DELETE /routes/:routeId/students/:studentId
      if (method === 'delete' && url?.match(/^\/routes\/[^/]+\/students\/[^/]+$/)) {
        const [, , routeId, , studentId] = url.split('/');

        // Remove student from mock data
        if (mockRouteStudents[routeId]) {
          mockRouteStudents[routeId] = mockRouteStudents[routeId].filter(
            (rs) => rs.studentId !== studentId
          );
          
          // Update student count in route
          const route = mockRoutes.find((r) => r.id === routeId);
          if (route) {
            route.studentCount = mockRouteStudents[routeId].length;
          }
          
          // Clear student's routeId and routeName
          const student = mockStudents.find(s => s.id === studentId);
          if (student) {
            student.routeId = undefined;
            student.routeName = undefined;
          }
        }

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock POST /routes (create route)
      if (method === 'post' && url === '/routes') {
        const newRoute = {
          id: `route-${Date.now()}`,
          tenantId: 'tenant-1',
          ...config.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          studentCount: 0,
        };

        mockRoutes.push(newRoute);

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: newRoute,
            status: 201,
            statusText: 'Created',
            headers: {},
            config,
          },
        });
      }

      // Mock DELETE /routes/:routeId
      if (method === 'delete' && url?.match(/^\/routes\/[^/]+$/)) {
        const routeId = url.split('/')[2];
        const index = mockRoutes.findIndex((r) => r.id === routeId);

        if (index !== -1) {
          mockRoutes.splice(index, 1);
          return Promise.reject({
            __isMockResponse: true,
            config,
            response: {
              data: {},
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
            },
          });
        }
      }

      // Mock PUT /routes/:routeId (update route)
      if (method === 'put' && url?.match(/^\/routes\/[^/]+$/)) {
        const routeId = url.split('/')[2];
        const routeIndex = mockRoutes.findIndex((r) => r.id === routeId);

        if (routeIndex !== -1) {
          mockRoutes[routeIndex] = {
            ...mockRoutes[routeIndex],
            ...config.data,
            updatedAt: new Date().toISOString(),
          };

          return Promise.reject({
            __isMockResponse: true,
            config,
            response: {
              data: mockRoutes[routeIndex],
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
            },
          });
        }
      }

      // Mock POST /routes/:routeId/assign-students
      if (method === 'post' && url?.match(/^\/routes\/[^/]+\/assign-students$/)) {
        const routeId = url.split('/')[2];
        const { studentIds } = config.data;

        // Update mock data with attendance information
        mockRouteStudents[routeId] = studentIds.map((studentId: string) => {
          const student = mockStudents.find((s) => s.id === studentId);
          
          // Update student's routeId and routeName
          if (student) {
            const route = mockRoutes.find(r => r.id === routeId);
            student.routeId = routeId;
            student.routeName = route?.name;
          }
          
          return {
            routeId,
            studentId,
            student,
            attendancePresent: Math.floor(Math.random() * 5) + 18, // Random between 18-22
            attendanceTotal: 22,
          };
        });

        // Update student count in route
        const route = mockRoutes.find((r) => r.id === routeId);
        if (route) {
          route.studentCount = studentIds.length;
        }

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: mockRouteStudents[routeId],
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock POST /routes/:routeId/assign-driver
      if (method === 'post' && url?.match(/^\/routes\/[^/]+\/assign-driver$/)) {
        const routeId = url.split('/')[2];
        const { driverId } = config.data;

        // Set active_to on existing active assignment
        if (mockDriverAssignments[routeId]) {
          mockDriverAssignments[routeId].forEach((assignment) => {
            if (!assignment.activeTo) {
              assignment.activeTo = new Date().toISOString();
            }
          });
        } else {
          mockDriverAssignments[routeId] = [];
        }

        // Create new assignment
        const driver = mockDrivers.find((d) => d.id === driverId);
        const newAssignment = {
          id: `assignment-${Date.now()}`,
          routeId,
          driverId,
          activeFrom: new Date().toISOString(),
          activeTo: undefined,
          driver,
        };

        mockDriverAssignments[routeId].push(newAssignment);

        // Update driver name in route
        const route = mockRoutes.find((r) => r.id === routeId);
        if (route && driver) {
          route.driverName = driver.name;
        }

        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: newAssignment,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /admin/drivers
      if (method === 'get' && url === '/admin/drivers') {
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: mockDrivers,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /admin/students
      if (method === 'get' && url === '/admin/students') {
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: mockStudents,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /admin/drivers/:driverId/routes
      if (method === 'get' && url?.match(/^\/admin\/drivers\/[^/]+\/routes$/)) {
        const driverId = url.split('/')[3];
        const { getDriverRoutes } = await import('./mockData');
        const driverRoutes = getDriverRoutes(driverId);
        
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: driverRoutes,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /admin/drivers/:driverId/trips
      if (method === 'get' && url?.match(/^\/admin\/drivers\/[^/]+\/trips$/)) {
        const driverId = url.split('/')[3];
        const { getDriverTrips } = await import('./mockData');
        
        // Parse query parameters for filters
        const params = config.params || {};
        const filters = {
          startDate: params.startDate,
          endDate: params.endDate,
          routeId: params.routeId,
          tripType: params.tripType,
        };
        
        const trips = getDriverTrips(driverId, filters);
        
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: trips,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /admin/students/:studentId/attendance
      if (method === 'get' && url?.match(/^\/admin\/students\/[^/]+\/attendance$/)) {
        const studentId = url.split('/')[3];
        const { getStudentAttendanceSummary } = await import('./mockData');
        const attendance = getStudentAttendanceSummary(studentId);
        
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: attendance,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /parent/dashboard/stats
      if (method === 'get' && url === '/parent/dashboard/stats') {
        const parentStats = {
          myChildren: 2,
          activeRoutes: 2,
          upcomingTrips: 4,
        };
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: parentStats,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /parent/children
      if (method === 'get' && url === '/parent/children') {
        const childrenTransport = [
          {
            id: 'student-1',
            name: 'Emma Johnson',
            grade: 'Grade 5',
            routeId: 'route-1',
            routeName: 'North District Route',
            routeStatus: 'ACTIVE',
            driverName: undefined,
            driverPhone: undefined,
            vehicleNumber: 'BUS-101',
            pickupTime: '07:30 AM',
            dropoffTime: '03:45 PM',
            pickupLocation: undefined,
            dropoffLocation: undefined,
          },
          {
            id: 'student-7',
            name: 'James Johnson',
            grade: 'Grade 3',
            routeId: 'route-2',
            routeName: 'South District Route',
            routeStatus: 'ACTIVE',
            driverName: undefined,
            driverPhone: undefined,
            vehicleNumber: 'BUS-102',
            pickupTime: '07:45 AM',
            dropoffTime: '04:00 PM',
            pickupLocation: undefined,
            dropoffLocation: undefined,
          },
        ];
        return Promise.reject({
          __isMockResponse: true,
          config,
          response: {
            data: childrenTransport,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          },
        });
      }

      // Mock GET /parent/children/:childId
      if (method === 'get' && url?.match(/^\/parent\/children\/[^/]+$/)) {
        const childId = url.split('/')[3];
        const childrenTransport = [
          {
            id: 'student-1',
            name: 'Emma Johnson',
            grade: 'Grade 5',
            routeId: 'route-1',
            routeName: 'North District Route',
            routeStatus: 'ACTIVE',
            driverName: undefined,
            driverPhone: undefined,
            vehicleNumber: 'BUS-101',
            pickupTime: '07:30 AM',
            dropoffTime: '03:45 PM',
            pickupLocation: undefined,
            dropoffLocation: undefined,
          },
          {
            id: 'student-7',
            name: 'James Johnson',
            grade: 'Grade 3',
            routeId: 'route-2',
            routeName: 'South District Route',
            routeStatus: 'ACTIVE',
            driverName: undefined,
            driverPhone: undefined,
            vehicleNumber: 'BUS-102',
            pickupTime: '07:45 AM',
            dropoffTime: '04:00 PM',
            pickupLocation: undefined,
            dropoffLocation: undefined,
          },
        ];
        const child = childrenTransport.find(c => c.id === childId);
        
        if (child) {
          return Promise.reject({
            __isMockResponse: true,
            config,
            response: {
              data: child,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
            },
          });
        } else {
          return Promise.reject({
            __isMockResponse: true,
            config,
            response: {
              data: { message: 'Child not found' },
              status: 404,
              statusText: 'Not Found',
              headers: {},
              config,
            },
          });
        }
      }

      // If no mock matches, let the request proceed normally
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercept response errors to handle our mock responses
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // If this is a mock response, return it as a successful response
      if (error.response && error.config) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
};
