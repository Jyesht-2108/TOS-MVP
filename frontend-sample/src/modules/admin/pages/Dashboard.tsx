import { Users, GraduationCap, DollarSign, UserCheck } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { EventCalendar } from '@/components/calendar/EventCalendar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { calendarService } from '@/services/calendar.service';
import { CalendarEvent } from '@/components/calendar/EventCalendar';

export default function AdminDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    calendarService.getEvents().then(setEvents);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome back, Admin 👋</h1>
        <p className="text-primary-foreground/90 text-lg">
          Here's what's happening in your school today
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="450"
          icon={Users}
          variant="primary"
          trend="+12 this month"
          delay={0.1}
        />
        <StatsCard
          title="Total Teachers"
          value="35"
          icon={UserCheck}
          variant="success"
          subtitle="Active staff"
          delay={0.15}
        />
        <StatsCard
          title="Classes"
          value="12"
          icon={GraduationCap}
          variant="default"
          subtitle="Active classes"
          delay={0.2}
        />
        <StatsCard
          title="Revenue"
          value="₹2.5L"
          icon={DollarSign}
          variant="warning"
          trend="This month"
          delay={0.25}
        />
      </div>

      {/* Event Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <EventCalendar events={events} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-5">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New admission', detail: 'John Doe - Grade 5', time: '2 hours ago' },
              { action: 'Payment received', detail: '₹15,000 from Mary Jane', time: '3 hours ago' },
              { action: 'Attendance marked', detail: 'Grade 6 A - 38/40 present', time: '5 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                <div className="flex-1">
                  <p className="text-base font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                </div>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction title="Add Student" subtitle="Enroll new student" />
            <QuickAction title="Create Class" subtitle="Setup new class" />
            <QuickAction title="Generate Invoice" subtitle="Create fee invoice" />
            <QuickAction title="View Reports" subtitle="Analytics & insights" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QuickAction({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-start gap-2 p-4 rounded-lg border border-border hover:border-primary/30 transition-all text-left"
    >
      <p className="text-base font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </motion.button>
  );
}
