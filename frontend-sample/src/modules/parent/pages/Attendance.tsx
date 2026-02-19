import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function Attendance() {
  const attendanceData = [
    { date: '2026-02-19', status: 'present' },
    { date: '2026-02-18', status: 'present' },
    { date: '2026-02-17', status: 'absent' },
    { date: '2026-02-16', status: 'present' },
    { date: '2026-02-15', status: 'present' },
  ];

  const stats = {
    present: 18,
    absent: 2,
    total: 20,
    percentage: 90
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Attendance</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.percentage}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceData.map((record) => (
              <div key={record.date} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  <span>{record.date}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
