import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Route as RouteIcon, 
  TrendingUp, 
  UserCheck,
  Plus,
  UserPlus,
  FileText,
  Clock,
  Navigation as NavigationIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { useAuthStore } from '@/stores/authStore';
import { adminService } from '@/services/admin.service';
import { DashboardStats, RecentActivity } from '@/types';
import { CreateRouteDialog } from '../components/CreateRouteDialog';
import { toast } from 'sonner';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="cursor-default">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
};

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'ROUTE_CREATED':
      return <RouteIcon className="h-4 w-4" />;
    case 'DRIVER_ASSIGNED':
      return <UserCheck className="h-4 w-4" />;
    case 'STUDENT_ASSIGNED':
      return <Users className="h-4 w-4" />;
    case 'ROUTE_UPDATED':
      return <FileText className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isCreateRouteDialogOpen, setIsCreateRouteDialogOpen] = useState(false);

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => adminService.fetchDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch recent activity
  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error: activitiesError 
  } = useQuery<RecentActivity[]>({
    queryKey: ['recentActivity'],
    queryFn: () => adminService.fetchRecentActivity(5),
    refetchInterval: 30000,
  });

  const handleCreateRoute = () => {
    setIsCreateRouteDialogOpen(true);
  };

  const handleAssignDriver = () => {
    navigate('/admin/routes');
    toast.info('Select a route to assign a driver');
  };

  const handleViewReports = () => {
    navigate('/admin/live-monitoring');
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Admin'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Here's what's happening with your transport operations today.
          </p>
        </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : statsError ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Failed to load dashboard statistics. Please try again later.
              </p>
            </CardContent>
          </Card>
        ) : stats ? (
          <>
            <StatCard
              title="Total Routes"
              value={stats.totalRoutes}
              icon={<RouteIcon className="h-4 w-4" />}
              description="All configured routes"
            />
            <StatCard
              title="Active Routes"
              value={stats.activeRoutes}
              icon={<TrendingUp className="h-4 w-4" />}
              description="Currently operational"
            />
            <StatCard
              title="Total Drivers"
              value={stats.totalDrivers}
              icon={<UserCheck className="h-4 w-4" />}
              description="Registered drivers"
            />
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<Users className="h-4 w-4" />}
              description="Students using transport"
            />
          </>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your transport system</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activitiesError ? (
              <p className="text-sm text-muted-foreground">
                Unable to load recent activity.
              </p>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleCreateRoute}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Route
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleAssignDriver}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Driver
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleViewReports}
            >
              <NavigationIcon className="mr-2 h-4 w-4" />
              Live Monitoring
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Route Dialog */}
      <CreateRouteDialog
        open={isCreateRouteDialogOpen}
        onOpenChange={setIsCreateRouteDialogOpen}
      />
      </div>
    </AnimatedPage>
  );
};
