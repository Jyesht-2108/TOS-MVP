import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, ClipboardCheck, 
  FileText, MessageSquare, DollarSign, Image, BarChart3,
  Settings, ChevronLeft, ChevronRight, School
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const roleNavItems = {
  admin: [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'Users', path: '/admin/users', icon: Users },
    { title: 'Classes', path: '/admin/classes', icon: GraduationCap },
    { title: 'Gallery', path: '/admin/gallery', icon: Image },
    { title: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { title: 'Settings', path: '/admin/settings', icon: Settings },
  ],
  teacher: [
    { title: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { title: 'Schedule', path: '/teacher/schedule', icon: LayoutDashboard },
    { title: 'Students', path: '/teacher/students', icon: Users },
    { title: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck },
    { title: 'Marks', path: '/teacher/marks', icon: FileText },
    { title: 'Diary', path: '/teacher/diary', icon: MessageSquare },
    { title: 'Materials', path: '/teacher/materials', icon: FileText },
  ],
  student: [
    { title: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { title: 'Attendance', path: '/student/attendance', icon: ClipboardCheck },
    { title: 'Homework', path: '/student/homework', icon: FileText },
    { title: 'Tests', path: '/student/tests', icon: FileText },
    { title: 'Syllabus', path: '/student/syllabus', icon: FileText },
    { title: 'Progress', path: '/student/progress', icon: BarChart3 },
    { title: 'AI Tutor', path: '/student/ai-tutor', icon: MessageSquare },
  ],
  parent: [
    { title: 'Dashboard', path: '/parent', icon: LayoutDashboard },
    { title: 'Attendance', path: '/parent/attendance', icon: ClipboardCheck },
    { title: 'Progress', path: '/parent/progress', icon: BarChart3 },
    { title: 'Payments', path: '/parent/payments', icon: DollarSign },
    { title: 'Messages', path: '/parent/messages', icon: MessageSquare },
  ],
  accountant: [
    { title: 'Dashboard', path: '/accountant', icon: LayoutDashboard },
    { title: 'Invoices', path: '/accountant/invoices', icon: FileText },
    { title: 'Payments', path: '/accountant/payments', icon: DollarSign },
    { title: 'Reports', path: '/accountant/reports', icon: BarChart3 },
  ],
  admissions_staff: [
    { title: 'Dashboard', path: '/admissions', icon: LayoutDashboard },
  ],
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = user?.role ? roleNavItems[user.role as keyof typeof roleNavItems] || roleNavItems.admin : roleNavItems.admin;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-30"
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <School className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg text-sidebar-foreground"
            >
              School SaaS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative",
                isActive
                  ? "bg-sidebar-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className="w-5 h-5 shrink-0 relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
