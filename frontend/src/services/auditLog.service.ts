import api from '@/lib/api';
import { AttendanceAuditLog, AttendanceCorrection } from '@/types';

// Check if we should use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

// In-memory audit log store (in a real app, this would be in a database)
let auditLogs: AttendanceAuditLog[] = [];
let auditIdCounter = 1;

class AuditLogService {
  /**
   * Correct attendance and create audit log entry
   * @param tripId - The trip ID
   * @param studentId - The student ID
   * @param correction - The attendance correction data
   * @param currentStatus - The current attendance status (old value)
   * @returns Promise with the audit log entry
   */
  async correctAttendance(
    tripId: string,
    studentId: string,
    correction: AttendanceCorrection,
    currentStatus: 'PRESENT' | 'ABSENT' | 'PENDING',
    studentName: string
  ): Promise<AttendanceAuditLog> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current user
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create audit log entry
      const auditLog: AttendanceAuditLog = {
        id: `audit-${auditIdCounter++}`,
        tripId,
        studentId,
        studentName,
        oldStatus: currentStatus,
        newStatus: correction.newStatus,
        reason: correction.reason,
        editedBy: user.id,
        editedByName: user.name || user.email,
        editedAt: new Date().toISOString(),
      };

      // Store in memory
      auditLogs = [auditLog, ...auditLogs];
      
      return auditLog;
    }

    try {
      const response = await api.post<AttendanceAuditLog>(
        `/admin/trips/${tripId}/attendance/${studentId}/correct`,
        correction
      );
      return response.data;
    } catch (error) {
      console.error('Failed to correct attendance:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific trip
   * @param tripId - The trip ID
   * @returns Promise with array of audit logs
   */
  async getAuditLogs(tripId: string): Promise<AttendanceAuditLog[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return auditLogs.filter(log => log.tripId === tripId);
    }

    try {
      const response = await api.get<AttendanceAuditLog[]>(`/admin/trips/${tripId}/audit-logs`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }
  }

  /**
   * Get all audit logs (admin only)
   * @param limit - Number of logs to fetch
   * @returns Promise with array of audit logs
   */
  async getAllAuditLogs(limit: number = 50): Promise<AttendanceAuditLog[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return auditLogs.slice(0, limit);
    }

    try {
      const response = await api.get<AttendanceAuditLog[]>('/admin/audit-logs', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }
  }

  /**
   * Get current user from localStorage
   * @private
   */
  private getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

export const auditLogService = new AuditLogService();
