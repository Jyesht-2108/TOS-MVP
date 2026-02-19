import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const attendanceData = [
  { date: '2026-02-19', status: 'present', period: 'Full Day' },
  { date: '2026-02-18', status: 'present', period: 'Full Day' },
  { date: '2026-02-17', status: 'absent', period: 'Full Day', reason: 'Sick' },
  { date: '2026-02-16', status: 'present', period: 'Full Day' },
  { date: '2026-02-15', status: 'present', period: 'Full Day' },
  { date: '2026-02-14', status: 'present', period: 'Full Day' },
  { date: '2026-02-13', status: 'present', period: 'Full Day' },
  { date: '2026-02-12', status: 'present', period: 'Full Day' },
  { date: '2026-02-11', status: 'present', period: 'Full Day' },
  { date: '2026-02-10', status: 'present', period: 'Full Day' },
];

const monthlyStats = {
  totalDays: 20,
  present: 18,
  absent: 2,
  percentage: 90,
  trend: '+2.5%'
};

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState('february');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">My Attendance</h1>
          <p className="text-lg text-muted-foreground mt-2">Track your attendance record</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[200px] h-11 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January 2026</SelectItem>
            <SelectItem value="february">February 2026</SelectItem>
            <SelectItem value="march">March 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Days</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyStats.totalDays}</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Present</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{monthlyStats.present}</div>
            <p className="text-sm text-muted-foreground mt-1">Days attended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Absent</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{monthlyStats.absent}</div>
            <p className="text-sm text-muted-foreground mt-1">Days missed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Attendance %</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{monthlyStats.percentage}%</div>
            <p className="text-sm text-green-600 mt-1">{monthlyStats.trend} from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Status Alert */}
      {monthlyStats.percentage < 75 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <XCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-1">Low Attendance Warning</h3>
                <p className="text-base text-orange-800">
                  Your attendance is below the required 75%. Please ensure regular attendance to avoid academic issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Attendance Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.map((record) => (
              <div key={record.date} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    record.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {record.status === 'present' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-base">{record.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{record.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    record.status === 'present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                  {record.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { month: 'December 2025', percentage: 88, present: 17, total: 19 },
              { month: 'January 2026', percentage: 92, present: 18, total: 20 },
              { month: 'February 2026', percentage: 90, present: 18, total: 20 },
            ].map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          month.percentage >= 90 ? 'bg-green-500' :
                          month.percentage >= 75 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${month.percentage}%` }}
                      />
                    </div>
                    <span className="text-base font-semibold w-16">{month.percentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {month.present}/{month.total} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
