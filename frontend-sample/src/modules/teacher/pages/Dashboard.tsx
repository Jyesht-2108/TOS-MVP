import { ClipboardCheck, FileText, MessageSquare, Users, BookOpen, Calendar, TrendingUp, Award } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCalendar } from '@/components/calendar/EventCalendar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calendarService } from '@/services/calendar.service';
import { CalendarEvent } from '@/components/calendar/EventCalendar';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    calendarService.getEvents().then(setEvents);
  }, []);

  const todayClasses = [
    { time: '09:00 AM', class: '10-A', subject: 'Mathematics', room: 'Room 201' },
    { time: '11:00 AM', class: '9-B', subject: 'Mathematics', room: 'Room 105' },
    { time: '02:00 PM', class: '10-B', subject: 'Mathematics', room: 'Room 201' },
  ];

  const recentActivities = [
    { action: 'Marked attendance', detail: 'Class 10-A - 38/40 present', time: '2 hours ago' },
    { action: 'Uploaded material', detail: 'Chapter 5 - Algebra Notes', time: '5 hours ago' },
    { action: 'Entered marks', detail: 'Mid-term exam - Class 9-B', time: '1 day ago' },
  ];

  const quickActions = [
    { title: 'Mark Attendance', subtitle: 'Record student attendance', icon: ClipboardCheck, path: '/teacher/attendance', color: 'bg-blue-500' },
    { title: 'Enter Marks', subtitle: 'Update student grades', icon: FileText, path: '/teacher/marks', color: 'bg-green-500' },
    { title: 'Class Diary', subtitle: 'Post homework & notes', icon: MessageSquare, path: '/teacher/diary', color: 'bg-purple-500' },
    { title: 'Study Materials', subtitle: 'Upload resources', icon: BookOpen, path: '/teacher/materials', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Good morning, Teacher 👋</h1>
        <p className="text-primary-foreground/90 text-lg">
          You have {todayClasses.length} classes scheduled today
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="My Classes" value="5" icon={Users} variant="primary" subtitle="Active classes" delay={0.1} />
        <StatsCard title="Total Students" value="180" icon={Users} variant="success" subtitle="Across all classes" delay={0.15} />
        <StatsCard title="Pending Tasks" value="2" icon={FileText} variant="warning" subtitle="Marks to enter" delay={0.2} />
        <StatsCard title="Avg Attendance" value="95%" icon={ClipboardCheck} variant="default" subtitle="This month" delay={0.25} />
      </div>

      {/* Quick Actions - Navigation Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today's Schedule & Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle className="text-xl">Today's Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((cls, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="text-center min-w-[80px]">
                    <div className="text-base font-semibold">{cls.time}</div>
                    <div className="text-sm text-muted-foreground">{cls.room}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{cls.subject}</h4>
                    <p className="text-sm text-muted-foreground">Class {cls.class}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle className="text-xl">Recent Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <EventCalendar events={events} />
      </motion.div>

      {/* Class Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Class Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { class: '10-A', students: 40, avgScore: 78, attendance: 95 },
              { class: '10-B', students: 38, avgScore: 82, attendance: 92 },
              { class: '9-B', students: 42, avgScore: 75, attendance: 94 },
            ].map((cls) => (
              <div key={cls.class} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Class {cls.class}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{cls.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Score:</span>
                    <span className="font-medium">{cls.avgScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attendance:</span>
                    <span className="font-medium text-green-600">{cls.attendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
