import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Navigation,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  Car,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { adminService } from '@/services/admin.service';
import { ActiveTrip, DriverActivity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export const LiveMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tripsSearchQuery, setTripsSearchQuery] = useState('');
  const [driversSearchQuery, setDriversSearchQuery] = useState('');

  // Fetch active trips
  const {
    data: activeTrips,
    isLoading: isLoadingTrips,
    error: tripsError,
    refetch: refetchTrips,
    isRefetching: isRefetchingTrips,
  } = useQuery<ActiveTrip[]>({
    queryKey: ['activeTrips'],
    queryFn: () => adminService.fetchActiveTrips(),
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds
  });

  // Fetch driver activity
  const {
    data: driverActivity,
    isLoading: isLoadingDrivers,
  } = useQuery<DriverActivity[]>({
    queryKey: ['driverActivity'],
    queryFn: () => adminService.fetchDriverActivity(),
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const handleManualRefresh = () => {
    refetchTrips();
  };

  const getGPSHealthBadge = (status: ActiveTrip['gpsHealthStatus']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Healthy
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge variant="default" className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      case 'STALE':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Stale
          </Badge>
        );
    }
  };

  const formatLastPing = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const getDriverStatusBadge = (status: DriverActivity['status']) => {
    if (status === 'ACTIVE') {
      return <Badge className="bg-green-500">Active</Badge>;
    }
    return <Badge className="bg-gray-500">Inactive</Badge>;
  };

  // Filter active trips by search query
  const filteredActiveTrips = React.useMemo(() => {
    if (!activeTrips) return [];
    
    if (!tripsSearchQuery) return activeTrips;
    
    const query = tripsSearchQuery.toLowerCase();
    return activeTrips.filter(trip => 
      trip.routeName.toLowerCase().includes(query) ||
      trip.vehicleNumber?.toLowerCase().includes(query) ||
      trip.driverName.toLowerCase().includes(query) ||
      trip.driverPhone?.toLowerCase().includes(query)
    );
  }, [activeTrips, tripsSearchQuery]);

  // Filter driver activity by search query
  const filteredDriverActivity = React.useMemo(() => {
    if (!driverActivity) return [];
    
    if (!driversSearchQuery) return driverActivity;
    
    const query = driversSearchQuery.toLowerCase();
    return driverActivity.filter(driver => 
      driver.driverName.toLowerCase().includes(query) ||
      driver.vehicleNumber?.toLowerCase().includes(query) ||
      driver.status.toLowerCase().includes(query)
    );
  }, [driverActivity, driversSearchQuery]);

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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Live Monitoring</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Monitor active trips and driver activity in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefetchingTrips}
              className="touch-target"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetchingTrips ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="touch-target"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
            </Button>
          </div>
        </motion.div>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>
              Currently running trips with live GPS tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by route, vehicle, driver, or phone..."
                  value={tripsSearchQuery}
                  onChange={(e) => setTripsSearchQuery(e.target.value)}
                  className="pl-9 touch-target"
                />
              </div>
            </div>

            {isLoadingTrips ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : tripsError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-sm text-destructive">
                  Failed to load active trips. Please try again.
                </p>
              </div>
            ) : !activeTrips || activeTrips.length === 0 ? (
              <div className="text-center py-12">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Trips</h3>
                <p className="text-sm text-muted-foreground">
                  There are no active trips at the moment.
                </p>
              </div>
            ) : filteredActiveTrips.length === 0 ? (
              <div className="text-center py-12">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trips found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Route / Vehicle</TableHead>
                      <TableHead className="min-w-[150px]">Driver</TableHead>
                      <TableHead className="min-w-[120px]">GPS Status</TableHead>
                      <TableHead className="min-w-[150px]">Attendance</TableHead>
                      <TableHead className="min-w-[120px]">Last Ping</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActiveTrips.map((trip) => (
                      <TableRow key={trip.tripId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{trip.routeName}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Car className="h-3 w-3" />
                              <span>{trip.vehicleNumber || 'N/A'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{trip.driverName}</p>
                            {trip.driverPhone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Phone className="h-3 w-3" />
                                <span>{trip.driverPhone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getGPSHealthBadge(trip.gpsHealthStatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {trip.presentStudents}/{trip.totalStudents}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({Math.round((trip.presentStudents / trip.totalStudents) * 100)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatLastPing(trip.lastGPSPing)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/admin/trips/${trip.tripId}`)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Activity</CardTitle>
            <CardDescription>
              Current status and activity of all drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by driver name, vehicle, or status..."
                  value={driversSearchQuery}
                  onChange={(e) => setDriversSearchQuery(e.target.value)}
                  className="pl-9 touch-target"
                />
              </div>
            </div>

            {isLoadingDrivers ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !driverActivity || driverActivity.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No driver activity data available.
                </p>
              </div>
            ) : filteredDriverActivity.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Driver / Vehicle</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Trips Today</TableHead>
                      <TableHead className="min-w-[150px]">Last GPS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDriverActivity.map((driver) => (
                      <TableRow key={driver.driverId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{driver.driverName}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Car className="h-3 w-3" />
                              <span>{driver.vehicleNumber || 'N/A'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getDriverStatusBadge(driver.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{driver.totalTripsToday}</span>
                        </TableCell>
                        <TableCell>
                          {driver.lastGPSTimestamp ? (
                            <span className="text-xs text-muted-foreground">
                              {formatLastPing(driver.lastGPSTimestamp)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No data</span>
                          )}
                        </TableCell>
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
