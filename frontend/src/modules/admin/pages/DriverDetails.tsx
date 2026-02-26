import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  Car,
  Route as RouteIcon,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatedPage } from '@/components/AnimatedPage';
import { AnimatedCard } from '@/components/AnimatedCard';
import { adminService } from '@/services/admin.service';
import { Driver, DriverActivity, RouteResponse, Trip, TripType } from '@/types';
import { format } from 'date-fns';

export const DriverDetails: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [tripTypeFilter, setTripTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('TODAY');

  // Fetch all drivers to find the specific one
  const {
    data: drivers,
    isLoading: isLoadingDriver,
    error: driverError,
  } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: () => adminService.fetchDrivers(),
    enabled: !!driverId,
  });

  // Fetch driver activity
  const {
    data: driverActivities,
    isLoading: isLoadingActivity,
  } = useQuery<DriverActivity[]>({
    queryKey: ['driverActivity'],
    queryFn: () => adminService.fetchDriverActivity(),
    enabled: !!driverId,
    refetchInterval: 10000,
  });

  // Fetch driver's assigned routes
  const {
    data: driverRoutes,
    isLoading: isLoadingRoutes,
  } = useQuery<RouteResponse[]>({
    queryKey: ['driverRoutes', driverId],
    queryFn: () => adminService.fetchDriverRoutes(driverId!),
    enabled: !!driverId,
  });

  // Fetch driver trip history
  const {
    data: trips,
    isLoading: isLoadingTrips,
  } = useQuery<Trip[]>({
    queryKey: ['driverTrips', driverId, routeFilter, tripTypeFilter, dateFilter],
    queryFn: () => {
      const filters: import('@/types').DriverTripFilters = {};
      
      // Apply date filter
      const today = new Date();
      if (dateFilter === 'TODAY') {
        filters.startDate = today.toISOString().split('T')[0];
        filters.endDate = today.toISOString().split('T')[0];
      } else if (dateFilter === 'WEEK') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filters.startDate = weekAgo.toISOString().split('T')[0];
        filters.endDate = today.toISOString().split('T')[0];
      } else if (dateFilter === 'MONTH') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filters.startDate = monthAgo.toISOString().split('T')[0];
        filters.endDate = today.toISOString().split('T')[0];
      }
      
      // Apply route filter
      if (routeFilter !== 'ALL') {
        filters.routeId = routeFilter;
      }
      
      // Apply trip type filter
      if (tripTypeFilter !== 'ALL') {
        filters.tripType = tripTypeFilter as TripType;
      }
      
      return adminService.fetchDriverTrips(driverId!, filters);
    },
    enabled: !!driverId,
  });

  const driver = drivers?.find(d => d.id === driverId);
  const activity = driverActivities?.find(a => a.driverId === driverId);

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  const getTripTypeBadge = (tripType: TripType) => {
    return tripType === 'PICKUP' ? (
      <Badge variant="default" className="bg-green-500">Pickup</Badge>
    ) : (
      <Badge variant="default" className="bg-blue-500">Drop</Badge>
    );
  };

  const getTripStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const getActivityStatusBadge = (status?: DriverActivity['status']) => {
    if (!status) return null;
    
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500">Active on Trip</Badge>;
      case 'IDLE':
        return <Badge variant="secondary">Idle</Badge>;
      case 'OFFLINE':
        return <Badge variant="secondary" className="bg-gray-400">Offline</Badge>;
    }
  };

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy hh:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  if (driverError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/drivers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Drivers
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-sm text-destructive">
                Failed to load driver details. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoadingDriver && !driver) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/drivers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Drivers
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                Driver not found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/drivers')} className="touch-target">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isLoadingDriver ? (
                  <Skeleton className="h-9 w-64" />
                ) : (
                  driver?.name
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Driver details and activity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Driver Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDriver ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : driver ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </p>
                  <p className="text-lg font-semibold">{driver.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold">{driver.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </p>
                  <Badge variant={getStatusBadgeVariant(driver.status)} className="text-sm">
                    {driver.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    License Number
                  </p>
                  <p className="text-lg font-semibold">
                    {driver.licenseNumber || (
                      <span className="text-muted-foreground italic text-base">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Number
                  </p>
                  <p className="text-lg font-semibold">
                    {driver.vehicleNumber || (
                      <span className="text-muted-foreground italic text-base">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <RouteIcon className="h-4 w-4" />
                    Primary Route
                  </p>
                  {driver.routeName ? (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-lg font-semibold"
                      onClick={() => navigate(`/admin/routes/${driver.routeId}`)}
                    >
                      {driver.routeName}
                    </Button>
                  ) : (
                    <p className="text-muted-foreground italic text-base">Unassigned</p>
                  )}
                  {driverRoutes && driverRoutes.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{driverRoutes.length - 1} more route{driverRoutes.length - 1 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Current Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Activity</CardTitle>
            <CardDescription>Real-time driver status and activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivity ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : activity ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Current Status
                  </p>
                  {getActivityStatusBadge(activity.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trips Today
                  </p>
                  <p className="text-2xl font-bold">{activity.totalTripsToday}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Last Trip Start
                  </p>
                  <p className="text-sm font-semibold">
                    {activity.lastTripStartTime ? (
                      formatDateTime(activity.lastTripStartTime)
                    ) : (
                      <span className="text-muted-foreground italic">No trips today</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Last GPS Update
                  </p>
                  <p className="text-sm font-semibold">
                    {activity.lastGPSTimestamp ? (
                      formatDateTime(activity.lastGPSTimestamp)
                    ) : (
                      <span className="text-muted-foreground italic">No GPS data</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No activity data available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Trip Card */}
        {activity?.currentTripId && (
          <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                Active Trip
              </CardTitle>
              <CardDescription>
                Driver is currently on an active trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trip ID</p>
                  <p className="font-mono text-sm">{activity.currentTripId}</p>
                </div>
                <Button
                  onClick={() => navigate(`/admin/trips/${activity.currentTripId}`)}
                  className="touch-target"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View Trip Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assigned Routes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="h-5 w-5" />
              Assigned Routes
            </CardTitle>
            <CardDescription>
              Routes currently assigned to this driver
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRoutes ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !driverRoutes || driverRoutes.length === 0 ? (
              <div className="text-center py-8">
                <RouteIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No routes assigned to this driver.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {driverRoutes.map((route) => (
                  <AnimatedCard key={route.id}>
                    <div
                      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/admin/routes/${route.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold">{route.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {route.studentCount} student{route.studentCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-primary">Click to view route details</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Activity Log */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Driver Activity Log
                </CardTitle>
                <CardDescription>
                  Trip history with filters by date, route, and trip type
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              {/* Date Filter */}
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-full sm:w-[140px] touch-target">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAY">Today</SelectItem>
                  <SelectItem value="WEEK">Last 7 Days</SelectItem>
                  <SelectItem value="MONTH">Last 30 Days</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>

              {/* Route Filter */}
              <Select
                value={routeFilter}
                onValueChange={setRouteFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] touch-target">
                  <SelectValue placeholder="All Routes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Routes</SelectItem>
                  {driverRoutes?.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Trip Type Filter */}
              <Select
                value={tripTypeFilter}
                onValueChange={setTripTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[140px] touch-target">
                  <SelectValue placeholder="Trip Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="PICKUP">Pickup</SelectItem>
                  <SelectItem value="DROP">Drop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trip History Table */}
            {isLoadingTrips ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !trips || trips.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Trips Found</h3>
                <p className="text-sm text-muted-foreground">
                  {dateFilter !== 'ALL' || routeFilter !== 'ALL' || tripTypeFilter !== 'ALL'
                    ? 'Try adjusting your filters to see more trips'
                    : 'No trip history available for this driver'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[180px]">Route Name</TableHead>
                      <TableHead className="min-w-[100px]">Trip Type</TableHead>
                      <TableHead className="min-w-[100px]">Start Time</TableHead>
                      <TableHead className="min-w-[100px]">End Time</TableHead>
                      <TableHead className="min-w-[120px]">Attendance</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(trip.tripDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{trip.routeName}</TableCell>
                        <TableCell>{getTripTypeBadge(trip.tripType)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {format(new Date(trip.startTime), 'hh:mm a')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {trip.endTime ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {format(new Date(trip.endTime), 'hh:mm a')}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">In progress</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium text-green-600">
                              {trip.presentStudents}
                            </span>
                            <span className="text-muted-foreground"> / </span>
                            <span>{trip.totalStudents}</span>
                            {trip.absentStudents > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({trip.absentStudents} absent)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTripStatusBadge(trip.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};
