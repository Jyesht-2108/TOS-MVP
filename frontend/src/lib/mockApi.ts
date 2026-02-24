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
          });
        }
      }

      // Mock GET /routes/:routeId/students
      if (method === 'get' && url?.match(/^\/routes\/[^/]+\/students$/)) {
        const routeId = url.split('/')[2];
        const students = getMockRouteStudents(routeId);

        return Promise.reject({
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
        }

        return Promise.reject({
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

        // Update mock data
        mockRouteStudents[routeId] = studentIds.map((studentId: string) => {
          const student = mockStudents.find((s) => s.id === studentId);
          return {
            routeId,
            studentId,
            student,
          };
        });

        // Update student count in route
        const route = mockRoutes.find((r) => r.id === routeId);
        if (route) {
          route.studentCount = studentIds.length;
        }

        return Promise.reject({
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
