import { User, ClipboardCheck, TrendingUp, DollarSign, BookOpen, Calendar, Award, Bell, MessageSquare, FileText } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCalendar } from '@/components/calendar/EventCalendar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calendarService } from '@/services/calendar.service';
import { CalendarEvent } from '@/components/calendar/EventCalendar';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    calendarService.getEvents().then(setEvents);
  }, []);

  const recentActivities = [
    { type: 'attendance', message: 'Your child was marked present', time: '2 hours ago', icon: ClipboardCheck },
    { type: 'marks', message: 'New test marks uploaded - Mathematics: 95/100', time: '1 day ago', icon: Award },
    { type: 'fee', message: 'Fee payment due on Feb 28, 2026', time: '2 days ago', icon: DollarSign },
    { type: 'announcement', message: 'Parent-Teacher meeting scheduled', time: '3 days ago', icon: Bell },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: '2026-02-25', time: '10:00 AM' },
    { title: 'Annual Day Celebration', date: '2026-03-05', time: '2:00 PM' },
    { title: 'Fee Payment Deadline', date: '2026-02-28', time: 'All Day' },
  ];

  const childrenData = [
    { name: 'John Doe', class: 'Class 10-A', attendance: '95%', avgMarks: '85%', rank: '#12' },
  ];

  const quickActions = [
    { title: 'View Progress', subtitle: 'Academic performance', icon: TrendingUp, path: '/parent/progress', color: 'bg-blue-500' },
    { title: 'Attendance', subtitle: 'Check attendance', icon: ClipboardCheck, path: '/parent/attendance', color: 'bg-green-500' },
    { title: 'Payments', subtitle: 'Fee management', icon: DollarSign, path: '/parent/payments', color: 'bg-orange-500' },
    { title: 'Contact Teacher', subtitle: 'Send message', icon: MessageSquare, path: '/parent/messages', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome, Parent 👋</h1>
        <p className="text-primary-foreground/90 text-lg">
          Track your child's progress and stay connected with their education
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Child's Attendance" value="95%" icon={ClipboardCheck} variant="success" subtitle="This month" delay={0.1} />
        <StatsCard title="Average Marks" value="85%" icon={TrendingUp} variant="primary" subtitle="Overall performance" delay={0.15} />
        <StatsCard title="Pending Fees" value="₹5,000" icon={DollarSign} variant="warning" subtitle="Due Feb 28" delay={0.2} />
        <StatsCard title="Class Rank" value="#12" icon={Award} variant="default" subtitle="Out of 45 students" delay={0.25} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${action.color} p-3 rounded-xl text-white`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Children Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childrenData.map((child, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-base">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">{child.class}</p>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-base font-semibold text-green-600">{child.attendance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Marks</p>
                      <p className="text-base font-semibold text-blue-600">{child.avgMarks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rank</p>
                      <p className="text-base font-semibold">{child.rank}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}
                    </p>
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

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
