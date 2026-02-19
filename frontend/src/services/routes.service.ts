import api from '@/lib/api';
import {
  Route,
  RouteResponse,
  CreateRouteRequest,
  AssignDriverRequest,
  AssignStudentsRequest,
  RouteStudent,
  RouteDriverAssignment,
} from '@/types';

class RoutesService {
  /**
   * Fetch all routes for the current tenant
   * @param status - Optional filter by route status
   * @returns Promise with array of routes
   */
  async fetchRoutes(status?: 'ACTIVE' | 'INACTIVE'): Promise<RouteResponse[]> {
    try {
      const params = status ? { status } : {};
      const response = await api.get<RouteResponse[]>('/routes', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      throw error;
    }
  }

  /**
   * Fetch a single route by ID
   * @param routeId - The route identifier
   * @returns Promise with route details
   */
  async fetchRouteById(routeId: string): Promise<RouteResponse> {
    try {
      const response = await api.get<RouteResponse>(`/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new route
   * @param request - Route creation data
   * @returns Promise with created route
   */
  async createRoute(request: CreateRouteRequest): Promise<Route> {
    try {
      const response = await api.post<Route>('/routes', request);
      return response.data;
    } catch (error) {
      console.error('Failed to create route:', error);
      throw error;
    }
  }

  /**
   * Update an existing route
   * @param routeId - The route identifier
   * @param request - Route update data
   * @returns Promise with updated route
   */
  async updateRoute(routeId: string, request: Partial<CreateRouteRequest>): Promise<Route> {
    try {
      const response = await api.put<Route>(`/routes/${routeId}`, request);
      return response.data;
    } catch (error) {
      console.error(`Failed to update route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a route
   * @param routeId - The route identifier
   * @returns Promise that resolves when deletion is complete
   */
  async deleteRoute(routeId: string): Promise<void> {
    try {
      await api.delete(`/routes/${routeId}`);
    } catch (error) {
      console.error(`Failed to delete route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a driver to a route
   * @param routeId - The route identifier
   * @param request - Driver assignment data
   * @returns Promise with the driver assignment
   */
  async assignDriver(routeId: string, request: AssignDriverRequest): Promise<RouteDriverAssignment> {
    try {
      const response = await api.post<RouteDriverAssignment>(
        `/routes/${routeId}/assign-driver`,
        request
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to assign driver to route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Assign multiple students to a route
   * @param routeId - The route identifier
   * @param request - Student assignment data
   * @returns Promise with the student assignments
   */
  async assignStudents(routeId: string, request: AssignStudentsRequest): Promise<RouteStudent[]> {
    try {
      const response = await api.post<RouteStudent[]>(
        `/routes/${routeId}/assign-students`,
        request
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to assign students to route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a student from a route
   * @param routeId - The route identifier
   * @param studentId - The student identifier
   * @returns Promise that resolves when removal is complete
   */
  async removeStudent(routeId: string, studentId: string): Promise<void> {
    try {
      await api.delete(`/routes/${routeId}/students/${studentId}`);
    } catch (error) {
      console.error(`Failed to remove student ${studentId} from route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch students assigned to a route
   * @param routeId - The route identifier
   * @returns Promise with array of route students
   */
  async fetchRouteStudents(routeId: string): Promise<RouteStudent[]> {
    try {
      const response = await api.get<RouteStudent[]>(`/routes/${routeId}/students`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch students for route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch driver assignment history for a route
   * @param routeId - The route identifier
   * @returns Promise with array of driver assignments
   */
  async fetchDriverAssignments(routeId: string): Promise<RouteDriverAssignment[]> {
    try {
      const response = await api.get<RouteDriverAssignment[]>(`/routes/${routeId}/drivers`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch driver assignments for route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch routes assigned to the current driver (for driver role)
   * @returns Promise with array of routes
   */
  async fetchDriverRoutes(): Promise<RouteResponse[]> {
    try {
      const response = await api.get<RouteResponse[]>('/driver/routes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch driver routes:', error);
      throw error;
    }
  }
}

export const routesService = new RoutesService();
