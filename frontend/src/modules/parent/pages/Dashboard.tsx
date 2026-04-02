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
import { ChildLiveMap } from '../components/ChildLiveMap';
import { parentService } from '@/services/parent.service';
import { ParentDashboardStats } from '@/types';
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

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
  } = useQuery<ParentDashboardStats>({
    queryKey: ['parentDashboardStats'],
    queryFn: () => parentService.fetchDashboardStats(),
    refetchInterval: 30000,
  });

  // Fetch active live trip
  const { 
    data: liveTrip, 
    isLoading: liveTripLoading,
    refetch: refetchLiveTrip,
    isRefetching
  } = useQuery({
    queryKey: ['parentLiveTrip'],
    queryFn: async () => {
      try {
        return await parentService.fetchActiveLiveTrip();
      } catch (error) {
        // Silently return null on any error (404 is expected when no trips)
        return null;
      }
    },
    refetchInterval: 30000, // Check for new trips every 30 seconds
    retry: false, // Don't retry on errors
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
    queryKey: ['childrenAttendance', children?.map(c => c.id).join(',')],
    queryFn: async () => {
      if (!children) return [];
      const attendancePromises = children.map(child => 
        parentService.fetchChildAttendance(child.id).catch(() => null)
      );
      return Promise.all(attendancePromises);
    },
    enabled: !!children && children.length > 0,
    refetchInterval: 30000, // Refresh attendance every 30 seconds
  });

  const handleManualRefresh = () => {
    refetchLiveTrip();
  };

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

        {/* Live Bus Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Bus Tracking
            </CardTitle>
            <CardDescription>
              Real-time location of your child's bus
            </CardDescription>
          </CardHeader>
          <CardContent>
            {liveTripLoading ? (
              <Skeleton className="h-[500px] w-full rounded-lg" />
            ) : !liveTrip ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Trips</h3>
                <p className="text-sm text-muted-foreground">
                  No active trips right now. We will notify you when the bus starts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Trip Info Banner */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          <Navigation className="mr-1 h-3 w-3" />
                          Active Trip
                        </Badge>
                        <Badge variant="outline">{liveTrip.tripType}</Badge>
                      </div>
                      <div>
                        <p className="font-semibold">{liveTrip.routeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {liveTrip.childName} • {liveTrip.vehicleNumber || 'Vehicle info not available'}
                        </p>
                        {liveTrip.driverName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Driver: {liveTrip.driverName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Map with Polling */}
                <ChildLiveMap
                  routeId={liveTrip.routeId}
                  routeName={liveTrip.routeName}
                  vehicleNumber={liveTrip.vehicleNumber}
                  driverName={liveTrip.driverName}
                  childName={liveTrip.childName}
                  height="500px"
                />
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
                  The map shows real-time bus location when your child's trip is active. 
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
