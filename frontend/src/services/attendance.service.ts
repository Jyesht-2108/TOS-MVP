import api from '@/lib/api';

// Attendance Types
export interface AttendanceRecord {
  id: string;
  tripId: string;
  studentId: string;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | null;
  markedAt: string | null;
  markedBy: string | null;
  locked: boolean;
}

export interface AttendanceSummary {
  tripId: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  unmarkedCount: number;
  students: AttendanceRecord[];
}

export interface AdminOverrideRequest {
  status: 'PRESENT' | 'ABSENT';
  reason: string;
}

export interface AdminOverrideResponse {
  success: boolean;
  message: string;
  attendance: AttendanceRecord;
}

class AttendanceService {
  /**
   * Fetch live attendance data for a trip
   * @param tripId - The trip ID
   * @returns Promise with attendance summary
   */
  async fetchTripAttendance(tripId: string): Promise<AttendanceSummary> {
    try {
      const response = await api.get<AttendanceSummary>('/attendance', {
        params: { trip_id: tripId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trip attendance:', error);
      throw error;
    }
  }

  /**
   * Admin override attendance status
   * @param attendanceId - The attendance record ID
   * @param data - Override request with new status and reason
   * @returns Promise with updated attendance record
   */
  async adminOverrideAttendance(
    attendanceId: string,
    data: AdminOverrideRequest
  ): Promise<AdminOverrideResponse> {
    try {
      const response = await api.patch<AdminOverrideResponse>(
        `/admin/attendance/${attendanceId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to override attendance:', error);
      throw error;
    }
  }

  /**
   * Fetch attendance audit log for a trip
   * @param tripId - The trip ID
   * @returns Promise with audit log entries
   */
  async fetchAttendanceAuditLog(tripId: string): Promise<import('@/types').AttendanceAuditLog[]> {
    try {
      const response = await api.get<import('@/types').AttendanceAuditLog[]>(
        '/admin/attendance/audit',
        {
          params: { trip_id: tripId }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendance audit log:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
