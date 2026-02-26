import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bus, 
  Clock, 
  Navigation,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { LiveMap } from '../components/LiveMap';
import { parentService } from '@/services/parent.service';
import { LiveRouteTracking, ParentDashboardStats } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';

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

export const ParentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
  } = useQuery<ParentDashboardStats>({
    queryKey: ['parentDashboardStats'],
    queryFn: () => parentService.fetchDashboardStats(),
    refetchInterval: 30000,
  });

  // Fetch live tracking data
  const { 
    data: tracking, 
    isLoading: trackingLoading, 
    error: trackingError,
    refetch: refetchTracking,
    isRefetching
  } = useQuery<LiveRouteTracking[]>({
    queryKey: ['liveTracking'],
    queryFn: () => parentService.fetchLiveTracking(),
    refetchInterval: autoRefresh ? 10000 : false,
    refetchIntervalInBackground: false,
  });

  // Fetch children transport info
  const {
    data: children,
    isLoading: childrenLoading,
  } = useQuery({
    queryKey: ['childrenTransport'],
    queryFn: () => parentService.fetchChildrenTransport(),
    refetchInterval: 30000,
  });

  // Fetch children attendance
  const {
    data: childrenAttendance,
    isLoading: attendanceLoading,
  } = useQuery({
    queryKey: ['childrenAttendance'],
    queryFn: async () => {
      if (!children) return [];
      const { adminService } = await import('@/services/admin.service');
      const attendancePromises = children.map(child => 
        adminService.fetchStudentAttendance(child.id).catch(() => null)
      );
      return Promise.all(attendancePromises);
    },
    enabled: !!children && children.length > 0,
  });

  const handleManualRefresh = () => {
    refetchTracking();
  };

  const getTripStatusBadge = (status: LiveRouteTracking['tripStatus']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const formatETA = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    try {
      const eta = new Date(timestamp);
      return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const activeTracking = tracking?.filter(t => t.tripStatus === 'ACTIVE') || [];

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Parent'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Track your children's school bus in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefetching}
              className="touch-target"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="touch-target"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {autoRefresh ? 'Auto On' : 'Auto Off'}
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats ? (
            <>
              <StatCard
                title="My Children"
                value={stats.myChildren}
                icon={<Bus className="h-4 w-4" />}
                description="Using transport"
              />
              <StatCard
                title="Active Routes"
                value={stats.activeRoutes}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Currently running"
              />
              <StatCard
                title="Trips This Week"
                value={stats.upcomingTrips}
                icon={<Calendar className="h-4 w-4" />}
                description="Scheduled trips"
              />
            </>
          ) : null}
        </div>

        {/* My Children Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Children
            </CardTitle>
            <CardDescription>
              Your children using school transport and their attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {childrenLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : !children || children.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No children registered in the transport system.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {children.map((child, index) => {
                  const attendance = childrenAttendance?.[index];
                  return (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{child.name}</CardTitle>
                                {child.grade && (
                                  <CardDescription className="text-xs mt-1">
                                    {child.grade}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Route Info */}
                          {child.routeName && (
                            <div className="p-2 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Assigned Route</p>
                              <p className="text-sm font-semibold">{child.routeName}</p>
                            </div>
                          )}

                          {/* Attendance Summary */}
                          {attendanceLoading ? (
                            <Skeleton className="h-20 w-full" />
                          ) : attendance ? (
                            <div className="p-3 border rounded-lg space-y-2">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Attendance Summary
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <p className="text-lg font-bold text-green-600">
                                      {attendance.presentCount}
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Present</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <XCircle className="h-3 w-3 text-red-600" />
                                    <p className="text-lg font-bold text-red-600">
                                      {attendance.absentCount}
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Absent</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp className="h-3 w-3 text-primary" />
                                    <p className="text-lg font-bold text-primary">
                                      {attendance.attendancePercentage}%
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Rate</p>
                                </div>
                              </div>
                            </div>
                          ) : child.routeId ? (
                            <div className="p-3 border rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">
                                No attendance data available
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 border rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">
                                Not assigned to a route
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Bus Tracking
            </CardTitle>
            <CardDescription>
              Real-time location of buses on your children's routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trackingLoading ? (
              <Skeleton className="h-[500px] w-full rounded-lg" />
            ) : trackingError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load Tracking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Failed to load live tracking data. Please try again.
                </p>
                <Button onClick={handleManualRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : !tracking || tracking.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Routes</h3>
                <p className="text-sm text-muted-foreground">
                  Your children are not assigned to any active routes at the moment.
                </p>
              </div>
            ) : activeTracking.length > 0 ? (
              <LiveMap tracking={activeTracking} height="500px" />
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Buses</h3>
                <p className="text-sm text-muted-foreground">
                  There are no buses currently active on your children's routes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transport Schedule Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Transport Schedule
            </CardTitle>
            <CardDescription>
              Pickup and drop-off times for your children's routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trackingLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : !tracking || tracking.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No schedule information available.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tracking.map((route) => (
                  <motion.div
                    key={route.routeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{route.routeName}</CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {route.vehicleNumber || 'Vehicle info not available'}
                            </CardDescription>
                          </div>
                          {getTripStatusBadge(route.tripStatus)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Pickup Time */}
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Pickup Time</p>
                              <p className="text-sm font-semibold">7:30 AM</p>
                            </div>
                          </div>
                        </div>

                        {/* Drop-off Time */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Drop-off Time</p>
                              <p className="text-sm font-semibold">3:30 PM</p>
                            </div>
                          </div>
                        </div>

                        {/* Average Travel Time */}
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Avg. Travel Time</p>
                              <p className="text-sm font-semibold">25-30 minutes</p>
                            </div>
                          </div>
                        </div>

                        {/* Live Status */}
                        {route.currentLocation && route.tripStatus === 'ACTIVE' && (
                          <div className="pt-3 border-t space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Current Speed</span>
                              <span className="font-medium">
                                {route.currentLocation.speed || 0} km/h
                              </span>
                            </div>
                            {route.estimatedArrival && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Est. Arrival
                                </span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {formatETA(route.estimatedArrival)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-muted-foreground">Last Updated</span>
                              <span className="text-muted-foreground">
                                {formatLastUpdated(route.lastUpdated)}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Notice */}
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  About Live Tracking
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  The map shows real-time bus locations when trips are active. 
                  Tracking updates automatically every 10 seconds. 
                  Times shown are estimates and may vary based on traffic conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};
