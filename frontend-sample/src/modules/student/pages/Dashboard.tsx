import { BookOpen, ClipboardCheck, TrendingUp, Award, Calendar, FileText, MessageSquare, Bell } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCalendar } from '@/components/calendar/EventCalendar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { calendarService } from '@/services/calendar.service';
import { CalendarEvent } from '@/components/calendar/EventCalendar';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    calendarService.getEvents().then(setEvents);
  }, []);

  const upcomingTests = [
    { subject: 'Mathematics', date: '2026-02-25', type: 'Unit Test', chapter: 'Chapters 1-3' },
    { subject: 'Science', date: '2026-02-27', type: 'Mid-Term', chapter: 'Full Syllabus' },
    { subject: 'English', date: '2026-03-01', type: 'Unit Test', chapter: 'Chapters 4-6' },
  ];

  const recentMarks = [
    { subject: 'Mathematics', test: 'Unit Test 1', marks: 95, maxMarks: 100, grade: 'A+' },
    { subject: 'Science', test: 'Unit Test 1', marks: 88, maxMarks: 100, grade: 'A' },
    { subject: 'English', test: 'Unit Test 1', marks: 92, maxMarks: 100, grade: 'A+' },
  ];

  const todayDiary = [
    { subject: 'Mathematics', homework: 'Complete exercises 1-10 from Chapter 5', teacher: 'Mr. John Smith' },
    { subject: 'Science', homework: 'Read Chapter 3 and prepare notes', teacher: 'Ms. Sarah Johnson' },
  ];

  const quickActions = [
    { title: 'View Syllabus', subtitle: 'Check course content', icon: BookOpen, path: '/student/syllabus', color: 'bg-blue-500' },
    { title: 'My Progress', subtitle: 'Track performance', icon: TrendingUp, path: '/student/progress', color: 'bg-green-500' },
    { title: 'AI Tutor', subtitle: 'Get help instantly', icon: MessageSquare, path: '/student/ai-tutor', color: 'bg-purple-500' },
    { title: 'Attendance', subtitle: 'View attendance', icon: ClipboardCheck, path: '/student/attendance', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Hello, Student 👋</h1>
        <p className="text-primary-foreground/90 text-lg">
          Keep up the great work! You have {upcomingTests.length} upcoming tests.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Attendance" value="95%" icon={ClipboardCheck} variant="success" subtitle="This month" delay={0.1} />
        <StatsCard title="Average Marks" value="85%" icon={TrendingUp} variant="primary" subtitle="Overall" delay={0.15} />
        <StatsCard title="Class Rank" value="#12" icon={Award} variant="warning" subtitle="Out of 40" delay={0.2} />
        <StatsCard title="Subjects" value="6" icon={BookOpen} variant="default" subtitle="Active courses" delay={0.25} />
      </div>

      {/* Quick Actions */}
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

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Tests */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle className="text-xl">Upcoming Tests</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{test.subject}</h4>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">{test.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{test.chapter}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{test.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Marks */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-xl">Recent Marks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMarks.map((mark, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-base">{mark.subject}</h4>
                      <p className="text-sm text-muted-foreground">{mark.test}</p>
                    </div>
                    <span className={`text-2xl font-bold ${
                      mark.marks >= 90 ? 'text-green-600' :
                      mark.marks >= 75 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {mark.grade}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-semibold">{mark.marks}/{mark.maxMarks}</span>
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

      {/* Today's Homework */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-xl">Today's Homework</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayDiary.map((diary, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">{diary.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{diary.homework}</p>
                    <p className="text-xs text-muted-foreground">By {diary.teacher}</p>
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
