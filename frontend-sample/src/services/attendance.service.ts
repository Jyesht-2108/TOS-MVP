import apiClient from '@/lib/api';

export const attendanceService = {
  async markAttendance(data: { classId: string; date: string; records: any[] }) {
    const response = await apiClient.post('/api/attendance', data);
    return response.data;
  },

  async getAttendance(params: { classId?: string; studentId?: string; startDate?: string; endDate?: string }) {
    const response = await apiClient.get('/api/attendance', { params });
    return response.data;
  },

  async getAttendanceStats(studentId: string) {
    const response = await apiClient.get(`/api/attendance/stats/${studentId}`);
    return response.data;
  },
};
